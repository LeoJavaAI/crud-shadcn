import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>

            <section className="py-4">
                <div className="container px-0 md:px-8">
          {children}
                </div>
                </section>
        </SidebarInset>
      </SidebarProvider>
  )
}