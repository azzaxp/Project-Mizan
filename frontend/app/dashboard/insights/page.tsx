"use client";

import DataAgentChat from "@/components/DataAgentChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Wallet, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth";

interface QuickStats {
    totalHouseholds: number;
    zakatEligible: number;
    totalMembers: number;
    thisMonthIncome: number;
}

export default function InsightsPage() {
    const [stats, setStats] = useState<QuickStats | null>(null);

    useEffect(() => {
        // Fetch quick stats for the sidebar
        async function loadStats() {
            try {
                // Fetch households
                const hhRes = await fetchWithAuth("/api/jamath/households/");
                const households = await hhRes.json();

                // Fetch members
                const memRes = await fetchWithAuth("/api/jamath/members/");
                const members = await memRes.json();

                // Fetch transactions (this month)
                const today = new Date();
                const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                const txRes = await fetchWithAuth(`/api/ledger/journal-entries/?date__gte=${firstOfMonth}`);
                const transactions = await txRes.json();

                const income = Array.isArray(transactions)
                    ? transactions
                        .filter((t: any) => t.transaction_type === 'RECEIPT')
                        .reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0)
                    : 0;

                setStats({
                    totalHouseholds: Array.isArray(households) ? households.length : 0,
                    zakatEligible: Array.isArray(households)
                        ? households.filter((h: any) => h.economic_status === 'ZAKAT_ELIGIBLE').length
                        : 0,
                    totalMembers: Array.isArray(members) ? members.length : 0,
                    thisMonthIncome: income
                });
            } catch (error) {
                console.error("Failed to load stats", error);
            }
        }
        loadStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg">
                    <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Data Insights</h1>
                    <p className="text-sm text-gray-500">Ask Basira about your Jamath data</p>
                </div>
            </div>

            {/* Quick Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalHouseholds}</p>
                                    <p className="text-xs text-gray-500">Households</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.zakatEligible}</p>
                                    <p className="text-xs text-gray-500">Zakat Eligible</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-purple-500" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalMembers}</p>
                                    <p className="text-xs text-gray-500">Members</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-white/80 dark:bg-gray-800/80">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Wallet className="h-5 w-5 text-emerald-500" />
                                <div>
                                    <p className="text-2xl font-bold">₹{stats.thisMonthIncome.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">This Month</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Chat Interface */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950">
                <CardContent className="p-0">
                    <DataAgentChat />
                </CardContent>
            </Card>
        </div>
    );
}
