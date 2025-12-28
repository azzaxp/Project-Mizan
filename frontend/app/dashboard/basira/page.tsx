"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, HelpCircle, BarChart3 } from "lucide-react";
import DataAgentChat from "@/components/DataAgentChat";
import BasiraHelpChat from "@/components/BasiraHelpChat";

export default function BasiraPage() {
    const [activeTab, setActiveTab] = useState("data");

    return (
        <div className="h-[calc(100vh-7rem)] flex flex-col -m-6">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 flex-shrink-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
                <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg">
                    <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Basira AI</h1>
                    <p className="text-sm text-gray-500">Your intelligent assistant for data insights and support</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <div className="px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <TabsList className="h-12 bg-transparent p-0 gap-4">
                        <TabsTrigger
                            value="data"
                            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg transition-colors"
                        >
                            <BarChart3 className="h-4 w-4" />
                            Data Insights
                        </TabsTrigger>
                        <TabsTrigger
                            value="help"
                            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/30 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300 rounded-lg transition-colors"
                        >
                            <HelpCircle className="h-4 w-4" />
                            Help & Support
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="data" className="flex-1 m-0 min-h-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950">
                    <DataAgentChat />
                </TabsContent>

                <TabsContent value="help" className="flex-1 m-0 min-h-0 bg-gradient-to-br from-slate-50 to-green-50 dark:from-gray-900 dark:to-emerald-950">
                    <BasiraHelpChat />
                </TabsContent>
            </Tabs>
        </div>
    );
}
