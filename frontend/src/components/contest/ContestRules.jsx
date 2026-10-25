import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Headphones, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

const ContestRules = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Quiz
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Presented by CodeStorm
          </p>
        </motion.div>

        {/* Rules Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Duration Card */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-orange-500">Duration</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground ml-11 list-disc marker:text-orange-500">
              <li className="font-semibold text-foreground">10 Minutes Total</li>
              <li className="flex items-center gap-2 text-sm mt-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                The timer is strict and cannot be paused.
              </li>
            </ul>
          </motion.div>

          {/* Monitoring & Fair Play Card */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <ShieldAlert className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-orange-500">Monitoring & Fair Play</h2>
            </div>

            <div className="space-y-6 ml-11">
              {/* Tab Switching */}
              <div>
                <h3 className="font-semibold mb-2">No Tab Switching:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-500">⚠️</span>
                    First switch → <span className="font-semibold text-foreground">Warning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">❌</span>
                    Second switch → <span className="font-semibold text-red-500">Immediate Disqualification</span>
                  </li>
                </ul>
              </div>

              {/* Academic Integrity */}
              <div>
                <h3 className="font-semibold mb-2">Academic Integrity:</h3>
                <p className="text-sm text-muted-foreground">
                  Cheating, plagiarism, or unauthorized collaboration is strictly prohibited. Your session is being monitored.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Technical Support Card */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Headphones className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-orange-500">Technical Support</h2>
            </div>
            <p className="ml-11 text-sm text-muted-foreground">
              For any technical issues, contact the organizing team immediately.
            </p>
          </motion.div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <Button
            onClick={() => navigate("/round-1/branch-selection")}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg shadow-orange-500/20"
          >
            Proceed to quiz
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ContestRules;