import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/outline"

export function CreateUser() {
    return (
        <Button asChild>
            <Link href="/assistants/create">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add User
            </Link>
        </Button>
    )
}

