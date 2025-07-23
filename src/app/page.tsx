import { Navbar7 as Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      
      {/* Intro Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            Welcome to <span className="text-blue-600">SenseiiWyze</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Your intelligent dashboard for managing heritage collections and vintage portfolios. 
            We help you preserve, organize, and showcase your most valuable assets with cutting-edge AI technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center">
              Get Started
            </a>
            <a href="/auth/login" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center">
              Sign In
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
