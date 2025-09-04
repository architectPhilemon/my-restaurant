import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Gift, Crown, Trophy, Calendar, Coffee, UtensilsCrossed, Percent } from "lucide-react";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";

const Loyalty = () => {
  const userStats = {
    currentTier: "Gold",
    points: 2450,
    nextTierPoints: 3000,
    totalSpent: 1250.50,
    visitsThisMonth: 8,
    favoriteItem: "Grilled Salmon"
  };

  const tiers = [
    {
      name: "Bronze",
      minPoints: 0,
      color: "from-amber-600 to-amber-700",
      benefits: ["5% discount on all orders", "Birthday special", "Early access to new menu items"]
    },
    {
      name: "Silver",
      minPoints: 1000,
      color: "from-gray-400 to-gray-600",
      benefits: ["10% discount on all orders", "Free appetizer monthly", "Priority reservations", "Complimentary valet parking"]
    },
    {
      name: "Gold",
      minPoints: 2500,
      color: "from-yellow-400 to-yellow-600",
      benefits: ["15% discount on all orders", "Free main course monthly", "VIP events access", "Personal sommelier consultation"]
    },
    {
      name: "Platinum",
      minPoints: 5000,
      color: "from-purple-400 to-purple-600",
      benefits: ["20% discount on all orders", "Free tasting menu quarterly", "Private dining room access", "Chef's table experience"]
    }
  ];

  const recentActivity = [
    { date: "2024-01-10", action: "Earned points", points: 125, description: "Dinner for 2 - $125.00" },
    { date: "2024-01-08", action: "Redeemed reward", points: -500, description: "Free appetizer - Truffle Bruschetta" },
    { date: "2024-01-05", action: "Earned points", points: 89, description: "Lunch - $89.00" },
    { date: "2024-01-03", action: "Bonus points", points: 100, description: "Birthday bonus" },
  ];

  const availableRewards = [
    { id: 1, name: "Free Appetizer", points: 500, category: "food", description: "Any appetizer from our menu" },
    { id: 2, name: "Complimentary Dessert", points: 400, category: "food", description: "Chef's selection dessert" },
    { id: 3, name: "Free Main Course", points: 1000, category: "food", description: "Any main course up to $35" },
    { id: 4, name: "Wine Tasting Session", points: 800, category: "experience", description: "Private wine tasting for 2" },
    { id: 5, name: "Cooking Class", points: 1500, category: "experience", description: "2-hour cooking class with our chef" },
    { id: 6, name: "Private Dining", points: 2000, category: "experience", description: "Private dining room for 8 people" },
  ];

  const progressPercentage = (userStats.points / userStats.nextTierPoints) * 100;

  const getCurrentTierInfo = () => {
    return tiers.find(tier => tier.name === userStats.currentTier) || tiers[0];
  };

  const getNextTierInfo = () => {
    const currentIndex = tiers.findIndex(tier => tier.name === userStats.currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const canRedeem = (points: number) => userStats.points >= points;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Loyalty Program</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Earn points, unlock rewards, and enjoy exclusive benefits with every visit
            </p>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  Your {userStats.currentTier} Status
                </CardTitle>
                <CardDescription>
                  {userStats.nextTierPoints - userStats.points} points until {getNextTierInfo()?.name || "max tier"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-orange-600">
                    {userStats.points.toLocaleString()} points
                  </div>
                  <Badge className={`bg-gradient-to-r ${getCurrentTierInfo().color} text-white`}>
                    {userStats.currentTier} Member
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {getNextTierInfo()?.name || "max tier"}</span>
                    <span>{userStats.points} / {userStats.nextTierPoints}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">${userStats.totalSpent}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userStats.visitsThisMonth}</div>
                    <div className="text-sm text-gray-600">Visits This Month</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">15%</div>
                    <div className="text-sm text-gray-600">Current Discount</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      <UtensilsCrossed className="w-6 h-6 mx-auto" />
                    </div>
                    <div className="text-sm text-gray-600">{userStats.favoriteItem}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR Code
                </Button>
                <Button className="w-full" variant="outline">
                  <Gift className="w-4 h-4 mr-2" />
                  Refer a Friend
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book VIP Experience
                </Button>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  <Star className="w-4 h-4 mr-2" />
                  View All Benefits
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="rewards" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              <TabsTrigger value="tiers">Membership Tiers</TabsTrigger>
              <TabsTrigger value="activity">Point History</TabsTrigger>
              <TabsTrigger value="benefits">Current Benefits</TabsTrigger>
            </TabsList>

            <TabsContent value="rewards" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRewards.map((reward) => (
                  <Card key={reward.id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                        <Badge variant={reward.category === "food" ? "default" : "secondary"}>
                          {reward.category}
                        </Badge>
                      </div>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {reward.points} pts
                        </div>
                        <Button 
                          size="sm"
                          disabled={!canRedeem(reward.points)}
                          className={canRedeem(reward.points) 
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" 
                            : ""
                          }
                        >
                          {canRedeem(reward.points) ? "Redeem" : "Need More Points"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tiers" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tiers.map((tier, index) => (
                  <Card key={tier.name} className={`shadow-lg ${tier.name === userStats.currentTier ? 'ring-2 ring-orange-500' : ''}`}>
                    <CardHeader>
                      <CardTitle className={`text-center bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                        {tier.name}
                      </CardTitle>
                      <CardDescription className="text-center">
                        {tier.minPoints === 0 ? "Starting tier" : `${tier.minPoints}+ points`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {tier.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      {tier.name === userStats.currentTier && (
                        <Badge className="w-full justify-center mt-4 bg-orange-100 text-orange-800">
                          Current Tier
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Point Activity</CardTitle>
                  <CardDescription>Your latest point transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.points > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {activity.points > 0 ? '+' : '-'}
                          </div>
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${activity.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {activity.points > 0 ? '+' : ''}{activity.points} pts
                          </div>
                          <div className="text-sm text-gray-500">{activity.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benefits" className="mt-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Your {userStats.currentTier} Member Benefits</CardTitle>
                  <CardDescription>Enjoy these exclusive perks with your current membership tier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getCurrentTierInfo().benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  {getNextTierInfo() && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Upgrade to {getNextTierInfo()!.name} to unlock:</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {getNextTierInfo()!.benefits.slice(-2).map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Percent className="w-4 h-4 text-gray-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    </Layout>
  );
};

// Add missing QrCode import
const QrCode = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
);

export default Loyalty;