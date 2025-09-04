import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Phone, Mail } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

const Reservations = () => {
  const [reservation, setReservation] = useState({
    date: "",
    time: "",
    guests: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    occasion: "",
  });

  const [existingReservations] = useState([
    {
      id: 1,
      date: "2024-01-15",
      time: "7:00 PM",
      guests: 4,
      status: "confirmed",
      table: "Table 12",
      occasion: "Anniversary"
    },
    {
      id: 2,
      date: "2024-01-08",
      time: "6:30 PM",
      guests: 2,
      status: "completed",
      table: "Table 5",
      occasion: "Date Night"
    },
  ]);

  const timeSlots = [
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", 
    "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"
  ];

  const occasions = [
    "Birthday", "Anniversary", "Date Night", "Business Dinner", 
    "Family Gathering", "Celebration", "Other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reservation request:", reservation);
    // Handle reservation logic here
  };

  const handleInputChange = (field: string, value: string) => {
    setReservation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Table Reservations</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reserve your table for an unforgettable dining experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* New Reservation Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Make a Reservation
                </CardTitle>
                <CardDescription>
                  Book your table and let us prepare for your visit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={reservation.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Select onValueChange={(value) => handleInputChange("time", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select onValueChange={(value) => handleInputChange("guests", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Guest" : "Guests"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="occasion">Occasion</Label>
                      <Select onValueChange={(value) => handleInputChange("occasion", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Special occasion?" />
                        </SelectTrigger>
                        <SelectContent>
                          {occasions.map((occasion) => (
                            <SelectItem key={occasion} value={occasion}>
                              {occasion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={reservation.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={reservation.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={reservation.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="special-requests">Special Requests</Label>
                    <Textarea
                      id="special-requests"
                      placeholder="Any dietary restrictions, allergies, or special requirements..."
                      value={reservation.specialRequests}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    Reserve Table
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Reservations & Info */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-orange-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">123 Gourmet Street</p>
                      <p className="text-sm text-gray-600">Downtown, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <p className="font-medium">reservations@tastehaven.com</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Opening Hours</p>
                      <p className="text-sm text-gray-600">Mon-Sun: 5:00 PM - 11:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Reservations */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Your Reservations
                  </CardTitle>
                  <CardDescription>
                    View and manage your upcoming reservations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {existingReservations.map((res) => (
                    <div key={res.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-lg">{res.date}</p>
                          <p className="text-sm text-gray-600">{res.time} • {res.guests} guests • {res.table}</p>
                          {res.occasion && (
                            <p className="text-sm text-orange-600 font-medium">{res.occasion}</p>
                          )}
                        </div>
                        <Badge className={getStatusColor(res.status)}>
                          {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                        </Badge>
                      </div>
                      {res.status === "confirmed" && (
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            Modify
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </Layout>
  );
};

export default Reservations;
