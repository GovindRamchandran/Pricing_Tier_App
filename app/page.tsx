import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex items-center justify-center min-h-screen flex-col p-8 text-center overflow-hidden">
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-[#0E4259] via-[#1C586F] to-[#0E4259] opacity-40 blur-3xl" />
      <h1 className="text-5xl font-semibold dark:font-extrabold mb-6 text-black dark:text-gray-400 transition-colors duration-300 tracking-wide">
        Welcome to{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 font-extrabold">
          My
        </span>
        <span className="text-black dark:text-white font-extrabold italic">SaaS</span>
      </h1>

      <Link
        href="/pricing"
        className="inline-block bg-[#0E4259] dark:bg-gray-300 text-white dark:text-black px-6 py-3 rounded-lg shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 transform font-medium tracking-wide"
      >
        View Pricing Plans
      </Link>
    </main>
  );
}
