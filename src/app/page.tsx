// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { formatDistanceToNow } from "date-fns";
// import { motion } from "framer-motion";
// import {
//   Clock,
//   Filter,
//   MessageSquare,
//   Plus,
//   Search,
//   Users,
// } from "lucide-react";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface Debate {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   tags: string[];
//   image?: string;
//   createdBy: string;
//   createdAt: Date;
//   endsAt: Date;
//   supportCount: number;
//   opposeCount: number;
//   totalArguments: number;
//   status: "active" | "ended";
//   winner?: "support" | "oppose" | "tie";
// }

// const mockDebates: Debate[] = [
//   {
//     id: "1",
//     title: "Should AI replace human teachers in schools?",
//     description:
//       "Exploring the potential benefits and drawbacks of AI-powered education systems replacing traditional human educators.",
//     category: "Education",
//     tags: ["AI", "Education", "Technology"],
//     createdBy: "TechDebater",
//     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
//     endsAt: new Date(Date.now() + 22 * 60 * 60 * 1000),
//     supportCount: 15,
//     opposeCount: 23,
//     totalArguments: 38,
//     status: "active",
//   },
//   {
//     id: "2",
//     title: "Remote work is more productive than office work",
//     description:
//       "Debating whether working from home leads to better productivity and work-life balance compared to traditional office environments.",
//     category: "Work",
//     tags: ["Remote Work", "Productivity", "Lifestyle"],
//     createdBy: "WorkLifeGuru",
//     createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
//     endsAt: new Date(Date.now() + 7 * 60 * 60 * 1000),
//     supportCount: 31,
//     opposeCount: 18,
//     totalArguments: 49,
//     status: "active",
//   },
//   {
//     id: "3",
//     title: "Social media does more harm than good",
//     description:
//       "Examining the overall impact of social media platforms on society, mental health, and human connections.",
//     category: "Technology",
//     tags: ["Social Media", "Mental Health", "Society"],
//     createdBy: "DigitalCritic",
//     createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
//     endsAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
//     supportCount: 42,
//     opposeCount: 35,
//     totalArguments: 77,
//     status: "ended",
//     winner: "support",
//   },
// ];

// export default function HomePage() {
//   const { data: session } = useSession();
//   const [debates, setDebates] = useState<Debate[]>(mockDebates);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");
//   const [filteredDebates, setFilteredDebates] = useState<Debate[]>(debates);

//   useEffect(() => {
//     const filtered = debates.filter((debate) => {
//       const matchesSearch =
//         debate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         debate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         debate.tags.some((tag) =>
//           tag.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//       const matchesCategory =
//         categoryFilter === "all" || debate.category === categoryFilter;

//       return matchesSearch && matchesCategory;
//     });

//     // Sort debates
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return b.createdAt.getTime() - a.createdAt.getTime();
//         case "ending-soon":
//           return a.endsAt.getTime() - b.endsAt.getTime();
//         case "most-voted":
//           return (
//             b.supportCount + b.opposeCount - (a.supportCount + a.opposeCount)
//           );
//         case "most-arguments":
//           return b.totalArguments - a.totalArguments;
//         default:
//           return 0;
//       }
//     });

//     setFilteredDebates(filtered);
//   }, [debates, searchTerm, categoryFilter, sortBy]);

//   const getTimeRemaining = (endsAt: Date) => {
//     const now = new Date();
//     if (endsAt <= now) return "Ended";
//     return `${formatDistanceToNow(endsAt)} left`;
//   };

//   const categories = [
//     "all",
//     ...Array.from(new Set(debates.map((d) => d.category))),
//   ];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Hero Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-center mb-12"
//       >
//         <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Community Debate Arena
//         </h1>
//         <p className="text-xl text-muted-foreground mb-8">
//           Battle of Opinions - Where Ideas Clash and Truth Emerges
//         </p>
//         {session && (
//           <Link href="/create-debate">
//             <Button size="lg" className="gap-2">
//               <Plus className="h-5 w-5" />
//               Start New Debate
//             </Button>
//           </Link>
//         )}
//       </motion.div>

//       {/* Search and Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.1 }}
//         className="flex flex-col md:flex-row gap-4 mb-8"
//       >
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search debates, tags, or topics..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//           <SelectTrigger className="w-full md:w-48">
//             <Filter className="h-4 w-4 mr-2" />
//             <SelectValue placeholder="Category" />
//           </SelectTrigger>
//           <SelectContent>
//             {categories.map((category) => (
//               <SelectItem key={category} value={category}>
//                 {category === "all" ? "All Categories" : category}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select value={sortBy} onValueChange={setSortBy}>
//           <SelectTrigger className="w-full md:w-48">
//             <SelectValue placeholder="Sort by" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="newest">Newest</SelectItem>
//             <SelectItem value="ending-soon">Ending Soon</SelectItem>
//             <SelectItem value="most-voted">Most Voted</SelectItem>
//             <SelectItem value="most-arguments">Most Arguments</SelectItem>
//           </SelectContent>
//         </Select>
//       </motion.div>

//       {/* Debates Grid */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredDebates.map((debate, index) => (
//           <motion.div
//             key={debate.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//           >
//             <Link href={`/debate/${debate.id}`}>
//               <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
//                 <CardHeader>
//                   <div className="flex items-start justify-between mb-2">
//                     <Badge
//                       variant={
//                         debate.status === "active" ? "default" : "secondary"
//                       }
//                     >
//                       {debate.status === "active" ? "Active" : "Ended"}
//                     </Badge>
//                     {debate.status === "ended" && debate.winner && (
//                       <Badge
//                         variant="outline"
//                         className={
//                           debate.winner === "support"
//                             ? "border-green-500 text-green-700"
//                             : debate.winner === "oppose"
//                             ? "border-red-500 text-red-700"
//                             : "border-gray-500 text-gray-700"
//                         }
//                       >
//                         {debate.winner === "support"
//                           ? "Support Won"
//                           : debate.winner === "oppose"
//                           ? "Oppose Won"
//                           : "Tie"}
//                       </Badge>
//                     )}
//                   </div>
//                   <CardTitle className="line-clamp-2">{debate.title}</CardTitle>
//                   <CardDescription className="line-clamp-3">
//                     {debate.description}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-wrap gap-1 mb-4">
//                     {debate.tags.map((tag) => (
//                       <Badge key={tag} variant="outline" className="text-xs">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>

//                   <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center gap-1">
//                         <Users className="h-4 w-4" />
//                         {debate.supportCount + debate.opposeCount}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <MessageSquare className="h-4 w-4" />
//                         {debate.totalArguments}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-4 w-4" />
//                       {getTimeRemaining(debate.endsAt)}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-green-600">
//                         Support: {debate.supportCount}
//                       </span>
//                       <span className="text-red-600">
//                         Oppose: {debate.opposeCount}
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-green-500 h-2 rounded-l-full"
//                         style={{
//                           width: `${
//                             (debate.supportCount /
//                               (debate.supportCount + debate.opposeCount)) *
//                             100
//                           }%`,
//                         }}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 mt-4 pt-4 border-t">
//                     <Avatar className="h-6 w-6">
//                       <AvatarFallback className="text-xs">
//                         {debate.createdBy.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="text-sm text-muted-foreground">
//                       by {debate.createdBy}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </Link>
//           </motion.div>
//         ))}
//       </div>

//       {filteredDebates.length === 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center py-12"
//         >
//           <p className="text-muted-foreground text-lg">
//             No debates found matching your criteria.
//           </p>
//           {session && (
//             <Link href="/create-debate">
//               <Button className="mt-4">Create the First Debate</Button>
//             </Link>
//           )}
//         </motion.div>
//       )}
//     </div>
//   );
// }

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListDebatesQuery } from "@/redux/features/debateApi";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  Clock,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";

// Match the API JSON shape
interface DebateAPIResponse {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: string;
  createdBy: string;
  createdAt: string;
  endsAt: string;
  duration: number;
  closed: boolean;
  winner: "support" | "oppose" | "tie" | null;
  participants: Array<{
    user: string;
    side: "support" | "oppose";
    joinedAt: string;
  }>;
}

interface Debate {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: string;
  createdBy: string;
  createdAt: Date;
  endsAt: Date;
  supportCount: number;
  opposeCount: number;
  totalArguments: number;
  status: "active" | "ended";
  winner?: "support" | "oppose" | "tie";
}

export default function HomePage() {
  const { data: session } = useSession();
  const { data: debatesRaw, isLoading } = useListDebatesQuery();

  // Transform API response to Debate[]
  const debates: Debate[] = useMemo(() => {
    if (!debatesRaw) return [];
    return debatesRaw.map((debate: DebateAPIResponse) => {
      const supportCount = debate.participants
        ? debate.participants.filter((p) => p.side === "support").length
        : 0;
      const opposeCount = debate.participants
        ? debate.participants.filter((p) => p.side === "oppose").length
        : 0;
      // For demo, set totalArguments to 0 (fetch from /api/arguments/:debateId if needed)
      return {
        id: debate._id,
        title: debate.title,
        description: debate.description,
        category: debate.category,
        tags: debate.tags,
        image: debate.image,
        createdBy: debate.createdBy,
        createdAt: new Date(debate.createdAt),
        endsAt: new Date(debate.endsAt),
        supportCount,
        opposeCount,
        totalArguments: 0,
        status:
          debate.closed || new Date(debate.endsAt) < new Date()
            ? "ended"
            : "active",
        winner: debate.winner ?? undefined,
      };
    });
  }, [debatesRaw]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filtering and sorting
  const filteredDebates = useMemo(() => {
    let filtered = debates.filter((debate) => {
      const matchesSearch =
        debate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        categoryFilter === "all" || debate.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    // Sort debates
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "ending-soon":
          return a.endsAt.getTime() - b.endsAt.getTime();
        case "most-voted":
          return (
            b.supportCount + b.opposeCount - (a.supportCount + a.opposeCount)
          );
        case "most-arguments":
          return b.totalArguments - a.totalArguments;
        default:
          return 0;
      }
    });

    return filtered;
  }, [debates, searchTerm, categoryFilter, sortBy]);

  const getTimeRemaining = (endsAt: Date) => {
    const now = new Date();
    if (endsAt <= now) return "Ended";
    return `${formatDistanceToNow(endsAt)} left`;
  };

  const categories = [
    "all",
    ...Array.from(new Set(debates.map((d) => d.category))),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Community Debate Arena
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Battle of Opinions - Where Ideas Clash and Truth Emerges
        </p>
        {session && (
          <Link href="/create-debate">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Start New Debate
            </Button>
          </Link>
        )}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search debates, tags, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="ending-soon">Ending Soon</SelectItem>
            <SelectItem value="most-voted">Most Voted</SelectItem>
            <SelectItem value="most-arguments">Most Arguments</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Debates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center text-muted-foreground py-24">
            Loading debates...
          </div>
        ) : (
          filteredDebates.map((debate, index) => (
            <motion.div
              key={debate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/debate/${debate.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant={
                          debate.status === "active" ? "default" : "secondary"
                        }
                      >
                        {debate.status === "active" ? "Active" : "Ended"}
                      </Badge>
                      {debate.status === "ended" && debate.winner && (
                        <Badge
                          variant="outline"
                          className={
                            debate.winner === "support"
                              ? "border-green-500 text-green-700"
                              : debate.winner === "oppose"
                              ? "border-red-500 text-red-700"
                              : "border-gray-500 text-gray-700"
                          }
                        >
                          {debate.winner === "support"
                            ? "Support Won"
                            : debate.winner === "oppose"
                            ? "Oppose Won"
                            : "Tie"}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">
                      {debate.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {debate.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {debate.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {debate.supportCount + debate.opposeCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {debate.totalArguments}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getTimeRemaining(debate.endsAt)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">
                          Support: {debate.supportCount}
                        </span>
                        <span className="text-red-600">
                          Oppose: {debate.opposeCount}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-l-full"
                          style={{
                            width: `${
                              debate.supportCount + debate.opposeCount === 0
                                ? 0
                                : (debate.supportCount /
                                    (debate.supportCount +
                                      debate.opposeCount)) *
                                  100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {typeof debate.createdBy === "string"
                            ? debate.createdBy.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        by {debate.createdBy}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {!isLoading && filteredDebates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg">
            No debates found matching your criteria.
          </p>
          {session && (
            <Link href="/create-debate">
              <Button className="mt-4">Create the First Debate</Button>
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
