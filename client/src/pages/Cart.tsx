import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Signature Beef Burger",
      price: 1250,
      quantity: 2,
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Chocolate Lava Cake",
      price: 650,
      quantity: 1,
      image: "/api/placeholder/100/100"
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Your Cart</h1>
          <p className="text-xl text-primary-foreground/90">
            Review your order and proceed to checkout
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold mb-6">Cart Items</h2>
                
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                      <Link to="/checkout" className="block">
                        <Button className="w-full btn-hero">
                          Proceed to Checkout
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      
                      <Link to="/menu" className="block">
                        <Button variant="outline" className="w-full">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="bg-accent p-4 rounded-lg mt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <span className="font-semibold">Free Delivery</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        On orders over KSh 1,500. Your order qualifies!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/menu">
                <Button className="btn-hero">
                  Browse Menu
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;