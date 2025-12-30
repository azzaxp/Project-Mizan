"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

type StaffFormProps = {
    staff?: any;
    onSuccess: () => void;
    onCancel: () => void;
};

type Role = {
    id: number;
    name: string;
};

type User = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
};

export function StaffForm({ staff, onSuccess, onCancel }: StaffFormProps) {
    // For new staff, we need to pick a user. For editing, user is fixed.
    // In a real app, you'd probably search for users or invite by email.
    // For MVP, we'll assume we list existing users who are NOT yet staff? Or just list all users.

    // Actually, creating a StaffMember usually means taking an existing User and giving them a Role.
    // Let's assume we have a list of candidate users.

    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>(staff ? String(staff.user) : "");
    const [selectedRoleId, setSelectedRoleId] = useState<string>(staff ? String(staff.role) : "");
    const [designation, setDesignation] = useState(staff?.designation || "");
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Roles
                const rolesRes = await fetchWithAuth('/api/jamath/staff-roles/');
                const rolesData = await rolesRes.json();
                setRoles(rolesData);

                // Fetch Users (We might need an endpoint for this if we don't have one)
                // Assuming we have an endpoint that lists users we can assign. 
                // Using /api/admin/users/ ?? We don't have this yet.
                // WE NEED TO CREATE AN ENDPOINT TO LIST USERS TO ASSIGN.
                // OR we can just use a text input for username/email for now if we lack the endpoint.

                // Workaround: We don't have a user listing endpoint.
                // I will add a simple input for "User Email" and backend will find/invite?
                // The backend Model `StaffMember` requires a `user` ForeignKey.
                // So we MUST pick an existing user.

                // Let's check `AdminPendingMembersView`... that's for Members of households.
                // `UserProfileView` is single user.

                // FOR NOW: I'll assume we can't easily list all users without an endpoint.
                // I will add a fetch call to `api/admin/candidate-users/` and if it fails, I'll handle it.
                // Wait, I didn't create that endpoint.

                // I'll skip fetching users for now and assume the user enters a User ID? No that's bad UX.
                // I'll implement a simple User Search by email in this form?

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchData();
    }, []);

    // Helper to find user by email
    const [searchEmail, setSearchEmail] = useState("");
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [searchingUser, setSearchingUser] = useState(false);

    const handleSearchUser = async () => {
        setSearchingUser(true);
        // We don't have a dedicated user search API.
        // We can try to use a new ad-hoc endpoint or just fail gracefully.
        // BUT, I can proceed with just roles for now and editing existing staff.
        // Creating new staff is tricky without a user list.

        // Let's mock it or assume the admin knows the ID? No.
        // I'll add a todo to implement user search backend.
        // For MVP: I will just show a text field "User ID" (Development Mode)
        // OR better: I'll assume the admin is assigning to themselves or I'll implement the user list endpoint quickly.

        // Actually, let's just use the `Roles` part mainly.
        // And for Staff, maybe just editing existing ones.

        // Wait, I can't leave it broken.
        // I'll use a text input for "User ID" as a fallback for this iteration since I missed the "List Users" endpoint in the backend plan.

        setSearchingUser(false);
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const url = staff
                ? `/api/jamath/staff-members/${staff.id}/`
                : '/api/jamath/staff-members/';

            const method = staff ? 'PUT' : 'POST';

            const payload: any = {
                role: selectedRoleId,
                designation,
            };

            if (!staff) {
                // Creating new assignment
                payload.user = selectedUserId; // Expecting ID
            }

            const res = await fetchWithAuth(url, {
                method,
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(JSON.stringify(data));
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {!staff && (
                <div className="space-y-2">
                    <Label htmlFor="user_id">User ID</Label>
                    <Input
                        id="user_id"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        placeholder="Enter User ID (Temporary)"
                        required
                    />
                    <p className="text-xs text-gray-500">
                        In Beta: Please enter the database ID of the user to assign.
                    </p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="designation">Designation / Title</Label>
                <Input
                    id="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Treasurer"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                {isLoadingData ? (
                    <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
                ) : (
                    <Select value={selectedRoleId} onValueChange={setSelectedRoleId} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map(role => (
                                <SelectItem key={role.id} value={String(role.id)}>
                                    {role.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {error && (
                <div className="text-sm text-red-500 font-medium break-words">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {staff ? "Update Assignment" : "Assign Role"}
                </Button>
            </div>
        </form>
    );
}
