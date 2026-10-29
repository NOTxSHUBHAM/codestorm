import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Headphones, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="codestorm-page dark relative min-h-screen px-4 py-10 text-foreground sm:py-14">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border/60 pb-8 pt-8 text-center sm:pb-10"
        >
          <p className="page-eyebrow mb-4">CodeStorm challenge · Round 01</p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Ready to <span className="text-primary">think?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Take a moment to review the rules. When you start, your ten-minute
            challenge begins.
          </p>
        </motion.div>

        {/* Rules Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2"
        >
          {/* Duration Card */}
          <motion.div variants={itemVariants} className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Time limit</h2>
            </div>
            <p className="mb-3 text-4xl font-bold tracking-tight text-primary">10 min</p>
            <ul className="ml-1 list-inside list-disc space-y-2 text-sm text-muted-foreground marker:text-primary">
              <li className="font-medium text-foreground">10 questions total</li>
              <li className="mt-2 flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                The timer is strict and cannot be paused
              </li>
            </ul>
          </motion.div>

          {/* Monitoring & Fair Play Card */}
          <motion.div variants={itemVariants} className="surface-card md:col-span-2 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <ShieldAlert className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Fair play, always</h2>
                <p className="text-sm text-muted-foreground">Keep the challenge fair for everyone.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
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
          <motion.div variants={itemVariants} className="surface-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-primary/10 p-3">
                <Headphones className="h-6 w-6 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Need a hand?</h2>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              For any technical issues, contact the organizing team immediately.
            </p>
          </motion.div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="surface-card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:p-7 sm:text-left"
        >
          <div>
            <p className="font-semibold text-foreground">All set?</p>
            <p className="mt-1 text-sm text-muted-foreground">Your timer starts as soon as the quiz opens.</p>
          </div>
          <Button
            onClick={() => navigate("/round-1/branch-selection")}
            className="h-12 w-full rounded-full bg-primary px-8 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
          >
            Proceed to quiz
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ContestRules;