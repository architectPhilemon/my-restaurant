import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Star, Clock, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { menuAPI } from "@/services/api";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: string;
  isSpicy?: boolean;
  isPopular?: boolean;
}

const Menu = () => {
  const { toast } = useToast();
  const { addToCart, cartItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [localCart, setLocalCart] = useState<{[key: string]: number}>({});
  
  const itemsPerPage = 24;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const response = await menuAPI.getMenu();
      setMenuItems(response.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
      // Fallback to demo data
      setMenuItems([
        {
          id: "1",
          name: "Signature Beef Burger",
          description: "Juicy beef patty with fresh lettuce, tomato, cheese, and our special sauce",
          price: 1250,
          image: "/api/placeholder/300/200",
          category: "Mains",
          rating: 4.8,
          prepTime: "15-20 min",
          isPopular: true
        },
        {
          id: "2",
          name: "Grilled Chicken Caesar",
          description: "Fresh romaine lettuce, grilled chicken, parmesan cheese, and caesar dressing",
          price: 950,
          image: "/api/placeholder/300/200",
          category: "Salads",
          rating: 4.7,
          prepTime: "10-15 min"
        },
        {
          id: "3",
          name: "Spicy Pasta Arrabbiata",
          description: "Penne pasta in spicy tomato sauce with herbs and parmesan",
          price: 1100,
          image: "/api/placeholder/300/200",
          category: "Pasta",
          rating: 4.6,
          prepTime: "12-18 min",
          isSpicy: true
        },
        {
          id: "4",
          name: "Chocolate Lava Cake",
          description: "Warm chocolate cake with molten center, served with vanilla ice cream",
          price: 650,
          image: "/api/placeholder/300/200",
          category: "Desserts",
          rating: 4.9,
          prepTime: "8-12 min",
          isPopular: true
        },
        {
          id: "5",
          name: "Fresh Fruit Smoothie",
          description: "Blend of seasonal fruits with yogurt and honey",
          price: 450,
          image: "/api/placeholder/300/200",
          category: "Beverages",
          rating: 4.5,
          prepTime: "3-5 min"
        },
        {
          id: "6",
          name: "Grilled Salmon",
          description: "Atlantic salmon with herbs, served with roasted vegetables",
          price: 1800,
          image: "/api/placeholder/300/200",
          category: "Mains",
          rating: 4.8,
          prepTime: "20-25 min"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const categories = ["All", "Mains", "Salads", "Pasta", "Desserts", "Beverages"];

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    
    setLocalCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    
    toast({
      title: "Added to cart!",
      description: "Item has been added to your cart.",
    });
  };

  const removeFromLocalCart = (itemId: string) => {
    setLocalCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Discover our carefully crafted dishes made with the finest ingredients
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Menu Items Grid - 4 columns, 24 items per page */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 24 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedItems.map((item) => (
              <Card key={item.id} className="menu-card overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.isPopular && (
                        <Badge className="bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                      )}
                      {item.isSpicy && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          Spicy
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{item.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.prepTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  {localCart[item.id] > 0 ? (
                    <div className="flex items-center justify-between w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromLocalCart(item.id)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold">{localCart[item.id]}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </CardFooter>
              </Card>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default Menu;