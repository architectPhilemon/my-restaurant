import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold">My Restaurant</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Experience culinary excellence with our carefully crafted dishes and exceptional service. Your culinary journey starts here.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
              <Twitter className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
              <Instagram className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
              <Youtube className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "Menu", href: "/menu" },
                { label: "Reservations", href: "/reservations" },
                { label: "Order Online", href: "/cart" },
                { label: "Loyalty Program", href: "/loyalty" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span className="text-primary-foreground/80">+254 712 345 678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span className="text-primary-foreground/80">info@myrestaurant.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1" />
                <span className="text-primary-foreground/80">
                  123 Restaurant Street<br />
                  Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Operating Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4" />
                <span className="text-primary-foreground/80">Daily Service</span>
              </div>
              <div className="text-primary-foreground/80 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Monday - Thursday</span>
                  <span>11:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday - Saturday</span>
                  <span>11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>12:00 PM - 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/80 text-sm">
              © 2024 My Restaurant. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/admin" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;