import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { GridBackground } from "@/components/backgrounds/GridBackground";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import mermaid from "mermaid";

const Blog1 = () => {
  const navigate = useNavigate();
  const mermaidRef = useRef(null);

  // Reading progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.3,
  });

  useEffect(() => {
    const renderMermaid = async () => {
      if (mermaidRef.current) {
        try {
          mermaidRef.current.innerHTML = "";
          mermaid.initialize({
            startOnLoad: false,
            theme: "dark",
            themeVariables: {
              primaryColor: "#f97316",
              primaryTextColor: "#ffffff",
              primaryBorderColor: "#ea580c",
              lineColor: "#6b7280",
              sectionBkgColor: "#1f2937",
              altSectionBkgColor: "#374151",
              gridColor: "#4b5563",
              secondaryColor: "#e5e7eb",
              tertiaryColor: "#f3f4f6",
            },
          });

          const graphDefinition = `
            graph TD
              A["Arrays & Strings"] --> B["Linked Lists"]
              B --> C["Stacks & Queues"]
              C --> D["Trees"]
              D --> E["Binary Search Trees"]
              E --> F["Heaps"]
              F --> G["Hash Tables"]
              G --> H["Graphs"]
              H --> I["Advanced Topics"]

              style A fill:#f97316,stroke:#ea580c,stroke-width:2px,color:#ffffff
              style I fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#ffffff
              style B fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#ffffff
              style C fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#ffffff
              style D fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#ffffff
              style E fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#ffffff
              style F fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#ffffff
              style G fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#ffffff
              style H fill:#1f2937,stroke:#6b7280,stroke-width:1px,color:#ffffff
          `;

          const { svg } = await mermaid.render(
            "dsaFlowchart-" + Date.now(),
            graphDefinition
          );
          mermaidRef.current.innerHTML = svg;
        } catch (error) {
          console.error("Error rendering Mermaid diagram:", error);
          mermaidRef.current.innerHTML =
            '<p class="text-muted-foreground">Diagram could not be rendered</p>';
        }
      }
    };

    renderMermaid();
  }, []);

  return (
    <GridBackground className="min-h-screen bg-background dark:bg-background">
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary"
      />

      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[8%] h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute right-[5%] top-[40%] h-[300px] w-[300px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute left-[5%] bottom-[10%] h-[280px] w-[280px] rounded-full bg-primary/10 blur-[110px]" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto bg-card/70 backdrop-blur-xl border border-border/60 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* top sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          {/* ---------- Blog Header ---------- */}
          <div className="relative p-6 sm:p-8 md:p-10 border-b border-border/50">
            {/* Back button */}
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Button
                variant="secondary"
                onClick={() => navigate("/blogs")}
                className="group rounded-full h-9 px-3 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="ml-1 text-xs font-medium">All blogs</span>
              </Button>
            </motion.div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20"
              >
                DSA Guide
              </Badge>
              <Badge variant="outline" className="text-xs border-border/60">
                Beginner Friendly
              </Badge>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight"
            >
              The Complete Guide to Getting Started with{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Data Structures &amp; Algorithms
              </span>
            </motion.h1>

            {/* Author + meta */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/40">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-primary/30 blur-md" />
                  <Avatar className="relative h-12 w-12 ring-2 ring-primary/40">
                    <AvatarImage src="/romeiro.jpg" alt="Romeiro Fernandes" />
                    <AvatarFallback>RF</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    Romeiro Fernandes
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ex Codestorm Tech lead CRCE
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary/70" />
                  <span>Jul 23, 2025</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary/70" />
                  <span>10 min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Blog Content ---------- */}
          <div className="p-6 sm:p-8 md:p-10 prose prose-invert max-w-none">
            {/* Introduction */}
            <section className="mb-10">
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Let's be honest—DSA feels overwhelming when you're starting out.
                But here's the thing:
                <strong className="text-foreground">
                  {" "}
                  it doesn't have to be
                </strong>
                . After mentoring dozens of students and seeing what actually
                works, I've broken it down into a simple three-step process
                that anyone can follow.
              </p>
            </section>

            {/* Three-step framework */}
            <section className="relative mb-10 rounded-2xl border border-border/60 bg-muted/20 p-6 sm:p-8 overflow-hidden">
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

              <h2 className="relative text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ChevronRight className="h-6 w-6 text-primary" />
                The Three-Step DSA Framework
              </h2>

              <div className="relative grid md:grid-cols-3 gap-4">
                {[
                  { letter: "A", title: "Learn a Language", sub: "Pick your weapon" },
                  { letter: "B", title: "Master Data Structures", sub: "Build your toolkit" },
                  { letter: "C", title: "Apply in Algorithms", sub: "Solve real problems" },
                ].map((step, i) => (
                  <motion.div
                    key={step.letter}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="group relative bg-card/60 border border-border/60 hover:border-primary/50 rounded-xl p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="text-3xl font-black bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-transparent mb-2">
                      {step.letter}
                    </div>
                    <div className="font-semibold text-foreground text-sm">
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.sub}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Step A */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Step A: Choosing Your Programming Language
              </h2>

              <blockquote className="relative border-l-4 border-primary pl-5 italic text-muted-foreground bg-primary/5 p-5 rounded-r-xl mb-6">
                "What language should I pick?" -{" "}
                <em className="text-foreground/80">
                  The most asked question I get.
                </em>
              </blockquote>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                <strong className="text-foreground">Short answer:</strong> It
                depends.{" "}
                <strong className="text-foreground">Long answer:</strong> You
                have three solid options, each with their own superpowers.
              </p>

              <div className="space-y-4">
                {[
                  {
                    color: "bg-blue-500",
                    title: "C/C++",
                    sub: "The Powerhouse",
                    best: "Competitive Programming, System-level understanding, Long-term investment (1+ year timeline)",
                    body: "C++ gives you the keys to the kingdom—complete control over memory and system resources. The learning curve is steep, but the payoff is enormous. Almost every modern language borrows concepts from C++.",
                  },
                  {
                    color: "bg-orange-500",
                    title: "Java",
                    sub: "The Sweet Spot",
                    best: "Service-based companies, Enterprise development, Balanced learning curve",
                    body: "Java sits comfortably between power and simplicity. Most Asian service companies love Java, making it a smart career choice. Less intimidating than C++ but still teaches solid programming fundamentals.",
                  },
                  {
                    color: "bg-green-500",
                    title: "Python",
                    sub: "The Speed Demon",
                    best: "Quick job placement, Rapid prototyping, Short deadlines",
                    body: "Python runs the modern IT world. If you need a job ASAP and have a tight timeline, this is your best bet. Less verbose, fewer concepts, faster to master.",
                  },
                ].map((lang, i) => (
                  <motion.div
                    key={lang.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative bg-card/40 border border-border/60 hover:border-primary/40 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-3">
                      <span className={`w-3 h-3 ${lang.color} rounded-full shadow-md`} />
                      {lang.title} - <em className="text-muted-foreground">{lang.sub}</em>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong className="text-foreground">Best for:</strong>{" "}
                      {lang.best}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {lang.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Learning Resources */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Learning Resources by Language
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { lang: "C++", items: ["Harvard's CS50 (first 2 lectures)", "W3Schools comprehensive guide", "LearnCPP.com (my personal favorite)"] },
                  { lang: "Java", items: ["Derek Banas (YouTube)", "Tim Buchalka's Java Masterclass", "Coding With John"] },
                  { lang: "Python", items: ["Corey Schafer (YouTube)", "W3Schools Python guide", "Official Python Tutorial"] },
                ].map((r, i) => (
                  <motion.div
                    key={r.lang}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="bg-muted/20 border border-border/50 rounded-xl p-5 hover:border-primary/40 transition-colors"
                  >
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {r.lang}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {r.items.map((it) => (
                        <li key={it}>• {it}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Fundamentals Checklist */}
            <section className="relative mb-12 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:p-8 overflow-hidden">
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
              <h3 className="relative text-lg font-semibold text-foreground mb-5">
                Language Fundamentals Checklist
              </h3>
              <div className="relative grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    The Basics
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    {["Variables & Data Types", "Conditional Statements (if-else)", "Loops (for, while)", "Functions/Methods"].map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className="text-primary">✓</span> {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Object-Oriented Programming
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    {["Classes & Objects", "Methods & Attributes", "Inheritance", "Encapsulation"].map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className="text-primary">✓</span> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Step B */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Step B: Master Data Structures
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Think of data structures as your toolkit. Each one serves a
                specific purpose, and knowing when to use which tool is what
                separates good programmers from great ones.
              </p>

              <div className="relative rounded-2xl border border-border/60 bg-muted/10 p-4 sm:p-6 mb-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  DSA Learning Path
                </h3>
                <div
                  ref={mermaidRef}
                  className="flex justify-center items-center min-h-[300px] bg-gray-900/50 rounded-xl p-4 overflow-x-auto ring-1 ring-white/5"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border/60 bg-card/40 p-5">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Essential Data Structures
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong className="text-foreground">Arrays & Strings</strong> - Your foundation</li>
                    <li>• <strong className="text-foreground">Linked Lists</strong> - Dynamic memory magic</li>
                    <li>• <strong className="text-foreground">Stacks & Queues</strong> - LIFO/FIFO operations</li>
                    <li>• <strong className="text-foreground">Trees</strong> - Hierarchical thinking</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/40 p-5">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Advanced Structures
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong className="text-foreground">Binary Search Trees</strong> - Efficient searching</li>
                    <li>• <strong className="text-foreground">Heaps</strong> - Priority management</li>
                    <li>• <strong className="text-foreground">Hash Tables</strong> - O(1) lookups</li>
                    <li>• <strong className="text-foreground">Graphs</strong> - Real-world modeling</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Step C */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Step C: Apply in Algorithms
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                This is where the magic happens. You'll learn to combine your
                data structures with algorithmic thinking to solve complex
                problems efficiently.
              </p>

              <div className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-5">
                  My Problem-Solving Framework
                </h3>

                <div className="space-y-5">
                  {[
                    { n: 1, t: "Understand Completely", d: "Read the problem 2-3 times. Don't rush." },
                    { n: 2, t: "Use Pen & Paper", d: "Trace through examples manually. Find patterns." },
                    { n: 3, t: "Identify the Category", d: "Is this a graph problem? Dynamic programming? Two pointers?" },
                    { n: 4, t: "Start with Brute Force", d: "Get a working solution first, optimize later." },
                  ].map((s, i) => (
                    <motion.div
                      key={s.n}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex gap-4"
                    >
                      <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-primary/30">
                        {s.n}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{s.t}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{s.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* 20-Minute Rule */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                The 20-Minute Rule
              </h2>

              <div className="rounded-2xl bg-muted/20 border border-border/60 p-6 sm:p-8">
                <p className="text-muted-foreground mb-5 leading-relaxed">
                  Here's my secret sauce:{" "}
                  <strong className="text-foreground">
                    Set a 20-minute timer for every problem.
                  </strong>{" "}
                  If you solve it—great! If not—equally great! Read the solution
                  and learn new approaches.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Daily Practice Goals
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li>• 2 problems minimum per day</li>
                      <li>• Start with Easy → Medium → Hard</li>
                      <li>• Focus on understanding over speed</li>
                      <li>• Review your solutions weekly</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      Recommended Platforms
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li>• <strong className="text-foreground">LeetCode</strong> - Interview preparation</li>
                      <li>• <strong className="text-foreground">HackerRank</strong> - Skill building</li>
                      <li>• <strong className="text-foreground">Codeforces</strong> - Competitive programming</li>
                      <li>• <strong className="text-foreground">GeeksforGeeks</strong> - Concept clarity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Must-Know Algorithms */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Must-Know Algorithm Categories
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {[
                    { t: "Searching & Sorting", d: "Binary Search, Merge Sort, Quick Sort" },
                    { t: "Two Pointers", d: "Array problems, palindromes, pair finding" },
                    { t: "Sliding Window", d: "Substring problems, array subarrays" },
                    { t: "Recursion & Backtracking", d: "Tree traversal, permutations, combinations" },
                  ].map((a) => (
                    <div
                      key={a.t}
                      className="rounded-xl border border-border/60 bg-card/40 p-4 hover:border-primary/40 transition-colors"
                    >
                      <h4 className="font-semibold text-foreground mb-1">{a.t}</h4>
                      <p className="text-sm text-muted-foreground">{a.d}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    { t: "Dynamic Programming", d: "Optimization problems, interview favorites", critical: true },
                    { t: "Graph Algorithms", d: "BFS, DFS, shortest paths, connectivity", critical: true },
                    { t: "Greedy Algorithms", d: "Optimization, activity selection" },
                    { t: "Bit Manipulation", d: "Efficient operations, space optimization" },
                  ].map((a) => (
                    <div
                      key={a.t}
                      className={`rounded-xl border p-4 transition-colors ${
                        a.critical
                          ? "border-red-500/40 bg-red-500/5 hover:border-red-500/60"
                          : "border-border/60 bg-card/40 hover:border-primary/40"
                      }`}
                    >
                      <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        {a.t}
                        {a.critical && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 rounded">
                            Critical
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{a.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Pro Tips */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Pro Tips from the Trenches
              </h2>

              <div className="space-y-4">
                {[
                  { color: "green", title: "Mindset Shift", body: <><strong>Errors are the rule, perfect code is the exception.</strong> Embrace the debugging process. Every "failed" attempt teaches you something valuable.</> },
                  { color: "blue", title: "Code First, Perfect Later", body: <>A messy solution is infinitely better than a blank page. Write it down, then refine. <em>Paper and pen are your best friends.</em></> },
                  { color: "purple", title: "Consistency Beats Intensity", body: <><strong>The better programmer keeps going one more time than the person before them.</strong> Daily practice trumps weekend marathons every single time.</> },
                ].map((tip, i) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`rounded-xl p-5 border ${
                      tip.color === "green"
                        ? "bg-green-500/10 border-green-500/25"
                        : tip.color === "blue"
                        ? "bg-blue-500/10 border-blue-500/25"
                        : "bg-purple-500/10 border-purple-500/25"
                    }`}
                  >
                    <h4 className={`font-semibold mb-2 ${
                      tip.color === "green"
                        ? "text-green-400"
                        : tip.color === "blue"
                        ? "text-blue-400"
                        : "text-purple-400"
                    }`}>
                      {tip.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Realistic Timeline Expectations
              </h2>

              <div className="rounded-2xl border border-border/60 bg-card/30 p-6 sm:p-8">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-accent" />

                  <div className="space-y-8">
                    {[
                      { months: "3M", title: "Months 1-3: Foundation Building", body: "Master your chosen language and basic data structures", items: ["Complete language fundamentals", "Arrays, Strings, and Linked Lists mastery", "Solve 50-100 easy problems"], intensity: "bg-primary/20", border: "border-primary/30", bg: "bg-primary/5" },
                      { months: "6M", title: "Months 4-6: Intermediate Structures", body: "Dive into trees, graphs, and basic dynamic programming", items: ["Trees and Binary Search Trees", "Introduction to Graphs (BFS, DFS)", "Basic DP problems", "200-300 problems solved total"], intensity: "bg-primary/40", border: "border-primary/40", bg: "bg-primary/10" },
                      { months: "9M", title: "Months 7-9: Interview Ready", body: "Advanced algorithms and interview preparation", items: ["Advanced DP and Graph algorithms", "System design basics", "Mock interviews and coding challenges", "500+ problems solved total"], intensity: "bg-primary/60", border: "border-green-500/40", bg: "bg-green-500/10" },
                    ].map((phase, i) => (
                      <motion.div
                        key={phase.months}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex items-start gap-6"
                      >
                        <div className="relative shrink-0">
                          <div className={`w-12 h-12 ${phase.intensity} rounded-full flex items-center justify-center border-4 border-primary shadow-lg shadow-primary/20`}>
                            <span className="font-bold text-primary text-xs">{phase.months}</span>
                          </div>
                        </div>
                        <div className={`flex-1 rounded-xl border ${phase.border} ${phase.bg} p-5`}>
                          <h4 className="font-semibold text-foreground mb-2">{phase.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{phase.body}</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {phase.items.map((it) => (
                              <li key={it}>• {it}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-4">
              <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-8 text-center overflow-hidden">
                <div className="pointer-events-none absolute -top-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
                <h2 className="relative text-2xl font-bold text-foreground mb-4">
                  Remember This
                </h2>
                <blockquote className="relative text-lg text-muted-foreground italic leading-relaxed">
                  "Even the greatest programmer today once didn't know how to
                  declare a variable."
                </blockquote>
                <p className="relative text-muted-foreground mt-4">
                  <strong className="text-foreground">
                    Your journey starts with a single step.
                  </strong>{" "}
                  The most important thing?{" "}
                  <em>Start today, stay consistent, and trust the process.</em>
                </p>
                <p className="relative text-foreground font-semibold mt-4">
                  Good luck, and remember—CodeStorm is here to support you every
                  step of the way! 🚀
                </p>
              </div>
            </section>
          </div>
        </motion.article>
      </div>
    </GridBackground>
  );
};

export default Blog1;