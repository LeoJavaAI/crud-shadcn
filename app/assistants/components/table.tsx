import {fetchFilteredAssistants,} from "@/app/assistants/lib/actions";

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

