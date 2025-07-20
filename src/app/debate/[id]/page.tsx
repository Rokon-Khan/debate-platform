/* eslint-disable @typescript-eslint/no-explicit-any */

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
import {
  useDeleteArgumentMutation,
  useEditArgumentMutation,
  useListArgumentsQuery,
  usePostArgumentMutation,
} from "@/redux/features/argumentApi";
import {
  useGetDebateQuery,
  useJoinDebateMutation,
} from "@/redux/features/debateApi";
import { useVoteArgumentMutation } from "@/redux/features/voteApi";
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
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const bannedWords = ["stupid", "idiot", "dumb", "moron", "fool"];

export default function DebatePage() {
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();
  const debateId = params.id;
  const { data: debateRaw, isLoading: debateLoading } = useGetDebateQuery(
    debateId,
    { skip: !debateId }
  );
  const {
    data: argumentsRaw,
    isLoading: argumentsLoading,
    refetch: refetchArguments,
  } = useListArgumentsQuery(debateId, { skip: !debateId });
  const [joinDebate] = useJoinDebateMutation();
  const [postArgument] = usePostArgumentMutation();
  const [editArgument] = useEditArgumentMutation();
  const [deleteArgument] = useDeleteArgumentMutation();
  const [voteArgument] = useVoteArgumentMutation();

  const [newArgument, setNewArgument] = useState("");
  const [replyTimer, setReplyTimer] = useState<number | null>(null);

  // Memo Debate transformation
  const debate = useMemo(() => {
    if (!debateRaw) return null;
    const supportCount =
      debateRaw.participants?.filter((p: any) => p.side === "support").length ??
      0;
    const opposeCount =
      debateRaw.participants?.filter((p: any) => p.side === "oppose").length ??
      0;
    const userSide =
      session && debateRaw.participants
        ? debateRaw.participants.find((p: any) => p.user === session.user?.id)
            ?.side
        : undefined;
    const hasJoined =
      session && debateRaw.participants
        ? debateRaw.participants.some((p: any) => p.user === session.user?.id)
        : false;
    const ended = debateRaw.closed || new Date(debateRaw.endsAt) < new Date();

    return {
      id: debateRaw._id,
      title: debateRaw.title,
      description: debateRaw.description,
      category: debateRaw.category,
      tags: debateRaw.tags,
      createdBy:
        typeof debateRaw.createdBy === "object"
          ? debateRaw.createdBy.username
          : debateRaw.createdBy,
      createdAt: new Date(debateRaw.createdAt),
      endsAt: new Date(debateRaw.endsAt),
      supportCount,
      opposeCount,
      totalArguments: argumentsRaw ? argumentsRaw.length : 0,
      status: ended ? "ended" : "active",
      winner: debateRaw.winner ?? undefined,
      userSide,
      hasJoined,
    };
  }, [debateRaw, argumentsRaw, session]);

  // Memo Arguments transformation
  const args = useMemo(() => {
    if (!argumentsRaw) return [];
    return argumentsRaw.map((arg: any) => {
      const canEdit =
        session &&
        arg.author?._id === session.user?.id &&
        Date.now() - new Date(arg.createdAt).getTime() <= 5 * 60 * 1000; // 5 min
      return {
        id: arg._id,
        content: arg.content,
        author:
          typeof arg.author === "object" ? arg.author.username : arg.author,
        authorId: typeof arg.author === "object" ? arg.author._id : arg.author,
        side: arg.side,
        votes: arg.votes?.length ?? 0,
        hasVoted: session ? arg.votes?.includes(session.user?.id) : false,
        createdAt: new Date(arg.createdAt),
        canEdit,
      };
    });
  }, [argumentsRaw, session]);

  // Timer updates
  const [timeRemaining, setTimeRemaining] = useState("");
  useEffect(() => {
    if (!debate) return;
    const updateTimer = () => {
      const now = new Date();
      if (debate.endsAt <= now) {
        setTimeRemaining("Debate Ended");
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

  const joinSide = async (side: "support" | "oppose") => {
    if (!session || !debate || debate.status === "ended") return;
    try {
      await joinDebate({ id: debate.id, side }).unwrap();
      toast(
        `Joined ${
          side === "support" ? "Support" : "Oppose"
        } side! You have 5 minutes to post your first argument.`
      );
      setReplyTimer(5 * 60);
    } catch (err: any) {
      toast(err?.data?.message || "Could not join debate");
    }
  };

  const checkForBannedWords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return bannedWords.some((word) => lowerText.includes(word));
  };

  const submitArgument = async () => {
    if (!session || !debate || !debate.userSide || !newArgument.trim()) return;
    if (checkForBannedWords(newArgument)) {
      toast(
        "Your argument contains inappropriate language. Please revise and try again."
      );
      return;
    }
    try {
      await postArgument({
        debateId: debate.id,
        content: newArgument.trim(),
      }).unwrap();
      setNewArgument("");
      setReplyTimer(null); // Clear reply timer after first post
      await refetchArguments();
      toast("Your argument has been added to the debate.");
    } catch (err: any) {
      toast(err?.data?.message || "Failed to post argument");
    }
  };

  const voteOnArgument = async (argumentId: string, hasVoted: boolean) => {
    if (!session) return;
    try {
      await voteArgument(argumentId).unwrap();
      await refetchArguments();
    } catch (err: any) {
      toast(err?.data?.message || "Failed to vote");
    }
  };

  const handleEditArgument = async (argumentId: string, newContent: string) => {
    try {
      await editArgument({ id: argumentId, content: newContent }).unwrap();
      await refetchArguments();
      toast("Argument updated.");
    } catch (err: any) {
      toast(err?.data?.message || "Failed to edit argument");
    }
  };

  const handleDeleteArgument = async (argumentId: string) => {
    try {
      await deleteArgument(argumentId).unwrap();
      await refetchArguments();
      toast("Argument deleted.");
    } catch (err: any) {
      toast(err?.data?.message || "Failed to delete argument");
    }
  };

  const shareDebate = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Debate link has been copied to your clipboard.");
  };

  // Split by side
  const supportArgs = args.filter((arg) => arg.side === "support");
  const opposeArgs = args.filter((arg) => arg.side === "oppose");

  if (debateLoading || argumentsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading debate...</div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Debate not found.</div>
      </div>
    );
  }

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
                    debate.userSide === "support"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                Post Your Argument (
                {debate.userSide === "support" ? "Support" : "Oppose"})
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
                              {argument.author?.charAt(0)?.toUpperCase() ?? "?"}
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const newContent = prompt(
                                  "Edit your argument:",
                                  argument.content
                                );
                                if (
                                  newContent &&
                                  newContent.trim() &&
                                  !checkForBannedWords(newContent)
                                ) {
                                  await handleEditArgument(
                                    argument.id,
                                    newContent.trim()
                                  );
                                } else if (
                                  newContent &&
                                  checkForBannedWords(newContent)
                                ) {
                                  toast(
                                    "Your argument contains inappropriate language."
                                  );
                                }
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteArgument(argument.id)}
                            >
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
                          onClick={() =>
                            voteOnArgument(argument.id, argument.hasVoted)
                          }
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
                              {argument.author?.charAt(0)?.toUpperCase() ?? "?"}
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const newContent = prompt(
                                  "Edit your argument:",
                                  argument.content
                                );
                                if (
                                  newContent &&
                                  newContent.trim() &&
                                  !checkForBannedWords(newContent)
                                ) {
                                  await handleEditArgument(
                                    argument.id,
                                    newContent.trim()
                                  );
                                } else if (
                                  newContent &&
                                  checkForBannedWords(newContent)
                                ) {
                                  toast(
                                    "Your argument contains inappropriate language."
                                  );
                                }
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteArgument(argument.id)}
                            >
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
                          onClick={() =>
                            voteOnArgument(argument.id, argument.hasVoted)
                          }
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
