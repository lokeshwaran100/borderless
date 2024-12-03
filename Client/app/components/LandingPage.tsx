"use client";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-[75vh] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="container w-[88vw] mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Cross-Border Transfers
              <span className="text-blue-600"> Simplified</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Send money internationally with ease using stablecoins. Fast, secure, and cost-effective transfers at your fingertips.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex gap-4"
            >
              <button onClick={()=>signIn("google")} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg">
                Sign In
              </button>
              <Link href="/register">
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                Register
              </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Phone */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20"
              >
                <div className="bg-gray-800 rounded-3xl p-2 shadow-2xl">
                  <div className="bg-white rounded-2xl p-4 h-[500px] relative overflow-hidden">
                    {/* App Interface Elements */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="absolute top-8 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Pay Now
                    </motion.div>

                    {/* Floating Elements */}
                    <motion.div
                      animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-20 left-4"
                    >
                      <div className="bg-blue-100 w-16 h-16 rounded-lg shadow-lg" />
                    </motion.div>

                    {/* Credit Card */}
                    <motion.div
                      animate={{ rotate: [0, 5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-40 right-4 bg-gradient-to-r from-blue-400 to-blue-600 w-48 h-32 rounded-xl shadow-xl"
                    />

                    {/* Receipt */}
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute bottom-20 left-4 bg-white w-32 h-40 rounded-lg shadow-lg"
                    >
                      <div className="border-b-2 border-gray-100 w-full h-4 mt-2" />
                      <div className="border-b-2 border-gray-100 w-full h-4 mt-2" />
                      <div className="border-b-2 border-gray-100 w-full h-4 mt-2" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Background Decorative Elements */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl z-10"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [360, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 