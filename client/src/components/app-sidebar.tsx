import { Home, Upload, History, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "@/hooks/use-translation";
import { useSidebar } from "@/components/ui/sidebar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { setOpenMobile, isMobile } = useSidebar();

  const menuItems = [
    {
      title: t("nav.upload"),
      url: "/",
      icon: Upload,
    },
    {
      title: t("nav.dashboard"),
      url: "/dashboard",
      icon: Home,
    },
    {
      title: t("nav.history"),
      url: "/history",
      icon: History,
    },
  ];

  return (
    <Sidebar className="bg-gradient-to-b from-[hsl(var(--sidebar))] to-[hsl(210_96%_28%)] border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border/50 bg-gradient-to-br from-[hsl(210_96%_32%)] to-[hsl(210_96%_30%)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
            <img 
              src="/logo.png" 
              alt="Kortex Logo" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                // Fallback to icon if logo doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'flex items-center justify-center w-full h-full';
                fallback.innerHTML = '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
                target.parentElement?.appendChild(fallback);
              }}
            />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-white drop-shadow-sm">
              {t("app.title")}
            </h1>
            <p className="text-xs text-white/80 font-medium">{t("app.subtitle")}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs md:text-sm">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      data-testid={`nav-${item.title.toLowerCase()}`}
                      onClick={() => {
                        // Automatically close sidebar on mobile when navigating
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
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
  );
}
