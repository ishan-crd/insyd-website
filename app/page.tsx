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
  const [waitlistCount, setWaitlistCount] = useState(347);
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
    } catch (error: unknown) {
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
        return 347;
      }

      const actualCount = count || 0;
      return 347 + actualCount;
    } catch (error: unknown) {
      console.error("Error getting waitlist count:", error);
      return 347;
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
    } catch (error: unknown) {
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

  const handleAdminLogin = (e: React.MouseEvent | React.KeyboardEvent) => {
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

      const newCount = await getWaitlistCount();
      setWaitlistCount(newCount);

      setTimeout(() => {
        setIsPopupOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sorry, there was an error. Please try again.";
      setError(errorMessage);
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

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `insyd-waitlist-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert("Error exporting data: " + errorMessage);
    }
  };

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: "Neue-Plak-Extended-Black";
          src: url("/fonts/Neue Plak Extended Black.woff") format("woff");
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Neue-Plak-Extended-Bold";
          src: url("/fonts/Neue Plak Extended Bold.woff") format("woff");
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Montserrat-Light";
          src: url("/fonts/Montserrat-Light.ttf") format("truetype");
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Montserrat-Medium";
          src: url("/fonts/Montserrat-Medium.ttf") format("truetype");
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Montserrat-SemiBold";
          src: url("/fonts/Montserrat-SemiBold.ttf") format("truetype");
          font-weight: 600;
          font-style: normal;
          font-display: swap;
        }

        .font-neue-plak {
          font-family: "Neue-Plak-Extended-Black", serif;
          font-weight: 900;
          letter-spacing: -0.03em;
        }

        .font-neue-plak-bold {
          font-family: "Neue-Plak-Extended-Bold", serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .font-montserrat-light {
          font-family: "Montserrat-Light", sans-serif;
          font-weight: 300;
          letter-spacing: 0.02em;
        }

        .font-montserrat-medium {
          font-family: "Montserrat-Medium", sans-serif;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .font-montserrat-semibold {
          font-family: "Montserrat-SemiBold", sans-serif;
          font-weight: 600;
          letter-spacing: 0.005em;
        }

        body {
          background: #000000;
          overflow-x: hidden;
        }

        .luxury-gradient {
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(12, 12, 12, 0.9) 25%,
            rgba(18, 18, 18, 0.85) 50%,
            rgba(12, 12, 12, 0.9) 75%,
            rgba(0, 0, 0, 0.95) 100%
          );
        }

        .premium-glass {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .pink-accent {
          background: linear-gradient(
            135deg,
            #ec4899 0%,
            #be185d 50%,
            #9d174d 100%
          );
        }

        .pink-glow {
          box-shadow: 0 0 50px rgba(236, 72, 153, 0.4),
            0 0 100px rgba(236, 72, 153, 0.2),
            inset 0 0 50px rgba(236, 72, 153, 0.1);
        }

        .ultra-shadow {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 100px rgba(236, 72, 153, 0.2);
        }

        .text-shimmer {
          background: linear-gradient(
            135deg,
            #ffffff 25%,
            #ec4899 50%,
            #ffffff 75%
          );
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
        }

        .floating-slow {
          animation: floating-slow 8s ease-in-out infinite;
        }

        @keyframes floating-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(2deg);
          }
        }

        .exclusive-border {
          border: 2px solid transparent;
          background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9))
              padding-box,
            linear-gradient(135deg, #ec4899, #be185d, #ec4899) border-box;
        }

        .vip-hover {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .vip-hover:hover {
          transform: translateY(-15px) scale(1.02);
          filter: brightness(1.1);
        }

        .luxury-grid {
          background-image: radial-gradient(
              circle at 25% 25%,
              rgba(236, 72, 153, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 75% 75%,
              rgba(236, 72, 153, 0.05) 0%,
              transparent 50%
            ),
            linear-gradient(
              0deg,
              transparent 24%,
              rgba(255, 255, 255, 0.005) 25%,
              rgba(255, 255, 255, 0.005) 26%,
              transparent 27%,
              transparent 74%,
              rgba(255, 255, 255, 0.005) 75%,
              rgba(255, 255, 255, 0.005) 76%,
              transparent 77%,
              transparent
            );
          background-size: 80px 80px;
        }

        .status-indicator {
          position: relative;
        }

        .status-indicator::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #ec4899, #be185d, #ec4899);
          border-radius: inherit;
          z-index: -1;
          opacity: 0.7;
          filter: blur(10px);
        }

        .diamond-shape {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }

        .ultra-exclusive-text {
          text-shadow: 0 0 10px rgba(236, 72, 153, 0.8),
            0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(236, 72, 153, 0.4);
        }
      `}</style>

      {/* Admin Login Popup */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="premium-glass rounded-3xl p-10 max-w-sm w-full mx-4 exclusive-border ultra-shadow">
            <h3 className="font-neue-plak text-3xl text-white mb-8 text-center ultra-exclusive-text">
              EXCLUSIVE ACCESS
            </h3>
            <div>
              <input
                type="password"
                placeholder="Enter administrative code"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-6 py-5 bg-black/30 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#EC4899] focus:border-transparent mb-8 text-white placeholder-white/40 font-montserrat-light text-sm"
                autoFocus
                onKeyPress={(e: React.KeyboardEvent) =>
                  e.key === "Enter" && handleAdminLogin(e)
                }
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword("");
                  }}
                  className="flex-1 px-6 py-4 border border-white/20 text-white/60 rounded-2xl hover:bg-white/5 font-montserrat-medium text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-6 py-4 bg-[#EC4899] text-white rounded-2xl hover:bg-[#EC4899]/90 font-montserrat-semibold text-sm transition-all pink-glow"
                >
                  Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="premium-glass rounded-3xl p-10 max-w-lg w-full mx-4 exclusive-border ultra-shadow">
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#EC4899] to-[#be185d] rounded-full flex items-center justify-center mx-auto mb-8 pink-glow status-indicator">
                <div className="w-8 h-8 diamond-shape bg-white"></div>
              </div>
              <h3 className="font-neue-plak text-4xl text-white mb-4 ultra-exclusive-text">
                EXCLUSIVE INVITATION
              </h3>
              <p className="font-montserrat-light text-white/70 mb-4 text-lg leading-relaxed">
                Join the most sophisticated nightlife platform reserved for the
                elite
              </p>
              <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-6 py-3 mb-2">
                <div className="w-2 h-2 bg-[#EC4899] rounded-full animate-pulse"></div>
                <p className="font-montserrat-semibold text-[#EC4899] text-sm tracking-wider">
                  {waitlistCount.toLocaleString()} MEMBERS AWAITING ACCESS
                </p>
              </div>
            </div>

            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
                  <svg
                    className="w-12 h-12 text-green-400"
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
                <h4 className="font-neue-plak text-3xl text-white mb-4">
                  WELCOME TO THE ELITE
                </h4>
                <p className="font-montserrat-light text-white/70 text-lg">
                  Your exclusive access is being prepared
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl font-montserrat-light">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-white/60 font-montserrat-medium text-sm mb-2 tracking-wider">
                    PRIVATE EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-5 bg-black/30 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#EC4899] focus:border-transparent text-white placeholder-white/40 font-montserrat-light text-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/60 font-montserrat-medium text-sm mb-2 tracking-wider">
                    CONTACT NUMBER (OPTIONAL)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-6 py-5 bg-black/30 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#EC4899] focus:border-transparent text-white placeholder-white/40 font-montserrat-light text-lg"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopupOpen(false);
                      setError("");
                    }}
                    className="flex-1 px-8 py-5 border border-white/20 text-white/60 rounded-2xl hover:bg-white/5 font-montserrat-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWaitlistSubmit}
                    disabled={isSubmitting || !email}
                    className="flex-1 px-8 py-5 bg-gradient-to-r from-[#EC4899] to-[#be185d] text-white rounded-2xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-montserrat-semibold transition-all ultra-shadow"
                  >
                    {isSubmitting ? "Processing..." : "Request Invitation"}
                  </button>
                </div>
                <p className="text-center text-white/40 font-montserrat-light text-sm">
                  Membership is by invitation only • Strictly confidential
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Export Controls */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
          <button
            onClick={handleExportToExcel}
            className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-green-700 transition-colors font-montserrat-semibold text-sm flex items-center gap-2 pink-glow"
          >
            📊 Export Data
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-red-700 transition-colors font-montserrat-semibold text-sm"
          >
            🚪 Exit
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative min-h-screen luxury-gradient text-white overflow-hidden luxury-grid">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-[#EC4899] rounded-full opacity-60 floating-slow"></div>
        <div
          className="absolute top-40 right-20 w-6 h-6 bg-[#be185d] rounded-full opacity-40 floating-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-3 h-3 bg-[#EC4899] rounded-full opacity-50 floating-slow"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Navigation */}
        <nav className="relative z-10 flex flex-col sm:flex-row justify-between items-center px-8 lg:px-16 py-8 sm:py-12">
          <div className="mb-8 sm:mb-0">
            <Image
              src="/images/insyd-logo.png"
              alt="Insyd"
              width={150}
              height={60}
              className="h-16 w-auto filter brightness-110"
            />
          </div>
          <div className="flex items-center space-x-12">
            <div className="hidden lg:flex space-x-8 font-montserrat-medium text-white/70 text-sm tracking-widest">
              <a
                href="#experience"
                className="hover:text-[#EC4899] transition-colors duration-300"
              >
                EXPERIENCE
              </a>
              <a
                href="#preview"
                className="hover:text-[#EC4899] transition-colors duration-300"
              >
                PREVIEW
              </a>
              <a
                href="#exclusivity"
                className="hover:text-[#EC4899] transition-colors duration-300"
              >
                EXCLUSIVITY
              </a>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <div className="w-2 h-2 bg-[#EC4899] rounded-full animate-pulse"></div>
              <span className="font-montserrat-semibold text-[#EC4899] text-xs tracking-wider">
                INVITE ONLY
              </span>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-200px)] px-8 lg:px-16 gap-16 lg:gap-24">
          <div className="hidden lg:block w-full max-w-[380px] lg:max-w-[450px] order-2 lg:order-1 floating-slow">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/20 to-[#be185d]/20 rounded-3xl blur-3xl"></div>
              <Image
                src="/images/insyd-preview.png"
                alt="Exclusive Preview"
                width={450}
                height={900}
                className="relative w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="text-center lg:text-left max-w-3xl order-1 lg:order-2">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#EC4899]/20 to-[#be185d]/20 rounded-full px-6 py-3 mb-8 border border-white/10">
                <div className="diamond-shape w-3 h-3 bg-[#EC4899]"></div>
                <span className="font-montserrat-semibold text-white/80 text-sm tracking-widest">
                  ULTRA EXCLUSIVE PREVIEW
                </span>
              </div>
            </div>

            <h1 className="font-neue-plak text-6xl sm:text-7xl lg:text-8xl xl:text-9xl mb-8 leading-none">
              <span className="block text-white">THE</span>
              <span className="block text-shimmer">ELITE</span>
              <span className="block text-white/80">EXPERIENCE</span>
            </h1>

            <p className="font-montserrat-light text-xl sm:text-2xl lg:text-3xl mb-12 text-white/70 leading-relaxed max-w-2xl">
              Where sophistication meets nightlife. An exclusive platform
              reserved for those who demand the extraordinary.
            </p>

            <div className="space-y-8">
              <div className="flex items-center justify-center lg:justify-start space-x-6">
                <div className="text-center">
                  <div className="font-neue-plak text-3xl text-[#EC4899] ultra-exclusive-text">
                    {waitlistCount.toLocaleString()}
                  </div>
                  <div className="font-montserrat-light text-white/50 text-xs tracking-widest">
                    ELITE MEMBERS
                  </div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="font-neue-plak text-3xl text-[#be185d]">
                    ∞
                  </div>
                  <div className="font-montserrat-light text-white/50 text-xs tracking-widest">
                    PRICELESS ACCESS
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPopupOpen(true)}
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-[#EC4899] to-[#be185d] text-white rounded-full font-montserrat-semibold text-lg transition-all duration-500 hover:scale-105 ultra-shadow vip-hover"
              >
                <span className="relative z-10">Request Exclusive Access</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#be185d] to-[#EC4899] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>

              <p className="font-montserrat-light text-white/40 text-sm max-w-md leading-relaxed">
                Membership is strictly by invitation. Applications are reviewed
                by our elite concierge team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <section id="experience" className="py-32 bg-black luxury-grid">
        <div className="max-w-8xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-24">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#EC4899]/10 to-[#be185d]/10 rounded-full px-8 py-4 mb-8 border border-white/5">
              <div className="diamond-shape w-4 h-4 bg-[#EC4899]"></div>
              <span className="font-montserrat-semibold text-white/60 text-sm tracking-widest">
                CURATED EXPERIENCES
              </span>
            </div>
            <h2 className="font-neue-plak text-5xl sm:text-6xl lg:text-7xl text-white mb-8 ultra-exclusive-text">
              BEYOND ORDINARY
            </h2>
            <p className="font-montserrat-light text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
              Every detail crafted for the discerning few who appreciate the
              finest things in life
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                icon: "💎",
                title: "DIAMOND TIER VENUES",
                description:
                  "                Access to the world&apos;s most exclusive establishments, handpicked by our elite curation team",
                accent: "from-[#EC4899] to-[#be185d]",
              },
              {
                icon: "🥂",
                title: "VIP CONCIERGE",
                description:
                  "Personal concierge service ensuring every aspect of your evening exceeds expectations",
                accent: "from-[#be185d] to-[#9d174d]",
              },
              {
                icon: "👑",
                title: "ELITE NETWORK",
                description:
                  "Connect with influential individuals and celebrities in the most sophisticated settings",
                accent: "from-[#9d174d] to-[#EC4899]",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="premium-glass rounded-3xl p-10 vip-hover group exclusive-border"
              >
                <div className="text-center">
                  <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="font-neue-plak-bold text-2xl text-white mb-6 group-hover:text-[#EC4899] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="font-montserrat-light text-white/70 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <div
                    className={`w-full h-1 bg-gradient-to-r ${feature.accent} rounded-full mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section
        id="preview"
        className="py-32 bg-gradient-to-br from-gray-950 via-black to-gray-950"
      >
        <div className="max-w-8xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-24">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#EC4899]/10 to-[#be185d]/10 rounded-full px-8 py-4 mb-8 border border-white/5">
              <div className="diamond-shape w-4 h-4 bg-[#EC4899]"></div>
              <span className="font-montserrat-semibold text-white/60 text-sm tracking-widest">
                EXCLUSIVE PREVIEW
              </span>
            </div>
            <h2 className="font-neue-plak text-5xl sm:text-6xl lg:text-7xl text-white mb-8">
              SOPHISTICATION <span className="text-shimmer">REDEFINED</span>
            </h2>
            <p className="font-montserrat-light text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
              A glimpse into the platform that will redefine how the elite
              experience nightlife
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 max-w-7xl mx-auto">
            {[
              {
                src: "/images/home.png",
                title: "ELITE DISCOVERY",
                description: "Curated venues worthy of your standards",
                badge: "EXCLUSIVE",
              },
              {
                src: "/images/filter.png",
                title: "PRECISION FILTERING",
                description: "Find exactly what matches your taste",
                badge: "PERSONALIZED",
              },
              {
                src: "/images/ticket.png",
                title: "SEAMLESS BOOKING",
                description: "Reserve your place among the elite",
                badge: "INSTANT",
              },
            ].map((screen, index) => (
              <div key={index} className="group">
                <div className="hidden lg:block premium-glass rounded-3xl p-8 vip-hover exclusive-border overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-gradient-to-r from-[#EC4899] to-[#be185d] text-white px-3 py-1 rounded-full font-montserrat-semibold text-xs">
                        {screen.badge}
                      </span>
                    </div>
                    <Image
                      src={screen.src}
                      alt={screen.title}
                      width={300}
                      height={600}
                      className="w-full h-auto rounded-2xl group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="text-center mt-8">
                  <h3 className="font-neue-plak-bold text-xl text-white mb-3 group-hover:text-[#EC4899] transition-colors">
                    {screen.title}
                  </h3>
                  <p className="font-montserrat-light text-white/60 leading-relaxed">
                    {screen.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusivity Section */}
      <section id="exclusivity" className="py-32 bg-black luxury-grid">
        <div className="max-w-8xl mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#EC4899]/10 to-[#be185d]/10 rounded-full px-8 py-4 mb-8 border border-white/5">
                <div className="diamond-shape w-4 h-4 bg-[#EC4899]"></div>
                <span className="font-montserrat-semibold text-white/60 text-sm tracking-widest">
                  ULTRA EXCLUSIVE
                </span>
              </div>

              <h2 className="font-neue-plak text-5xl sm:text-6xl lg:text-7xl text-white mb-8 leading-tight">
                FOR THE <span className="text-shimmer">DISTINGUISHED</span> FEW
              </h2>

              <p className="font-montserrat-light text-xl text-white/70 mb-12 leading-relaxed">
                INSYD represents the pinnacle of nightlife sophistication. Our
                platform is meticulously designed for individuals who demand
                nothing less than perfection in every aspect of their social
                experiences.
              </p>

              <div className="space-y-8 mb-12">
                {[
                  {
                    title: "INVITATION ONLY ACCESS",
                    description:
                      "Membership limited to verified high-net-worth individuals and celebrities",
                  },
                  {
                    title: "PLATINUM CONCIERGE",
                    description:
                      "24/7 personal concierge ensuring every detail exceeds your expectations",
                  },
                  {
                    title: "PRIVATE RESERVATIONS",
                    description:
                      "Exclusive access to private dining rooms and VIP sections worldwide",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#EC4899] to-[#be185d] flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 diamond-shape bg-white"></div>
                    </div>
                    <div>
                      <h4 className="font-montserrat-semibold text-white text-lg mb-2 tracking-wide">
                        {item.title}
                      </h4>
                      <p className="font-montserrat-light text-white/60 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsPopupOpen(true)}
                className="inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-[#EC4899] to-[#be185d] text-white rounded-full font-montserrat-semibold text-lg transition-all duration-500 hover:scale-105 ultra-shadow vip-hover"
              >
                Apply for Membership
              </button>
            </div>

            <div className="flex justify-center order-1 lg:order-2">
              <div className="hidden lg:block relative max-w-[400px] floating-slow">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899]/30 to-[#be185d]/30 rounded-3xl blur-3xl"></div>
                <Image
                  src="/images/main.png"
                  alt="Elite Experience"
                  width={400}
                  height={800}
                  className="relative w-full h-auto rounded-3xl ultra-shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-32 bg-gradient-to-br from-gray-950 via-black to-gray-950">
        <div className="max-w-8xl mx-auto px-8 lg:px-16">
          <div className="text-center mb-24">
            <h2 className="font-neue-plak text-5xl sm:text-6xl lg:text-7xl text-white mb-8">
              ELITE <span className="text-shimmer">STATISTICS</span>
            </h2>
            <p className="font-montserrat-light text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
              Numbers that reflect our commitment to exclusivity and excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                number: "$2.5M",
                label: "AVERAGE MEMBER NET WORTH",
                icon: "💰",
              },
              { number: "50+", label: "MICHELIN STAR PARTNERS", icon: "⭐" },
              { number: "0.1%", label: "ACCEPTANCE RATE", icon: "🔐" },
              { number: "24/7", label: "PLATINUM CONCIERGE", icon: "👔" },
            ].map((stat, index) => (
              <div
                key={index}
                className="premium-glass rounded-3xl p-8 vip-hover group exclusive-border text-center"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">
                  {stat.icon}
                </div>
                <div className="font-neue-plak text-4xl lg:text-5xl text-shimmer mb-4 group-hover:scale-105 transition-transform duration-500">
                  {stat.number}
                </div>
                <div className="font-montserrat-medium text-white/60 text-sm tracking-widest leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 bg-gradient-to-br from-[#EC4899] via-[#be185d] to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#EC4899]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#be185d]/30 rounded-full blur-3xl"></div>
          <div className="absolute center w-96 h-96 bg-[#9d174d]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-16 text-center">
          <div className="inline-flex items-center space-x-3 bg-black/20 rounded-full px-8 py-4 mb-12 border border-white/20">
            <div className="diamond-shape w-4 h-4 bg-white"></div>
            <span className="font-montserrat-semibold text-white/80 text-sm tracking-widest">
              FINAL INVITATION
            </span>
          </div>

          <h2 className="font-neue-plak text-5xl sm:text-6xl lg:text-7xl text-white mb-8 ultra-exclusive-text leading-tight">
            JOIN THE ELITE
          </h2>

          <p className="font-montserrat-light text-xl sm:text-2xl text-white/90 mb-16 leading-relaxed max-w-4xl mx-auto">
            This is your exclusive invitation to join the most sophisticated
            nightlife platform in the world. Membership is strictly limited.
          </p>

          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-8 bg-black/30 rounded-full px-12 py-6 border border-white/20">
              <div className="text-center">
                <div className="font-neue-plak text-3xl text-white ultra-exclusive-text">
                  {waitlistCount.toLocaleString()}
                </div>
                <div className="font-montserrat-light text-white/60 text-xs tracking-widest">
                  AWAITING ACCESS
                </div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="font-neue-plak text-3xl text-white">
                  LIMITED
                </div>
                <div className="font-montserrat-light text-white/60 text-xs tracking-widest">
                  AVAILABILITY
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center justify-center px-16 py-8 bg-white text-black rounded-full font-montserrat-semibold text-xl transition-all duration-500 hover:scale-105 ultra-shadow vip-hover group"
            >
              <span className="relative z-10">Request Elite Access</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <p className="font-montserrat-light text-white/60 text-sm max-w-2xl mx-auto leading-relaxed">
              Applications undergo rigorous review by our executive committee.
              Only the most distinguished applicants receive approval.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-24 border-t border-white/5">
        <div className="max-w-8xl mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-4 gap-16">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <Image
                  src="/images/insyd-logo.png"
                  alt="Insyd"
                  width={180}
                  height={72}
                  className="h-20 w-auto filter brightness-110"
                />
              </div>
              <p className="font-montserrat-light text-white/60 mb-12 max-w-lg font-montserrat-light text-lg leading-relaxed">
                The world&apos;s most exclusive nightlife platform, reserved for
                individuals who demand the extraordinary in every aspect of
                their social experiences.
              </p>
              <div className="flex space-x-6">
                {[
                  { icon: "f", label: "Facebook", bg: "hover:bg-blue-600" },
                  { icon: "t", label: "Twitter", bg: "hover:bg-blue-400" },
                  { icon: "i", label: "Instagram", bg: "hover:bg-pink-600" },
                ].map((social, index) => (
                  <div
                    key={index}
                    className={`w-14 h-14 bg-white/5 rounded-full flex items-center justify-center ${social.bg} transition-all duration-300 cursor-pointer group border border-white/10`}
                  >
                    <span className="font-montserrat-semibold text-lg group-hover:text-white text-white/70">
                      {social.icon}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-neue-plak-bold text-xl text-white mb-8 tracking-wider">
                SERVICES
              </h3>
              <ul className="space-y-4 text-white/60 font-montserrat-light">
                {[
                  "Elite Venues",
                  "VIP Concierge",
                  "Private Events",
                  "Platinum Membership",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-[#EC4899] transition-colors duration-300 block py-1"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-neue-plak-bold text-xl text-white mb-8 tracking-wider">
                COMPANY
              </h3>
              <ul className="space-y-4 text-white/60 font-montserrat-light">
                {[
                  "About Insyd",
                  "Executive Team",
                  "Press Inquiries",
                  "Legal",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-[#EC4899] transition-colors duration-300 block py-1"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-20 pt-12 flex flex-col lg:flex-row justify-between items-center text-center lg:text-left">
            <p className="text-white/60 font-montserrat-light tracking-wider">
              © 2025 INSYD. ALL RIGHTS RESERVED. EXCLUSIVELY CRAFTED FOR THE
              ELITE.
            </p>
            <div className="flex items-center space-x-2 mt-6 lg:mt-0">
              <div className="diamond-shape w-3 h-3 bg-[#EC4899]"></div>
              <p className="text-white/60 font-montserrat-light text-sm tracking-wider">
                MEMBERSHIP BY INVITATION ONLY
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
