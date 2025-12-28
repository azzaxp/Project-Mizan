"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, User, Briefcase, GraduationCap, Heart, Calendar, Star, Users, Plus, Loader2 } from "lucide-react";

type Member = {
    id: number;
    full_name: string;
    is_head_of_family: boolean;
    relationship_to_head: string;
    gender: string;
    dob: string | null;
    age: number | null;
    marital_status: string;
    profession: string;
    education: string;
    skills: string;
    is_employed: boolean;
    monthly_income: string | null;
    requirements: string;
    is_alive: boolean;
    is_approved: boolean;
};

type Household = {
    id: number;
    membership_id: string;
    head_name: string;
    members: Member[];
};

export default function PortalFamilyPage() {
    const router = useRouter();
    const [household, setHousehold] = useState<Household | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/portal/login");
            return;
        }
        fetchProfile(token);
    }, [router]);

    const fetchProfile = async (token: string) => {
        try {
            const protocol = window.location.protocol;
            const hostname = window.location.hostname;
            const apiBase = `${protocol}//${hostname}:8000`;

            const res = await fetch(`${apiBase}/api/portal/profile/`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.status === 401) {
                router.push("/portal/login");
                return;
            }

            const data = await res.json();
            setHousehold(data.household);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const formData = new FormData(e.currentTarget);
        const data = {
            full_name: formData.get("full_name"),
            relationship_to_head: formData.get("relationship_to_head"),
            gender: formData.get("gender"),
            marital_status: formData.get("marital_status"),
            profession: formData.get("profession"),
            education: formData.get("education"),
        };

        try {
            const protocol = window.location.protocol;
            const hostname = window.location.hostname;
            const apiBase = `${protocol}//${hostname}:8000`;

            const res = await fetch(`${apiBase}/api/portal/members/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const newMember = await res.json();
                // Refresh list or optimistic update
                fetchProfile(token);
                setIsDialogOpen(false);
            } else {
                console.error("Failed to add member");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getGenderColor = (gender: string) => {
        return gender === "FEMALE" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700";
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                        <h1 className="font-bold text-lg ml-4">Family Profile</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 text-black">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Loading family data...</div>
                ) : !household ? (
                    <div className="text-center py-12 text-red-500">Failed to load data.</div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <Card className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-teal-100 text-sm font-medium mb-1">Head of Family</p>
                                        <h2 className="text-2xl font-bold">{household.head_name}</h2>
                                        <p className="text-teal-100 text-sm mt-1">Membership ID: {household.membership_id}</p>
                                    </div>
                                    <Avatar className="h-16 w-16 border-4 border-white/20 bg-white/10">
                                        <AvatarFallback className="bg-transparent text-white text-xl">
                                            {getInitials(household.head_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                Family Members ({household.members.length})
                            </h3>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" /> Add Member
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add Family Member</DialogTitle>
                                        <DialogDescription>
                                            Add details for a new family member. They will need approval.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddMember} className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="full_name">Full Name</Label>
                                                <Input id="full_name" name="full_name" required placeholder="e.g. John Doe" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="gender">Gender</Label>
                                                <Select name="gender" defaultValue="MALE">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="MALE">Male</SelectItem>
                                                        <SelectItem value="FEMALE">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="relationship">Relation</Label>
                                                <Select name="relationship_to_head" defaultValue="SON">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="WIFE">Wife</SelectItem>
                                                        <SelectItem value="SON">Son</SelectItem>
                                                        <SelectItem value="DAUGHTER">Daughter</SelectItem>
                                                        <SelectItem value="FATHER">Father</SelectItem>
                                                        <SelectItem value="MOTHER">Mother</SelectItem>
                                                        <SelectItem value="BROTHER">Brother</SelectItem>
                                                        <SelectItem value="SISTER">Sister</SelectItem>
                                                        <SelectItem value="OTHER">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="marital_status">Marital Status</Label>
                                                <Select name="marital_status" defaultValue="SINGLE">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="SINGLE">Single</SelectItem>
                                                        <SelectItem value="MARRIED">Married</SelectItem>
                                                        <SelectItem value="DIVORCED">Divorced</SelectItem>
                                                        <SelectItem value="WIDOWED">Widowed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="education">Education</Label>
                                                <Input id="education" name="education" placeholder="e.g. B.Tech" />
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="profession">Profession</Label>
                                                <Input id="profession" name="profession" placeholder="e.g. Software Engineer" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                                    </>
                                                ) : (
                                                    "Add Member"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {household.members.map((member) => (
                                <Card
                                    key={member.id}
                                    className={`relative overflow-hidden transition-shadow hover:shadow-md ${member.is_head_of_family ? 'border-teal-500 border-l-4' : ''
                                        }`}
                                >
                                    <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className={getGenderColor(member.gender)}>
                                                    {getInitials(member.full_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-base font-semibold text-black">
                                                    {member.full_name}
                                                    {member.is_head_of_family && (
                                                        <Star className="inline-block h-3 w-3 text-yellow-500 ml-1 fill-yellow-500" />
                                                    )}
                                                </CardTitle>
                                                <p className="text-xs text-gray-400 capitalize">
                                                    {member.relationship_to_head}
                                                </p>
                                            </div>
                                        </div>
                                        {!member.is_approved && (
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-[10px]">
                                                Pending
                                            </Badge>
                                        )}
                                    </CardHeader>

                                    <CardContent className="text-sm space-y-3 pt-2">
                                        <div className="grid grid-cols-2 gap-2 text-gray-400">
                                            <div className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-2" />
                                                <span>{member.age ? `${member.age} yrs` : 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Heart className="h-3 w-3 mr-2" />
                                                <span className="capitalize">{member.marital_status?.toLowerCase()}</span>
                                            </div>
                                            <div className="flex items-center col-span-2">
                                                <Briefcase className="h-3 w-3 mr-2" />
                                                <span className="truncate">{member.profession || 'Unspecified'}</span>
                                            </div>
                                            <div className="flex items-center col-span-2">
                                                <GraduationCap className="h-3 w-3 mr-2" />
                                                <span className="truncate">{member.education || 'Unspecified'}</span>
                                            </div>
                                        </div>

                                        {member.requirements && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Looking for:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {member.requirements.split(',').map((req, i) => (
                                                        <Badge key={i} variant="outline" className="text-xs font-normal">
                                                            {req.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
