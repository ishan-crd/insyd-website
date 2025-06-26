"use client";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section - Your Original Design */}
      <div className="relative w-full h-screen bg-[url('/images/bgimage.png')] bg-cover bg-center text-white overflow-hidden">
        <div className="flex justify-between items-center px-8 py-6">
          <Image
            src="/images/insyd-logo.png"
            alt="Insyd Logo"
            width={100}
            height={40}
          />
          <nav className="space-x-6 text-sm md:text-base font-medium">
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

        <div className="flex flex-col md:flex-row items-center justify-center h-[80%] px-8 gap-10">
          <div className="w-[320px] md:w-[380px]">
            <Image
              src="/images/insyd-preview.png"
              alt="Phone Preview"
              width={380}
              height={700}
              className="rounded-xl shadow-2xl"
            />
          </div>

          <div className="text-center md:text-left max-w-lg">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              Coming Soon
            </h1>
            <p className="text-lg md:text-xl mb-6 text-center">
              Nightlife. Reimagined.
            </p>
            <div className="flex justify-center">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold transition">
                Join the Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="flex text-4xl md:text-5xl font-bold text-gray-900 mb-4 justify-center">
              Why Choose{" "}
              <span className="ml-3">
                <Image
                  src="/images/insyd-blacklogo.png"
                  alt="Insyd Logo"
                  width={120}
                  height={80}
                />
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience nightlife like never before with our comprehensive
              platform designed for the modern party-goer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Discover Nearby
              </h3>
              <p className="text-gray-600">
                Find the hottest clubs and events in your area with our
                location-based recommendations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Book tickets instantly with our seamless booking system. No more
                waiting in lines.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Group Booking
              </h3>
              <p className="text-gray-600">
                Plan perfect nights out with friends using our group booking and
                splitting features.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Music Preferences
              </h3>
              <p className="text-gray-600">
                Filter clubs by music genre and vibe to find the perfect
                atmosphere for your night.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
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
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Get live updates on events, availability, and special offers
                from your favorite venues.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Safe and secure payment processing with multiple payment options
                and fraud protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section id="app" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              App <span className="text-purple-600">Preview</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a look at the sleek interface and powerful features that make
              Insyd the ultimate nightlife companion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Home Screen */}
            <div className="text-center group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-2">
                <Image
                  src="/images/home.png"
                  alt="Home Screen"
                  width={300}
                  height={600}
                  className="w-full h-auto bg-transparent"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-6">
                Home Screen
              </h3>
              <p className="text-gray-600 mt-2">
                Discover clubs and events near you
              </p>
            </div>

            {/* Filters Screen */}
            <div className="text-center group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-2">
                <Image
                  src="/images/filter.png"
                  alt="Filters Screen"
                  width={300}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-6">
                Smart Filters
              </h3>
              <p className="text-gray-600 mt-2">
                Filter by location, music, and price
              </p>
            </div>

            {/* Ticket Screen */}
            <div className="text-center group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-2">
                <Image
                  src="/images/ticket.png"
                  alt="Ticket Screen"
                  width={300}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-6">
                Easy Booking
              </h3>
              <p className="text-gray-600 mt-2">
                Book tickets with just a few taps
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Everything you need for the perfect night out
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mt-1 mr-4">
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
                      Real-time Availability
                    </h4>
                    <p className="text-gray-600">
                      See live capacity and wait times for all venues
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mt-1 mr-4">
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
                      Group Management
                    </h4>
                    <p className="text-gray-600">
                      Coordinate with friends and split costs effortlessly
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mt-1 mr-4">
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
                      Exclusive Deals
                    </h4>
                    <p className="text-gray-600">
                      Access special offers and VIP experiences
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/insyd-preview.png"
                  alt="App Features"
                  width={400}
                  height={800}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="flex text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About{" "}
                <span className="ml-3">
                  <Image
                    src="/images/insyd-blacklogo.png"
                    alt="Insyd Logo"
                    width={120}
                    height={80}
                  />
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Insyd is revolutionizing the nightlife experience by connecting
                party-goers with the best venues, events, and experiences in
                their city. Our platform makes it easier than ever to discover
                new places, book tickets, and create unforgettable memories.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you're looking for an intimate cocktail bar, a
                high-energy dance club, or an exclusive VIP experience, Insyd
                has got you covered. Join thousands of users who are already
                experiencing nightlife like never before.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg">
                Get Early Access
              </button>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/main.png"
                  alt="About Insyd"
                  width={320}
                  height={640}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Party-Goers Everywhere
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a growing community of nightlife enthusiasts who choose Insyd
              for their night out experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                50K+
              </div>
              <div className="text-gray-600 font-medium">Registered Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                200+
              </div>
              <div className="text-gray-600 font-medium">Partner Venues</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600 font-medium">Events Booked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                25+
              </div>
              <div className="text-gray-600 font-medium">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Nightlife?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of party-goers who are already experiencing the
            future of nightlife. Be the first to know when we launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border border-white text-white placeholder-white bg-transparent focus:ring-1 focus:ring-white"
            />

            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Join Waitlist
            </button>
          </div>
          <p className="text-white/70 text-sm mt-4">
            No spam, just exclusive updates and early access.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4">
                <span className="text-purple-400">insyd</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionizing nightlife experiences one venue at a time.
                Discover, book, and enjoy the best clubs in your city.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-sm">i</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Updates
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
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
