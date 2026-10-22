import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

// Existing pages
import Landing from "./pages/Landing";
import Blog1 from "./components/blogs/Blog1";
import UserAdding from "./pages/UserAdding";
import Leaderboard from "./pages/Leaderboard";
import Blogs from "./pages/Blogs";
import ContestRules from "./components/contest/ContestRules";
import Round1Admin from "./pages/Round1Admin";
import Round1SEAdmin from "./pages/Round1SEAdmin";

// New / Improved pages
import Round1BranchSelection from "./pages/Round1BranchSelection";
import Round1Contest from "./pages/Round1Contest";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Analytics />
      <Routes>
        {/* Landing & general */}
        <Route path="/" element={<Landing />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/getting-started-with-dsa" element={<Blog1 />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/nigga" element={<UserAdding />} />

        {/* Round 1 Contest Routes */}
        <Route path="/round-1" element={<ContestRules />} />
        <Route path="/round-1/branch-selection" element={<Round1BranchSelection />} />
        <Route path="/round-1/contest" element={<Round1Contest />} />
        <Route path="/round-1/admin" element={<Round1Admin />} />
        <Route path="/round-1/se-admin" element={<Round1SEAdmin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;