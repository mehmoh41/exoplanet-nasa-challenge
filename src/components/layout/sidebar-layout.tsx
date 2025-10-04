'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rocket, Telescope, Bot, Compass, Info, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';

const menuItems = [
  { href: '/', label: 'Explore', icon: Compass },
  { href: '/analyze', label: 'Analyze with AI', icon: Bot },
  { href: '/compare', label: 'Compare Planets', icon: Telescope },
  { href: '/about', label: 'About', icon: Info },
];

export function SidebarLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="/">
                    <Rocket className="size-6 text-accent" />
                </Link>
            </Button>
            <h1 className="font-headline text-lg font-semibold">ExoAI Explorer</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    className: 'bg-sidebar-accent text-sidebar-accent-foreground',
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/firebase/studio-templates/tree/main/exo-ai-explorer" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                    <Github />
                    <span className="sr-only">GitHub Repository</span>
                </a>
            </Button>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
