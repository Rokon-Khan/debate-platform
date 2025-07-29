/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListArgumentsQuery } from "@/redux/features/argumentApi";
import { useGetScoreboardQuery } from "@/redux/features/scoreboardApi";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import {
  Calendar,
  Edit,
  MessageSquare,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check for NextAuth session or auth_token cookie
    const token = Cookies.get("auth_token");
    let userIdFromToken: string | undefined;
    if (session) {
      setIsAuthenticated(true);
      userIdFromToken = session.user?.id as string;
    } else if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAuthenticated(true);
        userIdFromToken = payload.id || payload._id;
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setUserId(userIdFromToken);
  }, [session, status]);

  // Get scoreboard data for all users, and filter for current user
  const { data: scoreboardData, isLoading: scoreboardLoading } =
    useGetScoreboardQuery({}); // all-time by default

  // Find current user's profile and stats in leaderboard
  const userProfile =
    scoreboardData?.leaderboard?.find((u: any) => u.id === userId) ?? null;
  const stats = scoreboardData?.stats ?? {};

  // Fetch recent arguments for current user (could be used to show recent debates)
  const { data: userArguments, isLoading: argsLoading } = useListArgumentsQuery(
    userId ?? "",
    {
      skip: !userId,
    }
  );

  // Derive user's debates from arguments (assuming debate info is included)
  const recentDebates =
    userArguments
      ?.map((arg: any) => ({
        id: arg.debate?._id ?? arg.debateId,
        title: arg.debate?.title ?? "",
        side: arg.side,
        status: arg.debate?.status ?? "active",
        votes: arg.votes?.length ?? 0,
      }))
      .slice(0, 5) ?? [];

  if (!isAuthenticated) {
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
                  src={userProfile?.avatar || session?.user?.image || ""}
                  alt={userProfile?.username || session?.user?.name || ""}
                />
                <AvatarFallback className="text-2xl">
                  {userProfile?.username?.charAt(0).toUpperCase() ||
                    session?.user?.name?.charAt(0).toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">
                    {userProfile?.username ||
                      session?.user?.name ||
                      "Your Name"}
                  </h1>
                  <Badge variant="outline" className="w-fit">
                    {scoreboardLoading ? (
                      <Skeleton className="w-16 h-5" />
                    ) : (
                      <>Rank #{userProfile?.rank ?? "-"}</>
                    )}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  {session?.user?.email || ""}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {scoreboardLoading ? (
                        <Skeleton className="w-12 h-6" />
                      ) : (
                        userProfile?.totalVotes ?? 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Votes
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {scoreboardLoading ? (
                        <Skeleton className="w-12 h-6" />
                      ) : (
                        userProfile?.debatesParticipated ?? 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Debates</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {scoreboardLoading ? (
                        <Skeleton className="w-12 h-6" />
                      ) : (
                        userProfile?.argumentsPosted ??
                        userArguments?.length ??
                        0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Arguments
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {scoreboardLoading ? (
                        <Skeleton className="w-12 h-6" />
                      ) : (
                        userProfile?.winRate ?? "-"
                      )}
                      {typeof userProfile?.winRate === "number" ? "%" : ""}
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
                  {argsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))
                  ) : recentDebates.length === 0 ? (
                    <div className="text-muted-foreground text-center py-8">
                      No recent debates found.
                    </div>
                  ) : (
                    recentDebates.map((debate, index) => (
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
                    ))
                  )}
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
                  {/* You may fetch achievements from an API if available */}
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
                    <MessageSquare className="h-5 w-5 unfounded text-blue-500" />
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
                    <Badge>
                      {userProfile?.debatesParticipated &&
                      userProfile.debatesParticipated >= 10
                        ? "Earned"
                        : "Locked"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <div className="font-semibold">Debate Veteran</div>
                      <div className="text-sm text-muted-foreground">
                        Participate in 50 debates
                      </div>
                    </div>
                    <Badge variant="outline">
                      {userProfile?.debatesParticipated
                        ? `${userProfile.debatesParticipated}/50`
                        : "0/50"}
                    </Badge>
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
                    <span className="font-semibold">
                      {userProfile?.argumentsPosted && userProfile?.totalVotes
                        ? (
                            userProfile.totalVotes / userProfile.argumentsPosted
                          ).toFixed(1)
                        : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most voted argument:</span>
                    <span className="font-semibold">
                      {userArguments &&
                        Math.max(
                          ...userArguments.map((a: any) => a.votes?.length ?? 0)
                        )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Debates won:</span>
                    <span className="font-semibold">
                      {userArguments &&
                        userArguments.filter(
                          (a: any) => a.debate?.status === "won"
                        ).length}
                      {userProfile?.debatesParticipated
                        ? ` / ${userProfile.debatesParticipated}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favorite category:</span>
                    <span className="font-semibold">
                      {userArguments &&
                        (() => {
                          const cats: Record<string, number> = {};
                          userArguments.forEach((a: any) => {
                            const cat = a.debate?.category || "Other";
                            cats[cat] = (cats[cat] || 0) + 1;
                          });
                          const sorted = Object.entries(cats).sort(
                            (a, b) => b[1] - a[1]
                          );
                          return sorted[0]?.[0] ?? "N/A";
                        })()}
                    </span>
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
                    <span className="font-semibold">
                      {userProfile?.joinDate
                        ? new Date(userProfile.joinDate).toLocaleString(
                            "default",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last debate:</span>
                    <span className="font-semibold">
                      {userArguments && userArguments.length > 0
                        ? (() => {
                            const dates = userArguments.map(
                              (a: any) => new Date(a.createdAt)
                            );
                            const last = dates.sort(
                              (a, b) => b.getTime() - a.getTime()
                            )[0];
                            const now = new Date();
                            const diffDays = Math.floor(
                              (now.getTime() - last.getTime()) /
                                (1000 * 60 * 60 * 24)
                            );
                            return diffDays === 0
                              ? "Today"
                              : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
                          })()
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most active day:</span>
                    <span className="font-semibold">
                      {userArguments && userArguments.length > 0
                        ? (() => {
                            const days: Record<string, number> = {};
                            userArguments.forEach((a: any) => {
                              const day = new Date(a.createdAt).toLocaleString(
                                "en",
                                {
                                  weekday: "long",
                                }
                              );
                              days[day] = (days[day] || 0) + 1;
                            });
                            const sorted = Object.entries(days).sort(
                              (a, b) => b[1] - a[1]
                            );
                            return sorted[0]?.[0] ?? "N/A";
                          })()
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current streak:</span>
                    <span className="font-semibold">
                      {userArguments && userArguments.length > 0
                        ? (() => {
                            // Simple streak based on consecutive days
                            const days = userArguments
                              .map((a: any) =>
                                new Date(a.createdAt).toISOString().slice(0, 10)
                              )
                              .sort();
                            let streak = 1;
                            for (let i = days.length - 1; i > 0; i--) {
                              const d1 = new Date(days[i]);
                              const d2 = new Date(days[i - 1]);
                              if (
                                Math.floor(
                                  (d1.getTime() - d2.getTime()) /
                                    (1000 * 60 * 60 * 24)
                                ) === 1
                              ) {
                                streak++;
                              } else {
                                break;
                              }
                            }
                            return `${streak} day${streak > 1 ? "s" : ""}`;
                          })()
                        : "0 days"}
                    </span>
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
