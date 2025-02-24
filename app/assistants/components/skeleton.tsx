import { Skeleton } from "@/components/ui/skeleton"

export function UsersTableSkeleton() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="mb-2 w-full space-y-4 p-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-2/3" />
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                        <tr>
                            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                Name
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Email
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Age
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Created
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white">
                        {[...Array(6)].map((_, i) => (
                            <tr key={i} className="w-full border-b py-3 text-sm last-of-type:border-none">
                                <td className="whitespace-nowrap px-4 py-4">
                                    <Skeleton className="h-6 w-32" />
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <Skeleton className="h-6 w-32" />
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <Skeleton className="h-6 w-16" />
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                    <Skeleton className="h-6 w-24" />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

