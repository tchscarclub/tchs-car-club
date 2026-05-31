"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Orbitron } from "next/font/google";
import { auth, db } from "@/lib/firebase";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Volunteer", href: "/volunteer" },
];

type UserProfile = {
  name?: string;
  email?: string;
  role?: string;
};

export default function PublicNav() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const profileSnap = await getDoc(doc(db, "users", currentUser.uid));

        if (profileSnap.exists()) {
          setProfile(profileSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  }

  const displayName =
    profile?.name || user?.displayName || user?.email || "User";

  return (
    <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
      <Link
        href="/"
        className={`${orbitron.className} text-lg font-black tracking-widest sm:text-xl`}
      >
        TCHS<span className="text-red-500">CAR</span>CLUB
      </Link>

      <div className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-widest text-neutral-300 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="transition hover:text-red-400"
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-widest">
        {checking ? null : user ? (
          <>
            <span className="max-w-[220px] truncate text-neutral-300">
              Logged in as:{" "}
              <span className="text-purple-200 normal-case">
                {displayName}
              </span>
            </span>

            <Link
              href="/dashboard"
              className="text-neutral-300 transition hover:text-red-300"
            >
              Dashboard
            </Link>

            {(profile?.role === "admin" || profile?.role === "officer") && (
              <Link
                href="/admin"
                className="text-neutral-300 transition hover:text-red-300"
              >
                Admin
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="text-neutral-300 transition hover:text-red-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-neutral-300 transition hover:text-red-300"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-sm border border-red-400/70 bg-red-600/20 px-5 py-2 font-bold text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition hover:scale-105 hover:bg-red-600 hover:shadow-[0_0_35px_rgba(239,68,68,0.75)]"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}