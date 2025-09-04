import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

const AdminDashboard = () => {
  const [orders] = useState([
    { id: "ORD-001", customer: "John Doe", items: 3, total: 3350, status: "preparing", time: "25 min" },
    { id: "ORD-002", customer: "Jane Smith", items: 2, total: 2700, status: "ready", time: "Ready" },
    { id: "ORD-003", customer: "Mike Johnson", items: 1, total: 1300, status: "delivered", time: "Completed" },
  ]);

  const [menuItems] = useState([
    { id: 1, name: "Signature Beef Burger", price: 1250, category: "Mains", stock: 25 },
    { id: 2, name: "Grilled Chicken Caesar", price: 950, category: "Salads", stock: 18 },
    { id: 3, name: "Spicy Pasta Arrabbiata", price: 1100, category: "Pasta", stock: 12 },
    { id: 4, name: "Chocolate Lava Cake", price: 650, category: "Desserts", stock: 8 },
  ]);

  const stats = [
    { title: "Today's Revenue", value: "KSh 45,240", icon: DollarSign, color: "text-green-600" },
    { title: "Active Orders", value: "12", icon: Package, color: "text-blue-600" },
    { title: "Total Customers", value: "1,284", icon: Users, color: "text-purple-600" },
    { title: "Growth Rate", value: "+23%", icon: TrendingUp, color: "text-orange-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing": return "bg-yellow-500";
      case "ready": return "bg-green-500";
      case "delivered": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Admin Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-slate-400">Restaurant Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700">
                Settings
              </Button>
              <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-600">
              Orders Management
            </TabsTrigger>
            <TabsTrigger value="menu" className="data-[state=active]:bg-orange-600">
              Menu Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-600">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Orders Management */}
          <TabsContent value="orders">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Active Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-slate-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-semibold text-white">Order #{order.id}</p>
                            <p className="text-slate-400 text-sm">{order.customer}</p>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-white font-semibold">{formatPrice(order.total)}</p>
                            <p className="text-slate-400 text-sm">{order.items} items</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-white font-semibold">{order.time}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-400 text-sm">ETA</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {order.status === "preparing" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Management */}
          <TabsContent value="menu">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Items List */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Menu Items</CardTitle>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {menuItems.map((item) => (
                        <div key={item.id} className="bg-slate-700 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-white">{item.name}</p>
                              <p className="text-slate-400 text-sm">{item.category}</p>
                              <p className="text-orange-400 font-semibold">{formatPrice(item.price)}</p>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-white">Stock: {item.stock}</p>
                                <Badge variant={item.stock > 10 ? "default" : "destructive"}>
                                  {item.stock > 10 ? "In Stock" : "Low Stock"}
                                </Badge>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-400 border-red-600 hover:bg-red-900/20">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Add/Edit Form */}
              <div>
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Add New Item</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="itemName" className="text-slate-300">Item Name</Label>
                      <Input 
                        id="itemName" 
                        placeholder="Enter item name"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="itemPrice" className="text-slate-300">Price (KSh)</Label>
                      <Input 
                        id="itemPrice" 
                        type="number"
                        placeholder="0"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="itemCategory" className="text-slate-300">Category</Label>
                      <Input 
                        id="itemCategory" 
                        placeholder="e.g., Mains, Desserts"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="itemStock" className="text-slate-300">Initial Stock</Label>
                      <Input 
                        id="itemStock" 
                        type="number"
                        placeholder="0"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Add Item
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Today's Sales</span>
                      <span className="text-white font-semibold">KSh 45,240</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">This Week</span>
                      <span className="text-white font-semibold">KSh 312,680</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">This Month</span>
                      <span className="text-white font-semibold">KSh 1,284,920</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Popular Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Signature Beef Burger</span>
                      <Badge className="bg-orange-600">145 sold</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Chocolate Lava Cake</span>
                      <Badge className="bg-orange-600">98 sold</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Grilled Salmon</span>
                      <Badge className="bg-orange-600">87 sold</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;