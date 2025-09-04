import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-restaurant.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Elegant restaurant interior with warm ambiance" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Rating and Reviews */}
          <div className="flex items-center justify-center space-x-2 fade-in-up">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-white/90 text-lg">4.9 • 2,500+ Reviews</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Your culinary journey
              <span className="block text-transparent bg-gradient-to-r from-primary to-yellow-400 bg-clip-text">
                starts here
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Experience culinary excellence with our carefully crafted dishes, exceptional service, and unforgettable dining atmosphere.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link to="/menu">
              <Button className="btn-hero group">
                Explore Our Menu
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/reservations">
              <Button 
                variant="outline" 
                className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300"
              >
                Book a Table
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold">25+</span>
              </div>
              <p className="text-white/80">Years of Excellence</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold">50K+</span>
              </div>
              <p className="text-white/80">Happy Customers</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Star className="w-6 h-6 text-primary fill-primary" />
                <span className="text-3xl font-bold">150+</span>
              </div>
              <p className="text-white/80">Signature Dishes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl float-animation"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl float-animation" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg float-animation" style={{ animationDelay: "4s" }}></div>
    </section>
  );
};

export default HeroSection;