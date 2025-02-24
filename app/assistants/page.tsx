import { Suspense } from "react"
import type { Metadata } from "next"


// import { CreateUser } from "@/app/assistants/ui/buttons"

import {fetchUsersPages} from "@/app/assistants/lib/actions";
import {UsersTableSkeleton} from "@/app/assistants/components/skeleton";
import Table from "@/app/assistants/components/table";
import Pagination from "@/app/assistants/components/pagination";
import Search from "@/app/assistants/components/search";
import {CreateUser} from "@/app/assistants/components/button";

export const metadata: Metadata = {
    title: "Users",
    description: "Manage users and their information",
}

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams?: {
        query?: string
        page?: string
    }
}) {
    const query = searchParams?.query || ""
    const currentPage = Number(searchParams?.page) || 1
    const totalPages = await fetchUsersPages(query)

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold">Users</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search users..." />
                <CreateUser />
            </div>
            <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}

