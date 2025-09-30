import { useLocation, Link, Outlet } from 'react-router-dom';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  Container,
  H1,
} from '@/components';
import { Home, Calendar } from 'lucide-react';

const navigationItems = [
  {
    title: 'Events',
    href: '/events',
    icon: Calendar,
  },
  {
    title: 'Dashboard',
    href: '/organizerdashboard',
    icon: Home,
  },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup className="pt-4">
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map(item => {
                    const isActive = location.pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            to={item.href}
                            className="flex items-center gap-3"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="truncate capitalize">
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="ml-1" />
              <H1 className="text-2xl font-bold">
                Organizer Dashboard (Landing)
              </H1>
              <div className="ml-auto flex items-center gap-2">
                {/* Additional header content can be added here */}
              </div>
            </header>
            <main className="flex-1 overflow-auto">
              <Container className="mx-auto py-4">
                <Outlet />
              </Container>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
