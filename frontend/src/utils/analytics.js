// Vercel Analytics helper functions
export const trackBlogView = async (blogId, blogTitle) => {
  try {
    // Vercel Analytics event
    if (typeof window !== "undefined" && window.va) {
      window.va("track", "Blog View", {
        blog_id: blogId,
        blog_title: blogTitle,
        timestamp: new Date().toISOString(),
      });
    }

    // You can also send to your own API endpoint for more detailed tracking
    // await fetch('/api/track-view', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ blogId, blogTitle, timestamp: new Date() })
    // });
  } catch (error) {
    console.error("Error tracking blog view:", error);
  }
};

export const getViewCount = (blogId, defaultViews = "0") => {
  if (typeof window === "undefined") return defaultViews;

  const viewKey = `blog_view_${blogId}`;
  const storedViews = localStorage.getItem(viewKey) || "0";
  const views = parseInt(storedViews);

  // Format view count
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k`;
  }
  return views.toString();
};
