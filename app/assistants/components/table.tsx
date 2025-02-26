import {fetchFilteredAssistants, fetchFilteredUsers} from "@/app/assistants/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react"
import { DeleteUser } from "./button";
import { Assistant } from "@/lib/db/schema";
import { useAssistantStore } from "../store";
import { TableClient } from "./table-client";


export default async function Table({
                                             query,
                                             currentPage,
                                         }: {
    query: string
    currentPage: number
}) {
    const assistants = await fetchFilteredAssistants(query, currentPage)




    return (
        <TableClient assistants={assistants} />
    )
}

