import { 
  MenuSquare, 
  ShoppingCart, 
  Calendar, 
  Gift,
  Clock,
  Truck
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeaturesSection = () => {
  const features = [
    {
      icon: MenuSquare,
      title: "Explore Our Menu",
      description: "Discover delicious dishes and drinks.",
      action: "Browse Menu",
      href: "/menu",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: ShoppingCart,
      title: "Place an Order",
      description: "Order your favorites online for pickup or delivery.",
      action: "Order Now",
      href: "/cart",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: Calendar,
      title: "Book a Table",
      description: "Reserve your spot for a delightful dining experience.",
      action: "Make Reservation",
      href: "/reservations",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Gift,
      title: "My Loyalty Points",
      description: "Check your points and unlock exclusive rewards.",
      action: "View Rewards",
      href: "/loyalty",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Track Your Order",
      description: "Real-time updates on your order status and delivery.",
      action: "Track Order",
      href: "/orders",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep.",
      action: "Order for Delivery",
      href: "/menu",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose 
            <span className="text-transparent bg-gradient-to-r from-primary to-primary-hover bg-clip-text"> Us?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the perfect blend of exceptional cuisine, outstanding service, and modern convenience all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card group cursor-pointer fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon with Gradient Background */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Action Button */}
              <Link to={feature.href}>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                >
                  {feature.action}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-16 fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="bg-gradient-to-r from-primary to-primary-hover p-8 rounded-3xl text-primary-foreground shadow-[var(--shadow-elegant)]">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-primary-foreground/90 mb-6 text-lg">
              Join thousands of satisfied customers and discover what makes us special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button variant="secondary" className="px-8 py-3 text-lg font-semibold">
                  View Full Menu
                </Button>
              </Link>
              <Link to="/reservations">
                <Button 
                  variant="outline" 
                  className="px-8 py-3 text-lg font-semibold border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Book Your Table
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;