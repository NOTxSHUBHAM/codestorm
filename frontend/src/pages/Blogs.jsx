import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GridBackground } from "@/components/backgrounds/GridBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Clock, User, FileText, ArrowLeft } from "lucide-react";
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
    navigate(blog.route);
  };

  const BlogCard = ({ blog }) => (
    <Card
      className="group w-full bg-card dark:bg-card/80 backdrop-blur-md border-border dark:border-border hover:bg-card dark:hover:bg-card/90 transition-all duration-300 hover:shadow-lg hover:border-primary dark:hover:border-primary overflow-hidden cursor-pointer"
      onClick={() => handleBlogClick(blog)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Blog Image */}
          <div className="sm:w-80 w-full h-48 sm:h-auto bg-muted dark:bg-muted/20 flex-shrink-0 overflow-hidden sm:ml-4 sm:rounded-lg">
            <img
              src={blog?.image || "/api/placeholder/320/200"}
              alt={blog?.title || "Blog post"}
              className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-300 sm:rounded-lg"
            />
          </div>

          {/* Blog Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
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
    <GridBackground className="min-h-screen bg-background dark:bg-background">
      <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
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
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground dark:text-foreground">
              Discover Amazing{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            <p className="text-lg text-muted-foreground dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our collection of insightful articles, tutorials, and
              stories crafted by passionate writers and industry experts.
            </p>
          </div>

          {/* Custom Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-card dark:bg-card/80 text-foreground dark:text-foreground border border-border dark:border-border focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary/50"
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
          <div className="space-y-6">
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
