import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  UtensilsCrossed,
  ShoppingCart,
  ClipboardList,
  Calendar,
  Star,
  Info,
  Phone,
  UserCircle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Menu", url: "/menu", icon: UtensilsCrossed },
  { title: "Cart", url: "/cart", icon: ShoppingCart, badge: 3 },
  { title: "My Orders", url: "/orders", icon: ClipboardList },
  { title: "Reservations", url: "/reservations", icon: Calendar },
  { title: "Loyalty", url: "/loyalty", icon: Star },
  { title: "About", url: "/about", icon: Info },
  { title: "Contact", url: "/contact", icon: Phone },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const collapsed = state === "collapsed";
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700" 
      : "hover:bg-orange-50 hover:text-orange-700 text-muted-foreground";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} border-r border-orange-100 bg-white`}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup className="border-none">
          <SidebarGroupLabel className="text-orange-700 font-bold text-lg mb-4">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="transition-all duration-200">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive })}`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4 border-t border-orange-100">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <UserCircle className="h-8 w-8 text-orange-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-orange-900">Welcome!</p>
                <p className="text-xs text-orange-600">Premium Member</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}