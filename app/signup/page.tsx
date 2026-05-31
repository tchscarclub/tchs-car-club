"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Bebas_Neue, Orbitron } from "next/font/google";
import { auth, db } from "@/lib/firebase";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await setPersistence(auth, browserLocalPersistence);
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        name,
        email: user.email,
        graduationYear,
        role: "student",
        serviceHoursTotal: 0,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Could not create account. Check your email and password.");
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
            href="/login"
            className="text-sm uppercase tracking-widest text-neutral-300 transition hover:text-red-300"
          >
            Login
          </Link>
        </nav>

        <section className="mb-8">
          <p
            className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
          >
            Student Account
          </p>

          <h1
            className={`${bebas.className} mt-2 text-6xl tracking-wide md:text-8xl`}
          >
            Sign Up
          </h1>

          <p className="mt-4 max-w-2xl text-neutral-300">
            Create an account to access member features and eventually sign up
            for volunteer opportunities.
          </p>
        </section>

        <form
          onSubmit={handleSignup}
          className="border border-purple-400/25 bg-black/45 p-6 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur"
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Full Name
              </span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="Your name"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Graduation Year
              </span>
              <input
                required
                value={graduationYear}
                onChange={(event) => setGraduationYear(event.target.value)}
                className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="2027"
              />
            </label>

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
                placeholder="your-personal-email@email.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm uppercase tracking-widest text-neutral-300">
                Password
              </span>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-red-400"
                placeholder="At least 6 characters"
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}