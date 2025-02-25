import {fetchFilteredUsers} from "@/app/assistants/lib/actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react"
import { DeleteUser } from "./button";


export default async function Table({
                                             query,
                                             currentPage,
                                         }: {
    query: string
    currentPage: number
}) {
    const users = await fetchFilteredUsers(query, currentPage)

    return (
        <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-lg bg-gray-50 p-2 md:pt-0">
                        <table className="min-w-full text-gray-900">
                            <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Name
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Email
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Age
                                </th>

                            </tr>
                            </thead>
                            <tbody className="bg-white">
                            {users?.map((user) => (
                                <tr
                                    key={user.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap px-4 py-4">{user.name}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{user.email}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{user.age}</td>
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/assistants/${user.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Link>
                                            </Button>
                                            <DeleteUser id={user.id} name={user.name} />

                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

