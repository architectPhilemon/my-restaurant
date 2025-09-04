import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Menu, 
  ShoppingCart, 
  Calendar, 
  Gift, 
  Package, 
  LogOut,
  User,
  MenuIcon,
  X
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(2); // Mock cart count
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Menu", href: "/menu", icon: Menu },
    { label: "Cart", href: "/cart", icon: ShoppingCart, badge: cartCount },
    { label: "Reservations", href: "/reservations", icon: Calendar },
    { label: "Loyalty", href: "/loyalty", icon: Gift },
    { label: "My Orders", href: "/orders", icon: Package },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-card shadow-[var(--shadow-card)] border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-hover rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-foreground">My Restaurant</span>
            </Link>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`flex items-center space-x-2 px-4 py-2 ${
                      isActive(item.href) 
                        ? "bg-primary text-primary-foreground shadow-[var(--shadow-button)]" 
                        : "hover:bg-secondary hover:text-secondary-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-b border-border shadow-[var(--shadow-card)] absolute top-16 left-0 right-0 z-40">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`w-full justify-start space-x-3 ${
                    isActive(item.href) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="w-4 h-4 mr-3" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;