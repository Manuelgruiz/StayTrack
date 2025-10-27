import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
        <p className="text-gray-600 mb-4">The page you requested does not exist.</p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-fitnessAccent text-white hover:brightness-110 transition"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
