"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  Medal,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

interface LeaderboardUser {
  id: string;
  username: string;
  avatar?: string;
  totalVotes: number;
  debatesParticipated: number;
  winRate: number;
  rank: number;
  badge: "gold" | "silver" | "bronze" | null;
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    username: "DebateMaster2024",
    totalVotes: 1247,
    debatesParticipated: 45,
    winRate: 78,
    rank: 1,
    badge: "gold",
  },
  {
    id: "2",
    username: "LogicWarrior",
    totalVotes: 1156,
    debatesParticipated: 38,
    winRate: 71,
    rank: 2,
    badge: "silver",
  },
  {
    id: "3",
    username: "ArgumentAce",
    totalVotes: 1089,
    debatesParticipated: 42,
    winRate: 69,
    rank: 3,
    badge: "bronze",
  },
  {
    id: "4",
    username: "ReasonRebel",
    totalVotes: 987,
    debatesParticipated: 35,
    winRate: 66,
    rank: 4,
    badge: null,
  },
  {
    id: "5",
    username: "ThoughtLeader",
    totalVotes: 923,
    debatesParticipated: 31,
    winRate: 64,
    rank: 5,
    badge: null,
  },
  {
    id: "6",
    username: "IdeaChampion",
    totalVotes: 876,
    debatesParticipated: 29,
    winRate: 62,
    rank: 6,
    badge: null,
  },
  {
    id: "7",
    username: "DiscussionDynamo",
    totalVotes: 834,
    debatesParticipated: 33,
    winRate: 58,
    rank: 7,
    badge: null,
  },
  {
    id: "8",
    username: "PersuasionPro",
    totalVotes: 789,
    debatesParticipated: 27,
    winRate: 55,
    rank: 8,
    badge: null,
  },
];

export default function ScoreboardPage() {
  const [timeFilter, setTimeFilter] = useState<
    "weekly" | "monthly" | "all-time"
  >("all-time");

  const getBadgeIcon = (badge: "gold" | "silver" | "bronze" | null) => {
    switch (badge) {
      case "gold":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "silver":
        return <Medal className="h-5 w-5 text-gray-400" />;
      case "bronze":
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600";
    if (rank === 2) return "text-gray-500";
    if (rank === 3) return "text-amber-600";
    return "text-muted-foreground";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Debate Champions
          </h1>
          <p className="text-muted-foreground">
            Top debaters ranked by votes, participation, and win rate
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            {(["weekly", "monthly", "all-time"] as const).map((filter) => (
              <Button
                key={filter}
                variant={timeFilter === filter ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeFilter(filter)}
                className="capitalize"
              >
                {filter === "all-time" ? "All Time" : filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {mockLeaderboard.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                index === 0
                  ? "md:order-2"
                  : index === 1
                  ? "md:order-1"
                  : "md:order-3"
              }`}
            >
              <Card
                className={`text-center ${
                  user.rank === 1
                    ? "border-yellow-200 bg-yellow-50"
                    : user.rank === 2
                    ? "border-gray-200 bg-gray-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-2">
                    {getBadgeIcon(user.badge)}
                  </div>
                  <div
                    className={`text-2xl font-bold ${getRankColor(user.rank)}`}
                  >
                    #{user.rank}
                  </div>
                  <Avatar className="h-16 w-16 mx-auto mb-2">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.username}
                    />
                    <AvatarFallback className="text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{user.username}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Votes:
                      </span>
                      <span className="font-semibold">
                        {user.totalVotes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Debates:</span>
                      <span className="font-semibold">
                        {user.debatesParticipated}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Win Rate:</span>
                      <span className="font-semibold">{user.winRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Full Leaderboard
            </CardTitle>
            <CardDescription>
              Complete ranking of all debate participants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLeaderboard.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-xl font-bold w-8 text-center ${getRankColor(
                        user.rank
                      )}`}
                    >
                      #{user.rank}
                    </div>
                    {getBadgeIcon(user.badge)}
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{user.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.debatesParticipated} debates • {user.winRate}% win
                        rate
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {user.totalVotes.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      total votes
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-muted-foreground">
                    Active Debaters
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">89</div>
                  <div className="text-sm text-muted-foreground">
                    Debates This Week
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">23,456</div>
                  <div className="text-sm text-muted-foreground">
                    Total Arguments
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
