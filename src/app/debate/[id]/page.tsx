"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Edit,
  MessageSquare,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast"

interface Argument {
  id: string;
  content: string;
  author: string;
  authorId: string;
  side: "support" | "oppose";
  votes: number;
  hasVoted: boolean;
  createdAt: Date;
  canEdit: boolean;
}

interface Debate {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  endsAt: Date;
  supportCount: number;
  opposeCount: number;
  totalArguments: number;
  status: "active" | "ended";
  winner?: "support" | "oppose" | "tie";
  userSide?: "support" | "oppose";
  hasJoined: boolean;
}

const bannedWords = ["stupid", "idiot", "dumb", "moron", "fool"];

export default function DebatePage() {
  const { data: session } = useSession();
  const params = useParams();
  //   const { toast } = useToast()
  const [debate, setDebate] = useState<Debate | null>(null);
  const [args, setArgs] = useState<Argument[]>([]);
  const [newArgument, setNewArgument] = useState("");
  const [selectedSide, setSelectedSide] = useState<"support" | "oppose" | null>(
    null
  );
  const [timeRemaining, setTimeRemaining] = useState("");
  const [replyTimer, setReplyTimer] = useState<number | null>(null);

  // Mock data
  useEffect(() => {
    const mockDebate: Debate = {
      id: params.id as string,
      title: "Should AI replace human teachers in schools?",
      description:
        "Exploring the potential benefits and drawbacks of AI-powered education systems replacing traditional human educators.",
      category: "Education",
      tags: ["AI", "Education", "Technology"],
      createdBy: "TechDebater",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endsAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
      supportCount: 15,
      opposeCount: 23,
      totalArguments: 38,
      status: "active",
      hasJoined: false,
    };

    const mockArguments: Argument[] = [
      {
        id: "1",
        content:
          "AI can provide personalized learning experiences that adapt to each student's pace and learning style. This level of customization is impossible for human teachers managing 30+ students.",
        author: "EduTechFan",
        authorId: "user1",
        side: "support",
        votes: 12,
        hasVoted: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        canEdit: false,
      },
      {
        id: "2",
        content:
          "Human teachers provide emotional support, empathy, and social interaction that AI cannot replicate. Education is not just about information transfer but about human development.",
        author: "HumanFirst",
        authorId: "user2",
        side: "oppose",
        votes: 18,
        hasVoted: false,
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
        canEdit: false,
      },
      {
        id: "3",
        content:
          "AI teachers would be available 24/7, never get tired, and could handle unlimited students simultaneously. This could solve the global teacher shortage crisis.",
        author: "ScaleSolver",
        authorId: "user3",
        side: "support",
        votes: 8,
        hasVoted: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        canEdit: false,
      },
    ];

    setDebate(mockDebate);
    setArgs(mockArguments);
  }, [params.id]);

  // Timer updates
  useEffect(() => {
    if (!debate) return;

    const updateTimer = () => {
      const now = new Date();
      if (debate.endsAt <= now) {
        setTimeRemaining("Debate Ended");
        setDebate((prev) => (prev ? { ...prev, status: "ended" } : null));
      } else {
        setTimeRemaining(
          formatDistanceToNow(debate.endsAt, { addSuffix: true })
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [debate]);

  // Reply timer for joined users
  useEffect(() => {
    if (replyTimer === null) return;

    if (replyTimer <= 0) {
      toast("You must post your first argument within 5 minutes of joining.");
      setReplyTimer(null);
      return;
    }

    const interval = setInterval(() => {
      setReplyTimer((prev) => (prev ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [replyTimer]);

  const joinSide = (side: "support" | "oppose") => {
    if (!session || !debate || debate.status === "ended") return;

    setSelectedSide(side);
    setDebate((prev) =>
      prev
        ? {
            ...prev,
            userSide: side,
            hasJoined: true,
            [side === "support" ? "supportCount" : "opposeCount"]:
              prev[side === "support" ? "supportCount" : "opposeCount"] + 1,
          }
        : null
    );

    // Start 5-minute reply timer
    setReplyTimer(5 * 60); // 5 minutes in seconds

    toast(
      `Joined ${side === "support" ? "Support" : "Oppose"} side!
        You have 5 minutes to post your first argument.`
    );
  };

  const checkForBannedWords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return bannedWords.some((word) => lowerText.includes(word));
  };

  const submitArgument = () => {
    if (!session || !debate || !selectedSide || !newArgument.trim()) return;

    if (checkForBannedWords(newArgument)) {
      toast(
        "Your argument contains inappropriate language. Please revise and try again."
      );
      return;
    }

    const argument: Argument = {
      id: Date.now().toString(),
      content: newArgument.trim(),
      author: session.user?.name || "Anonymous",
      authorId: session.user?.email || "anonymous",
      side: selectedSide,
      votes: 0,
      hasVoted: false,
      createdAt: new Date(),
      canEdit: true,
    };

    setArgs((prev) => [argument, ...prev]);
    setNewArgument("");
    setReplyTimer(null); // Clear reply timer after first post

    toast("Your argument has been added to the debate.");
  };

  const voteOnArgument = (argumentId: string) => {
    if (!session) return;

    setArgs((prev) =>
      prev.map((arg) =>
        arg.id === argumentId
          ? {
              ...arg,
              votes: arg.hasVoted ? arg.votes - 1 : arg.votes + 1,
              hasVoted: !arg.hasVoted,
            }
          : arg
      )
    );
  };

  const shareDebate = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Debate link has been copied to your clipboard.");
  };

  if (!debate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading debate...</div>
      </div>
    );
  }

  const supportArgs = args.filter((arg) => arg.side === "support");
  const opposeArgs = args.filter((arg) => arg.side === "oppose");

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Debate Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-2">
                <Badge
                  variant={debate.status === "active" ? "default" : "secondary"}
                >
                  {debate.status === "active" ? "Active" : "Ended"}
                </Badge>
                <Badge variant="outline">{debate.category}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={shareDebate}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            <CardTitle className="text-2xl mb-2">{debate.title}</CardTitle>
            <CardDescription className="text-base mb-4">
              {debate.description}
            </CardDescription>

            <div className="flex flex-wrap gap-2 mb-4">
              {debate.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {debate.supportCount + debate.opposeCount} participants
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {debate.totalArguments} arguments
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {timeRemaining}
                </div>
              </div>
              <div className="text-sm">Created by {debate.createdBy}</div>
            </div>
          </CardHeader>
        </Card>

        {/* Join Debate Section */}
        {session && !debate.hasJoined && debate.status === "active" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="border-2 border-dashed">
              <CardHeader className="text-center">
                <CardTitle>Choose Your Side</CardTitle>
                <CardDescription>
                  Join the debate by selecting whether you support or oppose
                  this topic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-20 border-green-200 hover:bg-green-50 hover:border-green-300 bg-transparent"
                    onClick={() => joinSide("support")}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        Support
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {debate.supportCount} participants
                      </div>
                    </div>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-20 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                    onClick={() => joinSide("oppose")}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-red-600">
                        Oppose
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {debate.opposeCount} participants
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reply Timer Warning */}
        {replyTimer !== null && replyTimer > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    Post your first argument within{" "}
                    {Math.floor(replyTimer / 60)}:
                    {(replyTimer % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Argument Posting */}
        {session && debate.hasJoined && debate.status === "active" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedSide === "support" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                Post Your Argument (
                {selectedSide === "support" ? "Support" : "Oppose"})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your argument and reasoning..."
                  value={newArgument}
                  onChange={(e) => setNewArgument(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {newArgument.length}/1000 characters
                  </span>
                  <Button
                    onClick={submitArgument}
                    disabled={!newArgument.trim() || newArgument.length > 1000}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post Argument
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Arguments Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Support Arguments */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <h2 className="text-xl font-semibold">
                Support ({supportArgs.length})
              </h2>
            </div>
            <div className="space-y-4">
              {supportArgs.map((argument, index) => (
                <motion.div
                  key={argument.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {argument.author.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {argument.author}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(argument.createdAt, {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>
                        {argument.canEdit && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm mb-4">{argument.content}</p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => voteOnArgument(argument.id)}
                          className={argument.hasVoted ? "text-blue-600" : ""}
                          disabled={!session || debate.status === "ended"}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {argument.votes}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {supportArgs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No support arguments yet. Be the first to make your case!
                </div>
              )}
            </div>
          </div>

          {/* Oppose Arguments */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <h2 className="text-xl font-semibold">
                Oppose ({opposeArgs.length})
              </h2>
            </div>
            <div className="space-y-4">
              {opposeArgs.map((argument, index) => (
                <motion.div
                  key={argument.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {argument.author.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">
                              {argument.author}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(argument.createdAt, {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>
                        {argument.canEdit && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm mb-4">{argument.content}</p>
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => voteOnArgument(argument.id)}
                          className={argument.hasVoted ? "text-blue-600" : ""}
                          disabled={!session || debate.status === "ended"}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {argument.votes}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {opposeArgs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No oppose arguments yet. Be the first to make your case!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Debate Results */}
        {debate.status === "ended" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl">Debate Results</CardTitle>
                <CardDescription>
                  This debate has ended. Here are the final results:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {debate.supportCount}
                    </div>
                    <div className="text-sm text-green-600">Support Votes</div>
                  </div>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700">
                      {debate.winner === "support"
                        ? "Support Wins!"
                        : debate.winner === "oppose"
                        ? "Oppose Wins!"
                        : "Tie!"}
                    </div>
                    <div className="text-sm text-gray-600">Final Result</div>
                  </div>
                  <div className="p-4 bg-red-100 rounded-lg">
                    <div className="text-2xl font-bold text-red-700">
                      {debate.opposeCount}
                    </div>
                    <div className="text-sm text-red-600">Oppose Votes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
