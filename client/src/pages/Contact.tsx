import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, MessageSquare, Calendar, Utensils } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiry: "",
    message: "",
    preferredContact: "",
  });

  const inquiryTypes = [
    "General Information",
    "Reservations",
    "Private Events",
    "Catering Services",
    "Wedding & Celebrations",
    "Business Meetings",
    "Feedback & Complaints",
    "Media & Press",
    "Career Opportunities",
    "Partnership Inquiries"
  ];

  const contactMethods = [
    "Email",
    "Phone",
    "Text Message",
    "No Preference"
  ];

  const locationInfo = {
    address: "123 Gourmet Street, Downtown District",
    city: "New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "info@tastehaven.com",
    reservationsEmail: "reservations@tastehaven.com",
    eventsEmail: "events@tastehaven.com"
  };

  const hours = [
    { day: "Monday - Thursday", time: "5:00 PM - 10:00 PM" },
    { day: "Friday - Saturday", time: "5:00 PM - 11:00 PM" },
    { day: "Sunday", time: "4:00 PM - 9:00 PM" },
    { day: "Brunch (Sat-Sun)", time: "10:00 AM - 3:00 PM" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Handle form submission logic here
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-900 to-red-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl max-w-2xl mx-auto">
              We'd love to hear from you. Reach out for reservations, events, or just to say hello.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferred-contact">Preferred Contact Method</Label>
                        <Select onValueChange={(value) => handleInputChange("preferredContact", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="How should we reach you?" />
                          </SelectTrigger>
                          <SelectContent>
                            {contactMethods.map((method) => (
                              <SelectItem key={method} value={method.toLowerCase()}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inquiry">Inquiry Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("inquiry", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="What can we help you with?" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide details about your inquiry, including any specific dates, times, or requirements..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-800">
                        <strong>For immediate assistance:</strong> Call us at {locationInfo.phone} during business hours, 
                        or email reservations@tastehaven.com for dining reservations.
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Location & Hours */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                    <p className="text-gray-600">{locationInfo.address}</p>
                    <p className="text-gray-600">{locationInfo.city}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Hours of Operation
                    </h4>
                    <div className="space-y-1 text-sm">
                      {hours.map((schedule, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">{schedule.day}</span>
                          <span className="font-medium">{schedule.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-orange-600" />
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-gray-600">{locationInfo.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">General Inquiries</p>
                        <p className="text-sm text-gray-600">{locationInfo.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Reservations</p>
                        <p className="text-sm text-gray-600">{locationInfo.reservationsEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Utensils className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">Private Events</p>
                        <p className="text-sm text-gray-600">{locationInfo.eventsEmail}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Make a Reservation
                  </Button>
                  <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                    <Utensils className="w-4 h-4 mr-2" />
                    View Menu
                  </Button>
                  <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Private Events
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="shadow-lg bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 mb-2">
                    For urgent matters outside business hours:
                  </p>
                  <p className="font-medium text-red-800">+1 (555) 123-4567 (ext. 911)</p>
                  <p className="text-xs text-red-600 mt-2">
                    This line is monitored 24/7 for emergencies only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Do you take reservations?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes, we highly recommend reservations, especially for dinner service and weekends. 
                    You can book online, call us, or visit in person.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Do you accommodate dietary restrictions?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Absolutely! We offer vegetarian, vegan, gluten-free, and other dietary options. 
                    Please inform us of any allergies or restrictions when making your reservation.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Do you host private events?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Yes, we offer private dining rooms and event packages for special occasions, 
                    business meetings, and celebrations. Contact our events team for details.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Is there parking available?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We offer complimentary valet parking for all guests. Street parking and nearby 
                    parking garages are also available.
                  </p>
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

export default Contact;