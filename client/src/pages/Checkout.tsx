import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Building, MapPin, Clock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [deliveryType, setDeliveryType] = useState("delivery");

  const orderItems = [
    { id: 1, name: "Signature Beef Burger", price: 1250, quantity: 2 },
    { id: 2, name: "Chocolate Lava Cake", price: 650, quantity: 1 }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === "delivery" ? 200 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation SMS shortly.",
    });
  };

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Checkout</h1>
          <p className="text-xl text-primary-foreground/90">
            Complete your order details
          </p>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="space-y-6">
              {/* Delivery Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Delivery Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Home Delivery</p>
                            <p className="text-sm text-muted-foreground">30-45 minutes</p>
                          </div>
                          <Badge variant="secondary">+ KSh 200</Badge>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Pickup</p>
                            <p className="text-sm text-muted-foreground">15-20 minutes</p>
                          </div>
                          <Badge variant="secondary">Free</Badge>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+254 7XX XXX XXX" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {deliveryType === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" placeholder="123 Main Street" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Nairobi" />
                      </div>
                      <div>
                        <Label htmlFor="area">Area/Estate</Label>
                        <Input id="area" placeholder="Westlands" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                      <Textarea 
                        id="instructions" 
                        placeholder="Building name, floor, apartment number, landmarks, etc."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label htmlFor="mpesa" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Smartphone className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold">M-Pesa</p>
                          <p className="text-sm text-muted-foreground">Pay with M-Pesa</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Building className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">Bank Transfer</p>
                          <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-semibold">Credit/Debit Card</p>
                          <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    
                    {deliveryType === "delivery" && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{formatPrice(deliveryFee)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                  
                  {/* Estimated Time */}
                  <div className="bg-accent p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Estimated Time</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {deliveryType === "delivery" ? "30-45 minutes" : "15-20 minutes"}
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full btn-hero"
                    onClick={handlePlaceOrder}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Place Order - {formatPrice(total)}
                  </Button>
                  
                  <Link to="/cart" className="block">
                    <Button variant="outline" className="w-full">
                      Back to Cart
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;