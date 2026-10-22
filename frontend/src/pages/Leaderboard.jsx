import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GridBackground } from "@/components/backgrounds/GridBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AddUserModal from "@/components/ui/AddUserModal";
import WORKER_URL from "@/lib/worker";
import {
  TrendingUp,
  ExternalLink,
  Target,
  Filter,
  Medal,
  Search,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const BRANCHES = [
  "FE CA",
  "FE CB",
  "FE CC",
  "FE CSE A",
  "FE CSE B",
  "FE CSE C",
  "FE MECH",
  "FE ECS",
  "SE CA",
  "SE CB",
  "SE CC",
  "SE CSE",
  "SE ECS",
  "SE MECH",
  "TE CA",
  "TE CB",
  "TE ECS",
  "TE AIDS",
  "TE MECH",
  "BE CA",
  "BE CB",
  "BE ECS",
  "BE AIDS",
  "BE MECH",
];

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("total");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const sortOptions = [
    { value: "total", label: "Total Problems", icon: Target },
    { value: "easy", label: "Easy Problems", icon: TrendingUp },
    { value: "medium", label: "Medium Problems", icon: TrendingUp },
    { value: "hard", label: "Hard Problems", icon: TrendingUp },
    { value: "ranking", label: "LeetCode Ranking", icon: Medal },
  ];

  const years = ["FE", "SE", "TE", "BE"];

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy, currentPage]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  // Update the fetch to get all data when filtering
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setLoadError("");

      // If we're filtering, fetch all data; otherwise paginate on server
      const shouldFetchAll = selectedYear || selectedBranch || searchQuery;
      const url = shouldFetchAll
        ? `${WORKER_URL}/leaderboard?sortBy=${sortBy}&limit=1000`
        : `${WORKER_URL}/leaderboard?sortBy=${sortBy}&page=${currentPage}&limit=10`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboardData(data.data || []);

      if (!shouldFetchAll) {
        setTotalPages(data.totalPages || 0);
        setTotalUsers(data.totalUsers || 0);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoadError(
        "Unable to reach the leaderboard service. Check the worker URL and confirm the Cloudflare Worker is deployed."
      );
      setLeaderboardData([]);
      toast.error("Failed to load leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  // Update pagination for filtered data
  useEffect(() => {
    if (!leaderboardData) {
      setFilteredData(null);
      return;
    }

    let filtered = [...leaderboardData];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((user) => {
        const username = user.username.toLowerCase();
        const realName = (user.profile?.realName || "").toLowerCase();
        const query = searchQuery.toLowerCase();
        return username.includes(query) || realName.includes(query);
      });
    }

    // Apply year filter
    if (selectedYear) {
      filtered = filtered.filter((user) => user.year === selectedYear);
    }

    // Apply branch filter
    if (selectedBranch && selectedBranch !== "all") {
      filtered = filtered.filter((user) => user.branch === selectedBranch);
    }

    // Handle pagination for filtered data
    if (selectedYear || selectedBranch || searchQuery) {
      const itemsPerPage = 10;
      const totalFilteredPages = Math.ceil(filtered.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      setTotalPages(totalFilteredPages);
      setTotalUsers(filtered.length);
      setFilteredData(filtered.slice(startIndex, endIndex));
    } else {
      // No filters applied - use original data and fetch new data if needed
      setFilteredData(filtered);
      // Re-fetch to get proper pagination from server
      if (leaderboardData.length >= 1000) {
        fetchLeaderboard();
      }
    }
  }, [leaderboardData, searchQuery, selectedYear, selectedBranch, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedBranch, searchQuery]);

  // Re-fetch when filters are cleared
  useEffect(() => {
    if (!selectedYear && !selectedBranch && !searchQuery) {
      fetchLeaderboard();
    }
  }, [selectedYear, selectedBranch, searchQuery, sortBy, currentPage]);

const handleAddUser = async ({ username, branch }) => {
  try {
    const response = await fetch(`${WORKER_URL}/add-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, branch }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add user");
    }

    toast.success(
      `${data.realName || username} added to leaderboard successfully!`
    );

    // Refresh the leaderboard data
    await fetchLeaderboard();
  } catch (error) {
    console.error("Error adding user:", error);

    if (error.message.includes("already exists")) {
      toast.error("User already exists in the leaderboard");
    } else if (error.message.includes("not found")) {
      toast.error("LeetCode username not found. Please check the username.");
    } else {
      toast.error("Failed to add user. Please try again.");
    }

    throw error; // Re-throw to prevent modal from closing
  }
};

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 2:
        return "bg-gray-400/20 text-gray-300 border-gray-400/30";
      case 3:
        return "bg-amber-600/20 text-amber-400 border-amber-600/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const clearFilters = () => {
    setSelectedYear("");
    setSelectedBranch("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const getFilteredBranches = () => {
    if (!selectedYear) return BRANCHES;
    return BRANCHES.filter((branch) => branch.startsWith(selectedYear));
  };

  if (loading) {
    return (
      <GridBackground className="min-h-screen" maskIntensity="0.1%">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </GridBackground>
    );
  }

  return (
    <GridBackground className="min-h-screen" maskIntensity="0.1%">
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-4xl text-foreground flex-1">
          {/* Back Button */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground dark:text-foreground leading-tight">
              CRCE's{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                LeetCode
              </span>{" "}
              Leaderboard
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              The snakes who might be grinding next to you 🐍
            </p>
          </motion.div>

          {/* Controls Row */}
          <motion.div
            className="space-y-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Sort and Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              {/* Sort Filter */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
                <Label className="text-sm text-muted-foreground hidden sm:block">
                  Sort by:
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="pl-10 text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Year Filter Pills and Add User Button */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Label className="text-sm text-muted-foreground">
                Filter by Year:
              </Label>
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedYear(selectedYear === year ? "" : year);
                      setSelectedBranch(""); 
                    }}
                    className="rounded-full px-4 py-1 h-8"
                  >
                    {year}
                  </Button>
                ))}
              </div>
              <div className="w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
                <Button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Join the Leaderboard
                </Button>
              </div>
            </div>

            {/* Branch Filter */}
            {selectedYear && (
              <div className="flex items-center gap-3">
                <Label className="text-sm text-muted-foreground">Branch:</Label>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {getFilteredBranches().map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </motion.div>

          {/* Main Content Area - Takes up remaining space */}
          <div className="flex-1 flex flex-col">
            {/* Leaderboard */}
            {filteredData && filteredData.length > 0 ? (
              <motion.div
                className="space-y-3 sm:space-y-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatePresence>
                  {filteredData.map((user, index) => {
                    const currentRank = user.rank;
                    return (
                      <motion.div
                        key={user.username}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group"
                      >
                        <Card
                          className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                            currentRank <= 3
                              ? "bg-gradient-to-r from-card/90 to-card/70 border-primary/50"
                              : "bg-card/80 hover:bg-card/90"
                          } backdrop-blur-md border-border hover:border-primary/30`}
                        >
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                              {/* Rank Number */}
                              <div className="flex-shrink-0 w-8 sm:w-12 lg:w-16 flex justify-center">
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                                  {currentRank}
                                </span>
                              </div>

                              {/* User Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                  <h3 className="font-semibold text-white truncate text-sm sm:text-base">
                                    {user.profile?.realName || user.username}
                                  </h3>
                                  <Badge
                                    className={`text-xs w-fit ${getRankBadgeColor(
                                      currentRank
                                    )}`}
                                  >
                                    #{currentRank}
                                  </Badge>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    @{user.username}
                                  </p>
                                  {user.ranking > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      <span className="hidden sm:inline">
                                        •{" "}
                                      </span>
                                      LC Rank: {user.ranking.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {(user.branch || user.year) && (
                                  <div className="flex items-center gap-2 mt-1">
                                    {user.branch && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {user.branch}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Desktop Stats */}
                              <div className="hidden xl:flex items-center gap-4 lg:gap-6">
                                <div className="text-center">
                                  <div className="text-lg lg:text-xl font-bold text-white">
                                    {user.totalSolved || 0}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Total
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div className="text-sm font-medium text-green-400">
                                    {user.easySolved || 0}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Easy
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div className="text-sm font-medium text-yellow-400">
                                    {user.mediumSolved || 0}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Medium
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div className="text-sm font-medium text-red-400">
                                    {user.hardSolved || 0}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Hard
                                  </div>
                                </div>
                              </div>

                              {/* Tablet Stats - Total Only */}
                              <div className="hidden sm:block xl:hidden text-right">
                                <div className="text-lg lg:text-xl font-bold text-white">
                                  {user.totalSolved || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Problems
                                </div>
                              </div>

                              {/* Mobile Stats - Total Only */}
                              <div className="sm:hidden text-right">
                                <div className="text-base font-bold text-white">
                                  {user.totalSolved || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Total
                                </div>
                              </div>

                              {/* LeetCode Link */}
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity p-2"
                              >
                                <a
                                  href={`https://leetcode.com/${user.username}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center"
                                >
                                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                </a>
                              </Button>
                            </div>

                            {/* Mobile/Tablet Expanded Stats */}
                            <div className="xl:hidden mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50">
                              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                <div>
                                  <div className="text-sm font-medium text-green-400">
                                    {user.easySolved || 0}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Easy
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-yellow-400">
                                    {user.mediumSolved || 0}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Medium
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-red-400">
                                    {user.hardSolved || 0}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Hard
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-8 sm:py-12 flex-1 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div>
                  <p className="text-muted-foreground text-base sm:text-lg mb-4">
                    {loadError
                      ? loadError
                      : searchQuery
                      ? `No users found matching "${searchQuery}"`
                      : "No users found in the leaderboard"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {loadError ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchLeaderboard}
                        disabled={loading}
                      >
                        Retry
                      </Button>
                    ) : searchQuery ? (
                      "Try a different search term!"
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Pagination - Fixed at bottom */}
            {totalPages > 1 && (
              <motion.div
                className="mt-auto pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* First page */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(1)}
                        isActive={currentPage === 1}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {/* Show ellipsis if current page is far from start */}
                    {currentPage > 3 && totalPages > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Pages around current page */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (page === 1 || page === totalPages) return false;
                        return Math.abs(page - currentPage) <= 1;
                      })
                      .map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    {/* Show ellipsis if current page is far from end */}
                    {currentPage < totalPages - 2 && totalPages > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last page (if more than 1 page) */}
                    {totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                          isActive={currentPage === totalPages}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                        className={
                          currentPage >= totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </GridBackground>
  );
};

export default Leaderboard;
