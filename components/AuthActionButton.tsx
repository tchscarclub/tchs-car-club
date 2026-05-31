"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { Orbitron } from "next/font/google";
import { auth } from "@/lib/firebase";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function AuthActionButton() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) {
    return null;
  }

  return (
    <Link
      href={user ? "/dashboard" : "/signup"}
      className={`${orbitron.className} mt-8 inline-block rounded-sm bg-white px-7 py-3.5 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_35px_rgba(255,255,255,0.3)] transition hover:-translate-y-1 hover:scale-105 hover:bg-red-500 hover:text-white hover:shadow-[0_0_55px_rgba(239,68,68,0.75)]`}
    >
      {user ? "Go To Dashboard" : "Sign Up"}
    </Link>
  );
}