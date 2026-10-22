import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GridBackground } from "@/components/backgrounds/GridBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Search,
  Lock,
  ArrowLeft,
  UserPlus,
  RefreshCw,
  Calendar,
  TrendingUp,
  Award,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import WORKER_URL from "@/lib/worker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const UserAdding = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newUserBranch, setNewUserBranch] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [updatingUsers, setUpdatingUsers] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userAdminToken");
    if (token === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (!users) {
      setFilteredUsers([]);
      return;
    }

    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
      const username = user.username.toLowerCase();
      const realName = (user.real_name || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      return username.includes(query) || realName.includes(query);
    });

    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem("userAdminToken", password);
      setIsAuthenticated(true);
      fetchUsers();
      toast.success("Access granted!");
    } else {
      toast.error("Invalid password!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userAdminToken");
    setIsAuthenticated(false);
    setUsers([]);
    setFilteredUsers([]);
    toast.info("Logged out successfully!");
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${WORKER_URL}/users`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUsername.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (!newUserBranch) {
      toast.error("Please select a branch");
      return;
    }

    try {
      setAddingUser(true);
      const response = await fetch(`${WORKER_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          branch: newUserBranch,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add user");
      }

      toast.success("User added successfully!");
      setNewUsername("");
      setNewUserBranch("");
      await fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error.message || "Failed to add user");
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      const response = await fetch(`${WORKER_URL}/users/${username}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success("User deleted successfully!");
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleUpdateAllUsers = async () => {
    try {
      setUpdatingUsers(true);
      toast.info("Triggering manual update...");

      setTimeout(async () => {
        await fetchUsers();
        toast.success("User data refreshed!");
      }, 2000);
    } catch (error) {
      console.error("Error updating users:", error);
      toast.error("Failed to trigger update");
    } finally {
      setUpdatingUsers(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid date";
    }
  };

  if (!isAuthenticated) {
    return (
      <GridBackground className="min-h-screen" maskIntensity="0.1%">
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-md border-border">
            <div className="text-center mb-6">
              <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                User Management
              </h2>
              <p className="text-muted-foreground">
                Enter password to access user management
              </p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <Button onClick={handleLogin} className="w-full">
                Access User Management
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </GridBackground>
    );
  }

  return (
    <GridBackground className="min-h-screen" maskIntensity="0.1%">
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl text-foreground">
          {/* Header */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  User Management
                </h1>
                <p className="text-muted-foreground">
                  Manage LeetCode users in the leaderboard
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-4 bg-card/80 backdrop-blur-md border-border">
              <div className="flex items-center gap-3">
                <UserPlus className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {users.length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/80 backdrop-blur-md border-border">
              <div className="flex items-center gap-3">
                <Search className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Filtered Results
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {filteredUsers.length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card/80 backdrop-blur-md border-border">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium text-white">
                    {users.length > 0 ? "Active" : "No data"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="space-y-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Add User */}
            <Card className="p-4 bg-card/80 backdrop-blur-md border-border">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New User
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter LeetCode username"
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleAddUser()}
                />
                <Select value={newUserBranch} onValueChange={setNewUserBranch}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddUser}
                  disabled={addingUser || !newUsername.trim() || !newUserBranch}
                  className="sm:w-auto"
                >
                  {addingUser ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>

            {/* Search & Actions */}
            <Card className="p-4 bg-card/80 backdrop-blur-md border-border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Search Users
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by username or name..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                  <Button
                    onClick={handleUpdateAllUsers}
                    disabled={updatingUsers}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {updatingUsers ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update All
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Users List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden bg-card/80 backdrop-blur-md border-border hover:border-primary/30 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div>
                                <h3 className="font-semibold text-white text-lg">
                                  {user.real_name || user.username}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  @{user.username}
                                </p>
                                {user.branch && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {user.branch}
                                    </Badge>
                                    {user.year && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {user.year}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Added: {formatDate(user.added_at)}
                              </div>
                              {user.updated_at && (
                                <div className="flex items-center gap-1">
                                  <Activity className="w-4 h-4" />
                                  Updated: {formatDate(user.updated_at)}
                                </div>
                              )}
                              {user.ranking > 0 && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Award className="w-4 h-4" />
                                  LeetCode Rank: {user.ranking.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Stats - Desktop */}
                          <div className="hidden lg:flex items-center gap-6">
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">
                                {user.total_solved || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Total
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-green-400">
                                {user.easy_solved || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Easy
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-yellow-400">
                                {user.medium_solved || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Medium
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-red-400">
                                {user.hard_solved || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Hard
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex-shrink-0"
                            >
                              <a
                                href={`https://leetcode.com/${user.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <TrendingUp className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                  Profile
                                </span>
                              </a>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setUserToDelete(user);
                                setDeleteDialogOpen(true);
                              }}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Mobile Stats */}
                        <div className="lg:hidden mt-4 pt-4 border-t border-border/50">
                          <div className="grid grid-cols-4 gap-3 text-center">
                            <div>
                              <div className="text-base font-bold text-white">
                                {user.total_solved || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Total
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-green-400">
                                {user.easy_solved || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Easy
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-yellow-400">
                                {user.medium_solved || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Medium
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-red-400">
                                {user.hard_solved || 0}
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
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">
                {searchQuery
                  ? `No users found matching "${searchQuery}"`
                  : "No users found"}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try a different search term!"
                  : "Add some users to get started!"}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-background text-foreground cd fronborder-border">
          <DialogHeader>
            <DialogTitle className="text-white">Delete User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                @{userToDelete?.username}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteDialogOpen(false);
                setUserToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete.username);
                  setDeleteDialogOpen(false);
                  setUserToDelete(null);
                }
              }}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GridBackground>
  );
};

export default UserAdding;
