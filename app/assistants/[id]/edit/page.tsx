
import { notFound } from "next/navigation"
import { fetchUserById } from "../../lib/actions"
import { EditForm } from "../../components/edit-form"

export default async function EditUserPage({
                                               params,
                                           }: {
    params: { id: string }
}) {
    const id = Number.parseInt(params.id)
    const user = await fetchUserById(id)

    if (!user) {
        notFound()
    }

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold">Edit User</h1>
            </div>
            <div className="mt-4">
                <EditForm initialData={user} />
            </div>
        </div>
    )
}

