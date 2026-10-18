import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  UserPlus,
  UserMinus,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const db = getFirestore(app);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchApplications();
    }
  }, []);

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem("adminToken", password);
      setIsAuthenticated(true);
      fetchApplications();
      toast.success("Access granted!");
    } else {
      toast.error("Invalid password!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    toast.info("Logged out successfully!");
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "applications"));
      const apps = [];
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() });
      });
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (applicationId, isShortlisted) => {
    try {
      await updateDoc(doc(db, "applications", applicationId), {
        shortlisted: isShortlisted,
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, shortlisted: isShortlisted }
            : app
        )
      );

      toast.success(
        isShortlisted
          ? "Candidate shortlisted!"
          : "Candidate removed from shortlist!"
      );
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application");
    }
  };

  const filteredApplications = applications.filter((app) =>
    activeTab === "all" ? true : app.shortlisted === true
  );

  const getWordCount = (text) => {
    return (
      text
        ?.trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length || 0
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
            <p className="text-muted-foreground">
              Enter password to access the admin panel
            </p>
          </div>
          <div className="space-y-4 relative">
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
            <Button onClick={handleLogin} className="w-full">
              Access Admin Panel
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="default"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Admin Panel
            </h1>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="ml-auto"
          >
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="all"
          className="flex flex-col items-center justify-center mb-8"
        >
          <TabsList className="flex justify-center">
            <TabsTrigger
              value="all"
              onClick={() => setActiveTab("all")}
              className="text-[#fafafa] data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md"
            >
              All Candidates ({applications.length})
            </TabsTrigger>
            <TabsTrigger
              value="shortlisted"
              onClick={() => setActiveTab("shortlisted")}
              className="text-[#fafafa] data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md"
            >
              Shortlisted (
              {applications.filter((app) => app.shortlisted).length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {/* Render All Candidates */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {filteredApplications.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className="p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {app.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {app.email}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {app.branch}
                          </Badge>
                        </div>
                        {app.shortlisted && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Shortlisted
                          </Badge>
                        )}
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Mobile:</strong> {app.mobile}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Roles:</strong>{" "}
                          {app.selectedRoles
                            ?.map((roleId) => {
                              const roles = {
                                1: "Jr. Technical Director",
                                2: "Jr. Head of Operations",
                                3: "Jr. Design Head",
                                4: "Jr. Social Media Head",
                                5: "Jr. Web Master",
                              };
                              return roles[roleId];
                            })
                            .join(", ") || "None"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Skills:</strong>{" "}
                          {app.skills || "Not provided"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {app.shortlisted ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleShortlist(app.id, false)}
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleShortlist(app.id, true)}
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="shortlisted">
            {/* Render Shortlisted Candidates */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map((app) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className="p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {app.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {app.email}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {app.branch}
                          </Badge>
                        </div>
                        {app.shortlisted && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Shortlisted
                          </Badge>
                        )}
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Mobile:</strong> {app.mobile}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Roles:</strong>{" "}
                          {app.selectedRoles
                            ?.map((roleId) => {
                              const roles = {
                                1: "Jr. Technical Director",
                                2: "Jr. Head of Operations",
                                3: "Jr. Design Head",
                                4: "Jr. Social Media Head",
                                5: "Jr. Web Master",
                              };
                              return roles[roleId];
                            })
                            .join(", ") || "None"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Skills:</strong>{" "}
                          {app.skills || "Not provided"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(app)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {app.shortlisted ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleShortlist(app.id, false)}
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleShortlist(app.id, true)}
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Details Modal */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedApplication(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedApplication.name}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedApplication.email}
                    </p>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedApplication(null)}
                  >
                    Close
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-white mb-2">Branch</h3>
                      <p className="text-muted-foreground">
                        {selectedApplication.branch}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">Mobile</h3>
                      <p className="text-muted-foreground">
                        {selectedApplication.mobile}
                      </p>
                    </div>
                  </div>

                  {/* Selected Roles */}
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      Selected Roles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.selectedRoles?.map((roleId) => {
                        const roles = {
                          1: "Jr. Technical Director",
                          2: "Jr. Head of Operations",
                          3: "Jr. Design Head",
                          4: "Jr. Social Media Head",
                          5: "Jr. Web Master",
                        };
                        return (
                          <Badge key={roleId} variant="outline">
                            {roles[roleId]}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold text-white mb-2">Skills</h3>
                    <p className="text-muted-foreground">
                      {selectedApplication.skills || "Not provided"}
                    </p>
                  </div>

                  {/* Answers */}
                  <div>
                    <h3 className="font-semibold text-white mb-4">
                      Application Answers
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          id: 1,
                          question:
                            "Why do you want to join CodeStorm and what unique value would you bring to our community?",
                          wordLimit: 150,
                        },
                        {
                          id: 2,
                          question:
                            "List your work experience, extra-curriculars, or participations (if any).",
                          wordLimit: 300,
                        },
                        {
                          id: 3,
                          question:
                            "How do you see yourself contributing to CodeStorm's mission of changing the interview game in tech?",
                          wordLimit: 150,
                        },
                      ].map((q) => (
                        <div
                          key={q.id}
                          className="border border-border rounded-lg p-4"
                        >
                          <h4 className="font-medium text-white mb-2">
                            {q.id}. {q.question}
                          </h4>
                          <p className="text-muted-foreground mb-2">
                            {selectedApplication.answers?.[q.id] ||
                              "No answer provided"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Word count:{" "}
                            {getWordCount(selectedApplication.answers?.[q.id])}/
                            {q.wordLimit}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resume */}
                  {selectedApplication.resumeUrl && (
                    <div>
                      <h3 className="font-semibold text-white mb-2">Resume</h3>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          window.open(selectedApplication.resumeUrl, "_blank")
                        }
                      >
                        View Resume
                      </Button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    {selectedApplication.shortlisted ? (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleShortlist(selectedApplication.id, false);
                          setSelectedApplication(null);
                        }}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Remove from Shortlist
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        onClick={() => {
                          handleShortlist(selectedApplication.id, true);
                          setSelectedApplication(null);
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Shortlist Candidate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
