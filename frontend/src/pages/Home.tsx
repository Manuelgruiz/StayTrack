import Navbar from "../components/Navbar";
import { Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-sm mb-4">
              <Activity className="text-fitnessAccent" size={16} />
              StayTrack • Health dashboard
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Track your meals & workouts
              <br />
              with clarity.
            </h1>
            <p className="text-gray-600 mt-4">
              A clean, focused dashboard to log food, monitor training, and
              understand your daily balance.
            </p>

            <div className="flex gap-3 mt-6">
              <Link
                to="/register"
                className="px-6 py-3 rounded-full bg-fitnessAccent text-white hover:brightness-110 transition inline-flex items-center gap-2"
              >
                Get started <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 rounded-full border border-black/10 hover:bg-black/5 transition"
              >
                I have an account
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-soft p-6"
          >
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
              className="rounded-xl2 object-cover w-full h-[320px]"
              alt="Fitness preview"
            />
          </motion.div>
        </section>
      </main>
    </>
  );
}
