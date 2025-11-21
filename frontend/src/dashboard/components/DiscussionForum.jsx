import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  ThumbsUp,
  Send,
  Plus,
  Search,
  Clock,
  Loader,
} from "lucide-react";
import Sidebar from "./Sidebar";

// Import Firebase from your config file
import { db, auth } from "../../firebaseConfig"; // Update path if needed
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DiscussionForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    category: "General",
    content: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [postAsAnonymous, setPostAsAnonymous] = useState(false);
  const [likeStatuses, setLikeStatuses] = useState({});
  const [debugInfo, setDebugInfo] = useState("Initializing...");

  const categories = [
    "All",
    "Tips & Tricks",
    "Disease Control",
    "Pest Management",
    "Harvest Tips",
    "Soil & Fertilizer",
    "General",
  ];

  // Listen to authentication state
  useEffect(() => {
    setDebugInfo("Checking authentication...");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? `User: ${user.email}` : "No user");
      if (user) {
        // User is signed in, get their data from Firestore
        try {
          setDebugInfo(`Auth user found: ${user.email}`);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              uid: user.uid,
              username: userData.username || user.email,
              email: userData.email || user.email,
            });
            setDebugInfo(`User doc loaded: ${userData.username}`);
          } else {
            // User doc doesn't exist, create minimal user object
            setCurrentUser({
              uid: user.uid,
              username: user.email,
              email: user.email,
            });
            setDebugInfo(`No user doc in Firestore, using email: ${user.email}`);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setDebugInfo(`Error loading user: ${error.message}`);
          setCurrentUser({
            uid: user.uid,
            username: user.email,
            email: user.email,
          });
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setDebugInfo("No authenticated user");
      }
    });

    return () => unsubscribe();
  }, []);

  // Load all posts from all users
  useEffect(() => {
    if (currentUser) {
      loadAllPosts();
    }
  }, [currentUser]);

  const loadAllPosts = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const allPosts = [];

      console.log("Total users found:", usersSnapshot.size);

      // Loop through ALL users and collect their discussions
      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id;

        if (userData.discussions && Array.isArray(userData.discussions)) {
          console.log(`User ${userId} has ${userData.discussions.length} discussions`);
          userData.discussions.forEach((discussion) => {
            allPosts.push({
              ...discussion,
              userId: userId,
            });
          });
        }
      });

      console.log("Total posts loaded from all users:", allPosts.length);

      // Sort by timestamp (newest first)
      allPosts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setPosts(allPosts);

      // Load current user's liked posts to show which posts they've liked
      if (currentUser) {
        try {
          const currentUserRef = doc(db, "users", currentUser.uid);
          const currentUserDoc = await getDoc(currentUserRef);

          if (currentUserDoc.exists()) {
            const currentUserData = currentUserDoc.data();
            const likedPosts = currentUserData.likedPosts || {};
            setLikeStatuses(likedPosts);
            console.log("Loaded like statuses:", likedPosts);
          }
        } catch (likeError) {
          console.error("Error loading like statuses:", likeError);
        }
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      console.error("Error message:", error.message);
      setPosts([]);
      // Don't show alert, just log the error
    }
    setLoading(false);
  };

  const handleLike = async (postId, postUserId) => {
    if (!currentUser) {
      alert("Please log in to like posts!");
      return;
    }

    try {
      // Get current user's document to check their like status
      const currentUserRef = doc(db, "users", currentUser.uid);
      const currentUserDoc = await getDoc(currentUserRef);

      if (!currentUserDoc.exists()) {
        alert("User not found!");
        return;
      }

      const currentUserData = currentUserDoc.data();
      const userLikes = currentUserData.likedPosts || {};

      // Check if user has already liked this post
      const hasLiked = userLikes[postId] === true;

      // Get the post owner's document (the person who created the post)
      const postOwnerRef = doc(db, "users", postUserId);
      const postOwnerDoc = await getDoc(postOwnerRef);

      if (!postOwnerDoc.exists()) {
        alert("Post owner not found!");
        return;
      }

      const postOwnerData = postOwnerDoc.data();
      const discussions = postOwnerData.discussions || [];

      // Find and update the specific post
      const updatedDiscussions = discussions.map((discussion) => {
        if (discussion.id === postId) {
          const newLikes = hasLiked
            ? Math.max(0, (discussion.likes || 0) - 1)
            : (discussion.likes || 0) + 1;

          return {
            ...discussion,
            likes: newLikes,
          };
        }
        return discussion;
      });

      // Update the post owner's document with new like count
      await updateDoc(postOwnerRef, {
        discussions: updatedDiscussions,
      });

      // Update current user's liked posts status
      const updatedLikedPosts = { ...userLikes };
      if (hasLiked) {
        delete updatedLikedPosts[postId]; // Remove like
      } else {
        updatedLikedPosts[postId] = true; // Add like
      }

      await updateDoc(currentUserRef, {
        likedPosts: updatedLikedPosts,
      });

      // Update local state immediately (NO PAGE RELOAD)
      setLikeStatuses((prev) => ({
        ...prev,
        [postId]: !hasLiked,
      }));

      // Update the post in local state
      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p.id === postId) {
            const newLikes = hasLiked
              ? Math.max(0, (p.likes || 0) - 1)
              : (p.likes || 0) + 1;
            return { ...p, likes: newLikes };
          }
          return p;
        })
      );

      console.log(
        `Like ${hasLiked ? "removed" : "added"} for post ${postId} by ${
          currentUser.username
        }`
      );
    } catch (error) {
      console.error("Error updating like:", error);
      console.error("Error details:", error.message);
      alert(`Failed to like post: ${error.message}`);
    }
  };

  const handleDeletePost = async (postId, postUserId) => {
    // Check if current user is the owner of the post
    if (!currentUser || currentUser.uid !== postUserId) {
      alert("You can only delete your own posts!");
      return;
    }

    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this discussion?")) {
      return;
    }

    try {
      // Get the user document that owns this post
      const userDocRef = doc(db, "users", postUserId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        alert("User document not found!");
        return;
      }

      const userData = userDoc.data();
      const discussions = userData.discussions || [];

      // Filter out the post to be deleted
      const updatedDiscussions = discussions.filter(
        (discussion) => discussion.id !== postId
      );

      // Update Firestore
      await updateDoc(userDocRef, {
        discussions: updatedDiscussions,
      });

      // Update local state immediately (post disappears first)
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      // Show alert AFTER the post is removed from UI
      setTimeout(() => {
        alert("Discussion deleted successfully!");
      }, 100);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(`Failed to delete post: ${error.message}`);
    }
  };

  const handleSubmitPost = async () => {
    if (!currentUser) {
      alert("Please log in to post a discussion");
      return;
    }

    if (newPost.title.trim() && newPost.content.trim()) {
      const postId = `post_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const timestamp = Date.now();

      const authorName = postAsAnonymous
        ? "Anonymous User"
        : currentUser.username;
      const avatar = authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      const post = {
        id: postId,
        author: authorName,
        avatar: avatar,
        timestamp: timestamp,
        category: newPost.category,
        title: newPost.title,
        content: newPost.content,
        likes: 0,
        isAnonymous: postAsAnonymous,
      };

      try {
        const userDocRef = doc(db, "users", currentUser.uid);

        // First, get the current user document
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const existingDiscussions = userData.discussions || [];

          // Add new post to existing discussions
          const updatedDiscussions = [post, ...existingDiscussions];

          // Update the document with the new discussions array
          await updateDoc(userDocRef, {
            discussions: updatedDiscussions,
          });
        } else {
          // If document doesn't exist (shouldn't happen but just in case)
          await updateDoc(userDocRef, {
            discussions: [post],
          });
        }

        // Immediately add to local state for instant UI update
        setPosts([post, ...posts]);

        // Reset form
        setNewPost({ title: "", category: "General", content: "" });
        setPostAsAnonymous(false);
        setShowNewPostForm(false);

        // Show alert AFTER the post appears
        setTimeout(() => {
          alert("Discussion posted successfully!");
        }, 100);

        // Reload all posts to ensure we have the latest from all users
        setTimeout(() => {
          loadAllPosts();
        }, 500);
      } catch (error) {
        console.error("Error saving post:", error);
        alert(`Failed to save post: ${error.message}`);
      }
    } else {
      alert("Please fill in both title and description");
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!currentUser) {
    return (
      <>
        <Sidebar />
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            padding: "90px 40px 40px 40px",
            marginLeft: "250px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "60px 32px",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
              maxWidth: "500px",
            }}
          >
            <MessageCircle
              size={48}
              style={{
                color: "#4caf50",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ color: "#718096", margin: "0 0 8px 0", fontSize: "16px" }}>
              Loading discussions...
            </p>
            <p style={{ color: "#a0aec0", margin: "0 0 16px 0", fontSize: "14px" }}>
              Please wait while we authenticate you.
            </p>
            <p style={{ color: "#cbd5e0", margin: 0, fontSize: "12px", fontFamily: "monospace" }}>
              Status: {debugInfo}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: "90px 40px 40px 40px",
          marginLeft: "250px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* DEBUG INFO PANEL */}
          <div
            style={{
              background: "#f0f4f8",
              border: "1px solid #cbd5e0",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "16px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#4a5568",
            }}
          >
            <strong>Debug:</strong> User: {currentUser?.username || "Loading..."} | 
            Posts: {posts.length} | 
            Loading: {loading ? "Yes" : "No"} | 
            Status: {debugInfo}
          </div>

          {/* Header */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "24px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "32px",
                    color: "#2d3748",
                    fontWeight: "700",
                  }}
                >
                  Discussion Forum
                </h1>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#718096",
                    fontSize: "16px",
                  }}
                >
                  Share experiences, ask questions, and learn from fellow tomato
                  farmers
                </p>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#4caf50",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Logged in as: {currentUser.username}
                </p>
              </div>
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                style={{
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 4px rgba(76, 175, 80, 0.3)",
                }}
                onMouseOver={(e) => (e.target.style.background = "#45a049")}
                onMouseOut={(e) => (e.target.style.background = "#4caf50")}
              >
                <Plus size={20} />
                New Discussion
              </button>
            </div>

            {/* Search and Filter */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div
                style={{ flex: "1", minWidth: "250px", position: "relative" }}
              >
                <Search
                  size={20}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#718096",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 44px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border 0.3s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#4caf50")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "20px",
                      background:
                        selectedCategory === cat ? "#4caf50" : "#f7fafc",
                      color: selectedCategory === cat ? "white" : "#4a5568",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      if (selectedCategory !== cat) {
                        e.target.style.background = "#edf2f7";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedCategory !== cat) {
                        e.target.style.background = "#f7fafc";
                      }
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* New Post Form */}
          {showNewPostForm && (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px",
                marginBottom: "24px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "24px",
                  color: "#2d3748",
                  fontWeight: "600",
                }}
              >
                Start a New Discussion
              </h2>
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#4a5568",
                      fontWeight: "500",
                    }}
                  >
                    Post as
                  </label>
                  <select
                    value={postAsAnonymous ? "anonymous" : "user"}
                    onChange={(e) =>
                      setPostAsAnonymous(e.target.value === "anonymous")
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="user">{currentUser.username}</option>
                    <option value="anonymous">Anonymous User</option>
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#4a5568",
                      fontWeight: "500",
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({ ...newPost, category: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#4a5568",
                      fontWeight: "500",
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    placeholder="What would you like to discuss?"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4caf50")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#4a5568",
                      fontWeight: "500",
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                    placeholder="Share your thoughts, experiences, or questions..."
                    rows="5"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "15px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4caf50")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={handleSubmitPost}
                    style={{
                      background: "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px 32px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Send size={18} />
                    Post Discussion
                  </button>
                  <button
                    onClick={() => {
                      setShowNewPostForm(false);
                      setPostAsAnonymous(false);
                    }}
                    style={{
                      background: "#f7fafc",
                      color: "#4a5568",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px 32px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "60px 32px",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
              }}
            >
              <Loader
                size={48}
                style={{
                  color: "#4caf50",
                  margin: "0 auto 16px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "#718096", margin: 0 }}>
                Loading discussions...
              </p>
            </div>
          ) : (
            /* Discussion Posts */
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {filteredPosts.length === 0 ? (
                <div
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "60px 32px",
                    textAlign: "center",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                  }}
                >
                  <MessageCircle
                    size={64}
                    style={{ color: "#cbd5e0", margin: "0 auto 16px" }}
                  />
                  <h3 style={{ color: "#4a5568", margin: "0 0 8px 0" }}>
                    No discussions yet
                  </h3>
                  <p style={{ color: "#718096", margin: 0 }}>
                    Be the first to start a discussion!
                  </p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "28px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                      transition: "all 0.3s ease",
                      position: "relative",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0,0,0,0.12)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px rgba(0,0,0,0.07)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* DELETE BUTTON */}
                    {currentUser && currentUser.uid === post.userId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePost(post.id, post.userId);
                        }}
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          background: "#ff4444",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#cc0000";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "#ff4444";
                        }}
                      >
                        🗑 Delete
                      </button>
                    )}

                    <div style={{ display: "flex", gap: "16px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "18px",
                          flexShrink: 0,
                        }}
                      >
                        {post.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "600",
                              color: "#2d3748",
                              fontSize: "16px",
                            }}
                          >
                            {post.author}
                          </span>
                          <span
                            style={{
                              background: "#e6f4ea",
                              color: "#2e7d32",
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            {post.category}
                          </span>
                          <span
                            style={{
                              color: "#a0aec0",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Clock size={14} />
                            {getTimeAgo(post.timestamp)}
                          </span>
                        </div>
                        <h3
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "20px",
                            color: "#2d3748",
                            fontWeight: "600",
                          }}
                        >
                          {post.title}
                        </h3>
                        <p
                          style={{
                            margin: "0 0 16px 0",
                            color: "#4a5568",
                            fontSize: "15px",
                            lineHeight: "1.6",
                          }}
                        >
                          {post.content}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(post.id, post.userId);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              color: likeStatuses[post.id]
                                ? "#4caf50"
                                : "#718096",
                              fontSize: "15px",
                              fontWeight: "500",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.background = "#f7fafc")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.background = "none")
                            }
                          >
                            <ThumbsUp
                              size={18}
                              fill={likeStatuses[post.id] ? "#4caf50" : "none"}
                            />
                            {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    </>
  );
};

export default DiscussionForum;
