"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Bebas_Neue, Orbitron } from "next/font/google";
import { auth } from "@/lib/firebase";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Could not log in. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.42),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.35),transparent_28%),linear-gradient(135deg,#050008_0%,#16001f_35%,#3b0017_70%,#050008_100%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-10">
        <nav className="mb-14 flex items-center justify-between">
          <Link
            href="/"
            className={`${orbitron.className} text-lg font-black tracking-widest sm:text-xl`}
          >
            TCHS<span className="text-red-500">CAR</span>CLUB
          </Link>

          <Link
            href="/signup"
            className="text-sm uppercase tracking-widest text-neutral-300 transition hover:text-red-300"
          >
            Sign Up
          </Link>
        </nav>

        <section className="mb-8">
          <p
            className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
          >
            Member Access
          </p>

          <h1
            className={`${bebas.className} mt-2 text-6xl tracking-wide md:text-8xl`}
          >
            Login
          </h1>

          <p className="mt-4 max-w-2xl text-neutral-300">
            Log in to access member features and future volunteer signup tools.
          </p>
        </section>

        <form
          onSubmit={handleLogin}
          className="border border-purple-400/25 bg-black/45 p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur"
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Email
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="student@email.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Password
              </span>
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="Your password"
              />
            </label>

            {error && (
              <p className="border border-red-400/40 bg-red-600/15 p-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className={`${orbitron.className} bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] transition hover:scale-[1.02] hover:shadow-[0_0_45px_rgba(239,68,68,0.8)] disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}