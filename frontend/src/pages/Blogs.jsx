import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/backgrounds/GridBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Clock, User, FileText, ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Blog data array
  const blogs = [
    {
      id: "blog1",
      title:
        "The Complete Guide to Getting Started with Data Structures & Algorithms",
      description:
        "Breaking down DSA into digestible steps that actually make sense.",
      category: "DSA Guide",
      image: "/dsa.jpg", 
      author: {
        name: "Romeiro Fernandes",
        avatar: "/romeiro.jpg",
      },
      date: "Dec 15, 2024",
      readTime: "10",
      views: "0",
      tags: ["DSA", "Beginner Friendly", "Programming"],
      route: "/blogs/getting-started-with-dsa", // Route to navigate to Blog1
    },
    {
      id: "blog2",
      title: "Life as an IT / CS Student in 2026",
      description:
        "Shubham Yadav shares a student’s perspective on AI, the changing tech industry, and building practical skills alongside DSA.",
      category: "Career & AI",
      image: "/it-student-2026.png",
      author: {
        name: "Shubham Yadav",
        avatar: "/subham.jpeg",
      },
      date: "Jul 12, 2026",
      readTime: "3",
      views: "0",
      tags: ["Computer Science", "AI", "Career Growth"],
      externalUrl:
        "https://www.linkedin.com/pulse/life-cs-student-2026-shubham-yadav-b8tvf",
    },
  ];

  // Function to track blog views
  const trackBlogView = (blogId, blogTitle) => {
    // Vercel Analytics event tracking
    if (typeof window !== "undefined" && window.va) {
      window.va("track", "Blog View", {
        blog_id: blogId,
        blog_title: blogTitle,
      });
    }

    // You can also store view counts in localStorage or send to your backend
    const viewKey = `blog_view_${blogId}`;
    const currentViews = localStorage.getItem(viewKey) || "0";
    const newViews = parseInt(currentViews) + 1;
    localStorage.setItem(viewKey, newViews.toString());
  };

  // Function to get view count from localStorage
  const getViewCount = (blogId, defaultViews) => {
    if (typeof window !== "undefined") {
      const viewKey = `blog_view_${blogId}`;
      const storedViews = localStorage.getItem(viewKey);
      if (storedViews) {
        const views = parseInt(storedViews);
        if (views > 1000) {
          return `${(views / 1000).toFixed(1)}k`;
        }
        return views.toString();
      }
    }
    return defaultViews;
  };

  const handleBlogClick = (blog) => {
    trackBlogView(blog.id, blog.title);
    if (blog.externalUrl) {
      window.open(blog.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(blog.route);
  };

  const BlogCard = ({ blog }) => (
    <Card
      className="blog-card group w-full overflow-hidden rounded-2xl border-border/70 bg-card/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-2xl"
      onClick={() => handleBlogClick(blog)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleBlogClick(blog);
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`${blog.title}${blog.externalUrl ? " (opens on LinkedIn in a new tab)" : ""}`}
    >
      <CardContent className="p-0">
        <div className="flex h-full flex-col">
          {/* Blog Image */}
          <div
            className={`blog-cover w-full flex-shrink-0 overflow-hidden bg-muted/40 ${
              blog.id === "blog2" ? "aspect-video" : "h-52"
            }`}
          >
            <img
              src={blog?.image || "/api/placeholder/320/200"}
              alt={blog?.title || "Blog post"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Blog Content */}
          <div className="flex flex-1 flex-col justify-between p-6">
            <div className="space-y-3">
              {/* Category Badge */}
              <Badge
                variant="secondary"
                className="w-fit text-xs font-medium text-muted-foreground dark:text-muted-foreground"
              >
                {blog?.category || "Technology"}
              </Badge>

              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground dark:text-foreground group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {blog?.title || "Sample Blog Title"}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground dark:text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {blog?.description ||
                  "This is a sample blog description that will be replaced with actual content. It provides a brief overview of what the blog post is about."}
              </p>
              {blog.externalUrl && (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read on LinkedIn
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border dark:border-border/50">
              {/* Author */}
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={blog?.author?.avatar} />
                  <AvatarFallback className="text-xs bg-muted dark:bg-muted/30">
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground dark:text-muted-foreground font-medium">
                  {blog?.author?.name || "John Doe"}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{getViewCount(blog?.id, blog?.views) || "1.2k"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{blog?.readTime || "5"} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      blog.author.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <GridBackground className="codestorm-page min-h-screen">
      <div className="container mx-auto px-4 py-10 sm:py-16">
          <div className="mx-auto max-w-6xl space-y-10">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="rounded-full border-border/70 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back home
              </Button>
            </motion.div>
          {/* Header Section */}
          <div className="space-y-5 border-b border-border/60 pb-8 text-center sm:pb-10">
            <p className="page-eyebrow">CodeStorm journal · Ideas in motion</p>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              Notes from the{" "}
              <span className="bg-gradient-to-r from-primary via-orange-300 to-primary/80 bg-clip-text text-transparent">
                curious.
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Practical ideas on algorithms, careers, and the craft of building
              things with code.
            </p>
          </div>

          {/* Custom Search Bar */}
          <div className="relative mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border/70 bg-card/70 py-4 pl-12 pr-5 text-foreground shadow-lg shadow-black/10 outline-none transition placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Search Results Info */}
          {debouncedQuery && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                {filteredBlogs.length > 0
                  ? `Found ${filteredBlogs.length} result${
                      filteredBlogs.length !== 1 ? "s" : ""
                    } for "${debouncedQuery}"`
                  : `No results found for "${debouncedQuery}"`}
              </p>
            </div>
          )}

          {/* Blog Cards Container */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Show message when no blogs */}
            {filteredBlogs.length === 0 && !debouncedQuery && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted dark:bg-muted/30 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground dark:text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">
                  No blogs yet
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  Blog posts will appear here once they are added.
                </p>
              </div>
            )}

            {/* No search results */}
            {filteredBlogs.length === 0 && debouncedQuery && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted dark:bg-muted/30 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground dark:text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-muted-foreground dark:text-muted-foreground">
                  Try adjusting your search terms or browse all articles.
                </p>
              </div>
            )}

            {/* Blog Cards - Each blog takes full width */}
            {filteredBlogs.map((blog, index) => (
              <BlogCard key={blog.id || index} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </GridBackground>
  );
};

export default Blogs;
