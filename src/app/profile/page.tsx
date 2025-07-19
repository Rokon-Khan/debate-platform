"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Calendar,
  Edit,
  MessageSquare,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be signed in to view your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Go Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userStats = {
    totalVotes: 456,
    debatesParticipated: 12,
    argumentsPosted: 34,
    winRate: 67,
    rank: 15,
    joinDate: "March 2024",
  };

  const recentDebates = [
    {
      id: "1",
      title: "Should AI replace human teachers in schools?",
      side: "oppose",
      status: "active",
      votes: 23,
    },
    {
      id: "2",
      title: "Remote work is more productive than office work",
      side: "support",
      status: "won",
      votes: 31,
    },
    {
      id: "3",
      title: "Social media does more harm than good",
      side: "support",
      status: "lost",
      votes: 18,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={session.user?.image || ""}
                  alt={session.user?.name || ""}
                />
                <AvatarFallback className="text-2xl">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{session.user?.name}</h1>
                  <Badge variant="outline" className="w-fit">
                    Rank #{userStats.rank}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  {session.user?.email}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {userStats.totalVotes}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Votes
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {userStats.debatesParticipated}
                    </div>
                    <div className="text-sm text-muted-foreground">Debates</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats.argumentsPosted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Arguments
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {userStats.winRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Win Rate
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="debates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="debates">Recent Debates</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="debates">
            <Card>
              <CardHeader>
                <CardTitle>Recent Debates</CardTitle>
                <CardDescription>
                  Your latest debate participation and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDebates.map((debate, index) => (
                    <motion.div
                      key={debate.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{debate.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge
                            variant={
                              debate.side === "support"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {debate.side === "support" ? "Support" : "Oppose"}
                          </Badge>
                          <span>•</span>
                          <span>{debate.votes} votes received</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          debate.status === "won"
                            ? "default"
                            : debate.status === "lost"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {debate.status === "won"
                          ? "Won"
                          : debate.status === "lost"
                          ? "Lost"
                          : "Active"}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Debate Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">First Debate</div>
                      <div className="text-sm text-muted-foreground">
                        Participated in your first debate
                      </div>
                    </div>
                    <Badge>Earned</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Persuasive Speaker</div>
                      <div className="text-sm text-muted-foreground">
                        Received 100+ votes
                      </div>
                    </div>
                    <Badge>Earned</Badge>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <div className="font-semibold">Debate Master</div>
                      <div className="text-sm text-muted-foreground">
                        Win 10 debates in a row
                      </div>
                    </div>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Participation Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Active Debater</div>
                      <div className="text-sm text-muted-foreground">
                        Participate in 10 debates
                      </div>
                    </div>
                    <Badge>Earned</Badge>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <div className="font-semibold">Debate Veteran</div>
                      <div className="text-sm text-muted-foreground">
                        Participate in 50 debates
                      </div>
                    </div>
                    <Badge variant="outline">24/50</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Performance Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average votes per argument:</span>
                    <span className="font-semibold">13.4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most voted argument:</span>
                    <span className="font-semibold">45 votes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debates won:</span>
                    <span className="font-semibold">8 / 12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favorite category:</span>
                    <span className="font-semibold">Technology</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Member since:</span>
                    <span className="font-semibold">{userStats.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last debate:</span>
                    <span className="font-semibold">2 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most active day:</span>
                    <span className="font-semibold">Tuesday</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current streak:</span>
                    <span className="font-semibold">5 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
