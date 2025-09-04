import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Clock, CheckCircle, Truck, MapPin, Phone } from "lucide-react";

interface Order {
  id: string;
  date: string;
  status: "preparing" | "ready" | "delivered" | "cancelled";
  items: { name: string; quantity: number; price: number }[];
  total: number;
  deliveryAddress?: string;
  estimatedTime?: string;
}

const Orders = () => {
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2024-01-15 14:30",
      status: "preparing",
      items: [
        { name: "Signature Beef Burger", quantity: 2, price: 1250 },
        { name: "Chocolate Lava Cake", quantity: 1, price: 650 }
      ],
      total: 3350,
      deliveryAddress: "123 Main Street, Westlands, Nairobi",
      estimatedTime: "25 minutes"
    },
    {
      id: "ORD-002",
      date: "2024-01-10 19:15",
      status: "delivered",
      items: [
        { name: "Grilled Salmon", quantity: 1, price: 1800 },
        { name: "Fresh Fruit Smoothie", quantity: 2, price: 450 }
      ],
      total: 2700
    },
    {
      id: "ORD-003",
      date: "2024-01-08 12:00",
      status: "ready",
      items: [
        { name: "Spicy Pasta Arrabbiata", quantity: 1, price: 1100 }
      ],
      total: 1300,
      estimatedTime: "Ready for pickup"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing":
        return <Clock className="w-4 h-4" />;
      case "ready":
        return <CheckCircle className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-500";
      case "ready":
        return "bg-green-500";
      case "delivered":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
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
          <h1 className="text-5xl font-bold mb-4">My Orders</h1>
          <p className="text-xl text-primary-foreground/90">
            Track your orders and view order history
          </p>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-secondary to-accent">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">Order #{order.id}</CardTitle>
                      <p className="text-muted-foreground">{order.date}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} text-white flex items-center space-x-1`}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Order Total */}
                  <div className="flex justify-between items-center text-lg font-bold mb-6">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(order.total)}</span>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Delivery Information */}
                    {order.deliveryAddress && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-semibold">Delivery Address</span>
                        </div>
                        <p className="text-muted-foreground text-sm">{order.deliveryAddress}</p>
                      </div>
                    )}

                    {/* Estimated Time */}
                    {order.estimatedTime && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-semibold">
                            {order.status === "ready" ? "Status" : "Estimated Time"}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">{order.estimatedTime}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    {order.status === "preparing" && (
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Truck className="w-4 h-4" />
                        <span>Track Order</span>
                      </Button>
                    )}
                    
                    {order.status === "ready" && (
                      <Button className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Confirm Pickup</span>
                      </Button>
                    )}

                    {order.status === "delivered" && (
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Package className="w-4 h-4" />
                        <span>Reorder Items</span>
                      </Button>
                    )}

                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Contact Support</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">No orders yet</h2>
                <p className="text-muted-foreground mb-8">
                  You haven't placed any orders yet. Start browsing our menu!
                </p>
                <Button className="btn-hero">
                  Browse Menu
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Orders;