"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(374);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "insyd2025admin";

  // Add user to waitlist
  const addToWaitlist = async (email: string, phone: string) => {
    try {
      const { data, error } = await supabase.from("waitlist").insert([
        {
          email: email || null,
          phone: phone || null,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error("Failed to join waitlist. Please try again.");
      }

      return data;
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      throw error;
    }
  };

  // Get current waitlist count
  const getWaitlistCount = async () => {
    try {
      const { count, error } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error getting count:", error);
        return 374; // Fallback number
      }

      return count || 374;
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      return 374; // Fallback number
    }
  };

  // Export waitlist data (admin only)
  const exportWaitlistData = async () => {
    try {
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error exporting data:", error);
        throw new Error("Failed to export data");
      }

      return data || [];
    } catch (error) {
      console.error("Error exporting waitlist data:", error);
      throw error;
    }
  };

  // Load waitlist count on component mount
  useEffect(() => {
    const loadWaitlistCount = async () => {
      const count = await getWaitlistCount();
      setWaitlistCount(count);
    };

    loadWaitlistCount();

    // Update count every 30 seconds
    const interval = setInterval(loadWaitlistCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Admin access via keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setShowAdminLogin(true);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleAdminLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Invalid password");
    }
  };

  const handleWaitlistSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setError("Please enter at least an email address");
      return;
    }

    if (email && !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await addToWaitlist(email, phone);

      setSubmitSuccess(true);
      setEmail("");
      setPhone("");

      // Refresh waitlist count
      const newCount = await getWaitlistCount();
      setWaitlistCount(newCount);

      // Close popup after 2 seconds
      setTimeout(() => {
        setIsPopupOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      setError(error.message || "Sorry, there was an error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const data = await exportWaitlistData();

      if (data.length === 0) {
        alert("No data to export");
        return;
      }

      // Create CSV content
      const csvContent = [
        ["Email", "Phone", "Date Joined"],
        ...data.map((entry) => [
          entry.email || "N/A",
          entry.phone || "N/A",
          new Date(entry.created_at).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      // Download file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `insyd-waitlist-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error exporting data: " + error.message);
    }
  };

  return (
    <>
      {/* Admin Login Popup */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Admin Access
            </h3>
            <div>
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                autoFocus
                onKeyPress={(e) => e.key === "Enter" && handleAdminLogin(e)}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Join the Waitlist
              </h3>
              <p className="text-gray-600 mb-2">
                Be the first to experience the future of nightlife!
              </p>
              <p className="text-sm text-purple-600 font-semibold">
                🔥 {waitlistCount.toLocaleString()} people waiting
              </p>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  You&apos;re In! 🎉
                </h4>
                <p className="text-gray-600">
                  We&apos;ll notify you as soon as we launch.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Enter your phone number (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopupOpen(false);
                      setError("");
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWaitlistSubmit}
                    disabled={isSubmitting || !email}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Export Controls */}
      {isAdmin && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-40">
          <button
            onClick={handleExportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            📊 Export Waitlist
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors text-sm"
          >
            🚪 Logout Admin
          </button>
        </div>
      )}

      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-30">
        {supabaseUrl.includes("your-project") ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded-lg text-xs">
            ⚠️ Configure Supabase
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-1 rounded-lg text-xs">
            ✅ Connected
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="relative w-full min-h-screen bg-[url('/images/bgimage.png')] bg-cover bg-center text-white overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Image
            src="/images/insyd-logo.png"
            alt="Insyd Logo"
            width={80}
            height={32}
            className="sm:w-[100px] sm:h-[40px]"
          />
          <nav className="mt-4 sm:mt-0 space-x-4 sm:space-x-6 text-sm sm:text-base font-medium">
            <a href="#features" className="hover:underline">
              Features
            </a>
            <a href="#app" className="hover:underline">
              App Preview
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 gap-8 lg:gap-10 py-8">
          <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] order-2 lg:order-1">
            <Image
              src="/images/insyd-preview.png"
              alt="Phone Preview"
              width={380}
              height={700}
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>

          <div className="text-center lg:text-left max-w-lg order-1 lg:order-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4">
              Coming Soon
            </h1>
            <p className="text-lg sm:text-xl mb-6">Nightlife. Reimagined.</p>
            <div className="mb-6">
              <p className="text-sm sm:text-base text-purple-200 mb-4">
                🔥 {waitlistCount.toLocaleString()} people already waiting
              </p>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="flex flex-col sm:flex-row text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 justify-center items-center gap-2 sm:gap-3">
              Why Choose
              <span>
                <Image
                  src="/images/insyd-blacklogo.png"
                  alt="Insyd Logo"
                  width={100}
                  height={60}
                  className="sm:w-[120px] sm:h-[80px]"
                />
              </span>
              ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience nightlife like never before with our comprehensive
              platform designed for the modern party-goer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                ),
                gradient: "from-purple-600 to-pink-600",
                title: "Discover Nearby",
                description:
                  "Find the hottest clubs and events in your area with our location-based recommendations.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    ></path>
                  </svg>
                ),
                gradient: "from-purple-500 to-blue-600",
                title: "Easy Booking",
                description:
                  "Book tickets instantly with our seamless booking system. No more waiting in lines.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                ),
                gradient: "from-blue-500 to-teal-600",
                title: "Group Booking",
                description:
                  "Plan perfect nights out with friends using our group booking and splitting features.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    ></path>
                  </svg>
                ),
                gradient: "from-teal-500 to-green-600",
                title: "Music Preferences",
                description:
                  "Filter clubs by music genre and vibe to find the perfect atmosphere for your night.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ),
                gradient: "from-green-500 to-yellow-600",
                title: "Real-time Updates",
                description:
                  "Get live updates on events, availability, and special offers from your favorite venues.",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                ),
                gradient: "from-yellow-500 to-red-600",
                title: "Secure Payments",
                description:
                  "Safe and secure payment processing with multiple payment options and fraud protection.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section id="app" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              App <span className="text-purple-600">Preview</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Take a look at the sleek interface and powerful features that make
              Insyd the ultimate nightlife companion.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                src: "/images/home.png",
                title: "Home Screen",
                description: "Discover clubs and events near you",
              },
              {
                src: "/images/filter.png",
                title: "Smart Filters",
                description: "Filter by location, music, and price",
              },
              {
                src: "/images/ticket.png",
                title: "Easy Booking",
                description: "Book tickets with just a few taps",
              },
            ].map((screen, index) => (
              <div key={index} className="text-center group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-2">
                  <Image
                    src={screen.src}
                    alt={screen.title}
                    width={300}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-6">
                  {screen.title}
                </h3>
                <p className="text-gray-600 mt-2">{screen.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="mt-12 sm:mt-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Everything you need for the perfect night out
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Real-time Availability",
                    description:
                      "See live capacity and wait times for all venues",
                  },
                  {
                    title: "Group Management",
                    description:
                      "Coordinate with friends and split costs effortlessly",
                  },
                  {
                    title: "Exclusive Deals",
                    description: "Access special offers and VIP experiences",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mt-1 mr-4 flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative max-w-[300px] sm:max-w-[400px]">
                <Image
                  src="/images/insyd-preview.png"
                  alt="App Features"
                  width={400}
                  height={800}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="flex flex-col sm:flex-row text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 items-center gap-2 sm:gap-3">
                About
                <span>
                  <Image
                    src="/images/insyd-blacklogo.png"
                    alt="Insyd Logo"
                    width={100}
                    height={60}
                    className="sm:w-[120px] sm:h-[80px]"
                  />
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                Insyd is revolutionizing the nightlife experience by connecting
                party-goers with the best venues, events, and experiences in
                their city. Our platform makes it easier than ever to discover
                new places, book tickets, and create unforgettable memories.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you&apos;re looking for an intimate cocktail bar, a
                high-energy dance club, or an exclusive VIP experience, Insyd
                has got you covered. Join thousands of users who are already
                experiencing nightlife like never before.
              </p>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                Get Early Access
              </button>
            </div>
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative max-w-[280px] sm:max-w-[320px]">
                <Image
                  src="/images/main.png"
                  alt="About Insyd"
                  width={320}
                  height={640}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Party-Goers Everywhere
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Join a growing community of nightlife enthusiasts who choose Insyd
              for their night out experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { number: "50K+", label: "Registered Users" },
              { number: "200+", label: "Partner Venues" },
              { number: "10K+", label: "Events Booked" },
              { number: "25+", label: "Cities Covered" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Nightlife?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed px-4">
            Join thousands of party-goers who are already experiencing the
            future of nightlife. Be the first to know when we launch.
          </p>
          <div className="text-center mb-6">
            <p className="text-white/80 text-sm sm:text-base mb-4">
              🔥 {waitlistCount.toLocaleString()} people already waiting
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full border border-white text-gray-900 placeholder-gray-500 bg-white focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
            />
            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </div>
          <p className="text-white/70 text-xs sm:text-sm mt-4">
            No spam, just exclusive updates and early access.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2">
              <div className="text-2xl font-bold mb-4">
                <span className="text-purple-400">insyd</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md text-sm sm:text-base">
                Revolutionizing nightlife experiences one venue at a time.
                Discover, book, and enjoy the best clubs in your city.
              </p>
              <div className="flex space-x-4">
                {["f", "t", "i"].map((social, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer"
                  >
                    <span className="text-sm">{social}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                {["Features", "Pricing", "Security", "Updates"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="hover:text-purple-400 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                {["About", "Careers", "Contact", "Privacy"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="hover:text-purple-400 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © 2025 Insyd. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Made with ❤️ for the nightlife community
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
