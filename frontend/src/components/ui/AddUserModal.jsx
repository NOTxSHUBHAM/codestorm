import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Plus, Mail, Sparkles } from "lucide-react";
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

const BRANCHES = [
  "FE CA", "FE CB", "FE CC", "FE CSE A", "FE CSE B", "FE CSE C",
  "FE MECH", "FE ECS",
  "SE CA", "SE CB", "SE CC", "SE CSE", "SE ECS", "SE MECH",
  "TE CA", "TE CB", "TE ECS", "TE AIDS", "TE MECH",
  "BE CA", "BE CB", "BE ECS", "BE AIDS", "BE MECH",
];

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [username, setUsername] = useState("");
  const [branch, setBranch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close on Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isLoading, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !branch) return;
    setIsLoading(true);
    try {
      await onAddUser({ username: username.trim(), branch });
      setUsername("");
      setBranch("");
      onClose();
    } catch (error) {
      // handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setUsername("");
      setBranch("");
      onClose();
    }
  };

  const disabled = !username.trim() || !branch || isLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card/85 backdrop-blur-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ambient glow */}
            <div className="pointer-events-none absolute -top-32 left-1/2 h-[300px] w-[400px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
            {/* top sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-xl bg-primary/40 blur-md" />
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground tracking-tight">
                      Add User
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Add a member to the leaderboard
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={handleClose}
                  disabled={isLoading}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="username"
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    LeetCode Username
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. leetcode_user"
                      className="pl-10 h-11 rounded-xl bg-background/60 border-border/60 focus-visible:ring-primary/50 transition-all"
                      disabled={isLoading}
                      required
                      autoFocus
                    />
                  </div>
                </motion.div>

                {/* Branch */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="branch"
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Branch
                  </Label>
                  <Select
                    value={branch}
                    onValueChange={setBranch}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="branch"
                      className="w-full h-11 rounded-xl bg-background/60 border-border/60 focus:ring-primary/50 transition-all"
                    >
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 rounded-xl">
                      {BRANCHES.map((b) => (
                        <SelectItem key={b} value={b} className="rounded-lg">
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Help card */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="relative rounded-xl border border-primary/20 bg-primary/5 p-4 overflow-hidden"
                >
                  <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                  <div className="relative flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground mb-1">
                        Need Help?
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        For username updates, deletions, or any issues, reach us at{" "}
                        <a
                          href="mailto:codestorm.crce@gmail.com"
                          className="text-primary font-medium hover:underline"
                        >
                          codestorm.crce@gmail.com
                        </a>{" "}
                        or contact any CodeStorm council member.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-3 pt-1"
                >
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 h-11 rounded-xl border border-border/60 bg-background/60 hover:bg-muted/60"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={disabled}
                    className="group relative flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none overflow-hidden"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add User
                      </span>
                    )}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddUserModal;