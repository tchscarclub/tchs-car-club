import Link from "next/link";
import { Bebas_Neue, Orbitron } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const features = [
  {
    title: "Volunteer",
    text: "Earn service hours through school and community car club events.",
  },
  {
    title: "Connect",
    text: "Meet students who share an interest in cars, builds, racing, and engineering.",
  },
  {
    title: "Showcase",
    text: "Future events can include car meets, displays, workshops, and club projects.",
  },
];

const events = [
  {
    title: "First Club Meeting",
    tag: "Coming Soon",
  },
  {
    title: "Volunteer Event",
    tag: "Planning",
  },
  {
    title: "Car Showcase Day",
    tag: "Future",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.45),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(239,68,68,0.38),transparent_28%),linear-gradient(135deg,#050008_0%,#180020_35%,#3b0016_65%,#050008_100%)]" />
      <div className="absolute inset-0 opacity-25 retro-grid" />
      <div className="absolute left-[-10%] top-[20%] h-72 w-72 rounded-full bg-purple-600/30 blur-3xl glow-float" />
      <div className="absolute right-[-8%] top-[50%] h-80 w-80 rounded-full bg-red-600/25 blur-3xl glow-float-delayed" />

      {/* Main content wrapper */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className={`${orbitron.className} text-xl font-black tracking-widest`}>
            TCHS<span className="text-red-500">CAR</span>CLUB
          </Link>

          <div className="hidden items-center gap-7 text-sm font-semibold uppercase tracking-widest text-neutral-300 md:flex">
            <Link href="/" className="hover:text-red-400">Home</Link>
            <Link href="/about" className="hover:text-red-400">About</Link>
            <Link href="/events" className="hover:text-red-400">Events</Link>
            <Link href="/volunteer" className="hover:text-red-400">Volunteer</Link>
            <Link href="/login" className="hover:text-red-400">Login</Link>
          </div>

          <Link
            href="/signup"
            className="rounded-sm border border-red-400/70 bg-red-600/20 px-5 py-2 text-sm font-bold uppercase tracking-widest text-red-100 shadow-[0_0_25px_rgba(239,68,68,0.45)] transition hover:scale-105 hover:bg-red-600 hover:shadow-[0_0_40px_rgba(239,68,68,0.8)]"
          >
            Sign Up
          </Link>
        </nav>

        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <div
              className={`${orbitron.className} mb-6 inline-block border border-purple-400/50 bg-black/40 px-5 py-2 text-xs font-bold uppercase tracking-[0.35em] text-purple-200 shadow-[0_0_25px_rgba(168,85,247,0.35)] backdrop-blur`}
              style={{
                clipPath: "polygon(0 0, 94% 0, 100% 35%, 100% 100%, 6% 100%, 0 65%)",
              }}
            >
              Student Led • Built Different
            </div>

            <h1
              className={`${bebas.className} max-w-4xl text-[clamp(5rem,14vw,11rem)] leading-[0.82] tracking-wide`}
            >
              CAR
              <span className="block bg-gradient-to-r from-red-500 via-purple-400 to-red-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
                CLUB
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-200 md:text-xl">
              A modern school club website with a throwback street-racing feel:
              volunteer opportunities, student community, upcoming events, and
              member features coming soon.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/volunteer"
                className={`${orbitron.className} group relative overflow-hidden rounded-sm bg-red-600 px-7 py-4 text-center text-sm font-black uppercase tracking-widest text-white shadow-[0_0_35px_rgba(239,68,68,0.65)] transition hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_55px_rgba(239,68,68,0.95)]`}
                style={{
                  clipPath: "polygon(0 0, 92% 0, 100% 30%, 100% 100%, 8% 100%, 0 70%)",
                }}
              >
                <span className="relative z-10">View Volunteer</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full" />
              </Link>

              <Link
                href="/about"
                className={`${orbitron.className} rounded-sm border border-purple-300/70 bg-purple-700/20 px-7 py-4 text-center text-sm font-black uppercase tracking-widest text-purple-100 shadow-[0_0_30px_rgba(168,85,247,0.45)] transition hover:-translate-y-1 hover:scale-[1.03] hover:bg-purple-600/40 hover:shadow-[0_0_50px_rgba(168,85,247,0.8)]`}
                style={{
                  clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%, 0 28%)",
                }}
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Angular visual panel */}
          <div className="relative mx-auto w-full max-w-lg">
            <div
              className="relative min-h-[430px] border border-white/15 bg-black/35 p-6 shadow-[0_0_60px_rgba(168,85,247,0.25)] backdrop-blur-md hero-card"
              style={{
                clipPath:
                  "polygon(7% 0, 100% 0, 94% 18%, 100% 35%, 91% 100%, 0 93%, 5% 70%, 0 45%)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/25 via-transparent to-red-600/25" />

              <div className="relative z-10">
                <div className={`${orbitron.className} text-sm uppercase tracking-[0.35em] text-red-300`}>
                  Design Preview
                </div>

                <div className="mt-8 rounded-sm border border-red-400/40 bg-red-600/10 p-5 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
                  <p className={`${bebas.className} text-6xl leading-none tracking-wide`}>
                    2000s
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-widest text-neutral-300">
                    retro energy / modern layout
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="h-28 border border-purple-400/40 bg-purple-600/15 p-4 shadow-[0_0_25px_rgba(168,85,247,0.25)] skew-box">
                    <p className={`${orbitron.className} text-xs uppercase tracking-widest text-purple-200`}>
                      Glow UI
                    </p>
                    <p className="mt-3 text-sm text-neutral-300">Animated buttons</p>
                  </div>

                  <div className="h-28 border border-red-400/40 bg-red-600/15 p-4 shadow-[0_0_25px_rgba(239,68,68,0.25)] skew-box-alt">
                    <p className={`${orbitron.className} text-xs uppercase tracking-widest text-red-200`}>
                      Sharp
                    </p>
                    <p className="mt-3 text-sm text-neutral-300">Angular sections</p>
                  </div>
                </div>

                <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-red-500 to-purple-400 shadow-[0_0_25px_rgba(239,68,68,0.7)] loading-bar" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group border border-white/10 bg-black/35 p-6 shadow-[0_0_35px_rgba(0,0,0,0.4)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-red-400/50 hover:bg-red-950/20 hover:shadow-[0_0_45px_rgba(239,68,68,0.35)]"
                style={{
                  clipPath:
                    index % 2 === 0
                      ? "polygon(0 0, 93% 0, 100% 20%, 100% 100%, 7% 100%, 0 80%)"
                      : "polygon(7% 0, 100% 0, 93% 100%, 0 100%, 0 20%)",
                }}
              >
                <p className={`${bebas.className} text-5xl tracking-wide text-white`}>
                  {feature.title}
                </p>
                <p className="mt-4 text-neutral-300">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Events preview */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}>
                Upcoming
              </p>
              <h2 className={`${bebas.className} mt-2 text-6xl tracking-wide`}>
                Club Events
              </h2>
            </div>

            <Link href="/events" className="hidden text-sm uppercase tracking-widest text-neutral-300 hover:text-red-300 md:block">
              View All →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.title}
                className="group relative overflow-hidden border border-purple-400/25 bg-purple-950/25 p-6 shadow-[0_0_35px_rgba(168,85,247,0.2)] transition hover:-translate-y-2 hover:border-red-400/60 hover:shadow-[0_0_45px_rgba(239,68,68,0.35)]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 94% 100%, 0 92%)",
                }}
              >
                <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-700 group-hover:translate-x-[120%]" />

                <p className={`${orbitron.className} text-xs uppercase tracking-[0.3em] text-red-300`}>
                  {event.tag}
                </p>
                <h3 className={`${bebas.className} relative mt-4 text-4xl tracking-wide`}>
                  {event.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div
            className="relative overflow-hidden border border-red-400/40 bg-black/45 p-10 text-center shadow-[0_0_65px_rgba(239,68,68,0.3)] backdrop-blur"
            style={{
              clipPath:
                "polygon(4% 0, 96% 0, 100% 18%, 97% 100%, 5% 94%, 0 78%, 3% 25%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/25 via-purple-600/25 to-red-600/25" />

            <div className="relative z-10">
              <h2 className={`${bebas.className} text-6xl tracking-wide md:text-8xl`}>
                Ready To Roll?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-neutral-200">
                This is the first visual direction for the site. Login, signup,
                volunteer tracking, and member dashboards can be added after the
                design is approved.
              </p>

              <Link
                href="/signup"
                className={`${orbitron.className} mt-8 inline-block rounded-sm bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_40px_rgba(255,255,255,0.35)] transition hover:-translate-y-1 hover:scale-105 hover:bg-red-500 hover:text-white hover:shadow-[0_0_60px_rgba(239,68,68,0.8)]`}
              >
                Preview Sign Up
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 px-6 py-8 text-center text-sm uppercase tracking-widest text-neutral-500">
          © 2026 TCHS Car Club — Built by Students
        </footer>
      </div>

      <style>{`
        .retro-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 42px 42px;
          transform: perspective(500px) rotateX(58deg) translateY(-120px);
          transform-origin: top;
          animation: gridMove 12s linear infinite;
        }

        .glow-float {
          animation: glowFloat 7s ease-in-out infinite;
        }

        .glow-float-delayed {
          animation: glowFloat 8s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .hero-card {
          animation: cardFloat 5s ease-in-out infinite;
        }

        .skew-box {
          transform: rotate(-2deg);
        }

        .skew-box-alt {
          transform: rotate(2deg);
        }

        .loading-bar {
          animation: barPulse 2.2s ease-in-out infinite;
        }

        @keyframes gridMove {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 42px;
          }
        }

        @keyframes glowFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-24px) scale(1.08);
          }
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0) rotate(-1deg);
          }
          50% {
            transform: translateY(-12px) rotate(1deg);
          }
        }

        @keyframes barPulse {
          0%, 100% {
            width: 55%;
            opacity: 0.75;
          }
          50% {
            width: 88%;
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}