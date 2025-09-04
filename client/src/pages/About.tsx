import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Award, Users, Heart, Clock, MapPin, Phone, Mail } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

const About = () => {
  const stats = [
    { label: "Years of Excellence", value: "15+", icon: Award },
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Five Star Reviews", value: "4.9", icon: Star },
    { label: "Signature Dishes", value: "120+", icon: Heart },
  ];

  const chefs = [
    {
      name: "Chef Alessandro Romano",
      title: "Executive Chef & Owner",
      experience: "20+ years",
      specialty: "Modern Italian Cuisine",
      image: "/placeholder.svg",
      description: "Trained in the finest restaurants of Milan and Florence, Chef Romano brings authentic Italian flavors with a contemporary twist."
    },
    {
      name: "Chef Maria Santos",
      title: "Pastry Chef",
      experience: "15+ years",
      specialty: "Artisan Desserts",
      image: "/placeholder.svg", 
      description: "Award-winning pastry chef specializing in traditional European desserts and modern confectionery artistry."
    },
    {
      name: "Chef James Wilson",
      title: "Sous Chef",
      experience: "12+ years",
      specialty: "Farm-to-Table",
      image: "/placeholder.svg",
      description: "Passionate about sustainable cooking and locally sourced ingredients, creating seasonal masterpieces."
    }
  ];

  const achievements = [
    {
      year: "2023",
      title: "Michelin Star Recognition",
      description: "Awarded prestigious Michelin recognition for exceptional culinary excellence"
    },
    {
      year: "2022",
      title: "Best Restaurant in the City",
      description: "Named 'Restaurant of the Year' by Metropolitan Dining Guide"
    },
    {
      year: "2021",
      title: "Wine Spectator Award",
      description: "Recognized for outstanding wine selection and sommelier expertise"
    },
    {
      year: "2020",
      title: "Sustainability Champion",
      description: "First restaurant in the region to achieve zero-waste certification"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Food Critic",
      rating: 5,
      comment: "TasteHaven delivers an extraordinary culinary experience that transcends expectations. Every dish is a masterpiece, and the service is impeccable. This is destination dining at its finest.",
      date: "January 2024"
    },
    {
      name: "Michael Chen",
      role: "Restaurant Reviewer",
      rating: 5,
      comment: "The attention to detail is remarkable. From the carefully curated wine list to the innovative seasonal menu, TasteHaven sets the gold standard for fine dining experiences.",
      date: "December 2023"
    },
    {
      name: "Emma Rodriguez",
      role: "Travel Blogger",
      rating: 5,
      comment: "I've dined at restaurants around the world, and TasteHaven ranks among the very best. The combination of exquisite food, elegant ambiance, and exceptional hospitality is unmatched.",
      date: "November 2023"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-900 to-red-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6">About TasteHaven</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Where culinary artistry meets warm hospitality. For over 15 years, we've been creating 
              unforgettable dining experiences that celebrate the finest ingredients, innovative techniques, 
              and the joy of sharing exceptional food.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  TasteHaven was born from a simple vision: to create a dining destination where 
                  exceptional food meets genuine hospitality. Founded in 2009 by Chef Alessandro Romano, 
                  our restaurant has grown from a small neighborhood gem to a celebrated culinary landmark.
                </p>
                <p>
                  Our commitment to excellence extends beyond the kitchen. We believe that every meal 
                  should be a celebration, every guest should feel like family, and every dish should 
                  tell a story. This philosophy has guided us through countless memorable evenings and 
                  has earned us the trust and loyalty of our community.
                </p>
                <p>
                  Today, TasteHaven continues to push culinary boundaries while honoring time-tested 
                  traditions. We source the finest local ingredients, support sustainable farming 
                  practices, and maintain relationships with producers who share our passion for quality.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Philosophy</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Passion for Perfection</h3>
                    <p className="text-gray-600">Every dish is crafted with meticulous attention to detail and an unwavering commitment to excellence.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Community Connection</h3>
                    <p className="text-gray-600">We believe in building lasting relationships with our guests, staff, and local community.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sustainable Excellence</h3>
                    <p className="text-gray-600">We're committed to environmental responsibility and supporting local, sustainable food systems.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meet Our Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Culinary Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {chefs.map((chef, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img 
                      src={chef.image} 
                      alt={chef.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{chef.name}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="font-medium text-orange-600">{chef.title}</div>
                      <div className="text-sm text-gray-500">{chef.experience} • {chef.specialty}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">{chef.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {achievement.year}
                      </Badge>
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Critics Say</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-sm text-gray-600 italic leading-relaxed mb-3">
                      "{testimonial.comment}"
                    </blockquote>
                    <div className="text-xs text-gray-500">{testimonial.date}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <Card className="shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Experience TasteHaven?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join us for an unforgettable culinary journey. Make a reservation today 
                and discover why TasteHaven is the premier dining destination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  <Clock className="w-4 h-4 mr-2" />
                  Make a Reservation
                </Button>
                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us: (555) 123-4567
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </Layout>
  );
};

export default About;