"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Orbitron } from "next/font/google";
import { auth } from "@/lib/firebase";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

type NavLink = {
  label: string;
  href: string;
};

type AppNavProps = {
  links?: NavLink[];
  showBack?: boolean;
  showLogout?: boolean;
};

export default function AppNav({
  links = [],
  showBack = true,
  showLogout = true,
}: AppNavProps) {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  return (
    <nav className="mb-14 flex flex-wrap items-center justify-between gap-4">
      <Link
        href="/"
        className={`${orbitron.className} text-lg font-black tracking-widest sm:text-xl`}
      >
        TCHS<span className="text-red-500">CAR</span>CLUB
      </Link>

      <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-widest text-neutral-300">
        {showBack && (
          <button
            type="button"
            onClick={() => router.back()}
            className="transition hover:text-red-300"
          >
            Back
          </button>
        )}

        <Link href="/" className="transition hover:text-red-300">
          Home
        </Link>

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition hover:text-red-300"
          >
            {link.label}
          </Link>
        ))}

        {showLogout && (
          <button
            type="button"
            onClick={handleLogout}
            className="transition hover:text-red-300"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}