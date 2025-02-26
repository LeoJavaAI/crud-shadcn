import { Suspense } from "react"
import type { Metadata } from "next"


// import { CreateUser } from "@/app/assistants/ui/buttons"

import {fetchUsersPages} from "@/app/assistants/lib/actions";
import {AssistantsTableSkeleton} from "@/app/assistants/components/skeleton";
import Table from "@/app/assistants/components/table";
import Pagination from "@/app/assistants/components/pagination";
import Search from "@/app/assistants/components/search";
import {CreateAssistant} from "@/app/assistants/components/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Assistant",
    description: "Manage Assistants and their information",
}

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        message?: string;

    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchUsersPages(query);
    const message = searchParams?.message;

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold">Assistants</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search Assistants..." />
                <CreateAssistant />
            </div>
            <Suspense key={query + currentPage} fallback={<AssistantsTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
            {message && (
                <Alert className="mt-4 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">{message}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}

