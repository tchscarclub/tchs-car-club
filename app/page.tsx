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

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Volunteer", href: "/volunteer" },
  { name: "Login", href: "/login" },
];

const features = [
  {
    title: "Volunteer",
    text: "Earn service hours by helping with school events, community activities, and club-supported opportunities.",
  },
  {
    title: "Connect",
    text: "Meet students who share an interest in cars, builds, design, engineering, and automotive culture.",
  },
  {
    title: "Learn",
    text: "Explore car culture through meetings, showcases, workshops, and student-led discussions.",
  },
];

const events = [
  {
    title: "Weekly Meetings",
    tag: "Wednesdays",
    text: "Meet during B-Lunch in room 506 to talk cars, plan events, and connect with other members.",
  },
  {
    title: "Volunteer Events",
    tag: "Service",
    text: "Help the school and community while earning service hours through club volunteering.",
  },
  {
    title: "Car Culture",
    tag: "Community",
    text: "A welcoming space for students interested in automotive culture, whether experienced or just starting.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.42),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(239,68,68,0.32),transparent_28%),linear-gradient(135deg,#050008_0%,#16001f_33%,#3b0017_67%,#050008_100%)]" />
      <div className="absolute inset-0 opacity-20 retro-grid" />
      <div className="absolute left-[-10%] top-[18%] h-72 w-72 rounded-full bg-purple-600/25 blur-3xl glow-float" />
      <div className="absolute right-[-10%] top-[48%] h-80 w-80 rounded-full bg-red-600/20 blur-3xl glow-float-delayed" />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className={`${orbitron.className} text-lg font-black tracking-widest sm:text-xl`}
          >
            TCHS<span className="text-red-500">CAR</span>CLUB
          </Link>

          <div className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-widest text-neutral-300 md:flex">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="transition hover:text-red-400">
                {link.name}
              </Link>
            ))}
          </div>

          <Link
            href="/signup"
            className="rounded-sm border border-red-400/70 bg-red-600/20 px-5 py-2 text-sm font-bold uppercase tracking-widest text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition hover:scale-105 hover:bg-red-600 hover:shadow-[0_0_35px_rgba(239,68,68,0.75)]"
          >
            Sign Up
          </Link>
        </nav>

        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-10 md:grid-cols-[1.05fr_0.95fr] md:pt-16">
          {/* Left side */}
          <div>
            <div
              className={`${orbitron.className} mb-5 inline-block border border-purple-400/45 bg-black/35 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.3)] backdrop-blur sm:text-xs`}
              style={{
                clipPath:
                  "polygon(0 0, 94% 0, 100% 35%, 100% 100%, 6% 100%, 0 65%)",
              }}
            >
              Student Led • Built Different
            </div>

            <h1
              className={`${bebas.className} text-[clamp(4rem,11vw,8.5rem)] leading-[0.82] tracking-wide`}
            >
              <span className="block bg-gradient-to-r from-white via-purple-200 to-red-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.2)]">
                CAR
              </span>

              <span className="block bg-gradient-to-r from-red-500 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                CLUB
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-200 md:text-lg">
              At Timber Creek Car Club we aim to create an exciting and
              welcoming environment for those who are interested, or looking to
              get into automotive culture. We also provide a great opportunity
              for students to receive service hours by volunteering with us!
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/volunteer"
                className={`${orbitron.className} group relative overflow-hidden rounded-sm bg-red-600 px-6 py-3.5 text-center text-sm font-black uppercase tracking-widest text-white shadow-[0_0_28px_rgba(239,68,68,0.55)] transition hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(239,68,68,0.85)]`}
                style={{
                  clipPath:
                    "polygon(0 0, 92% 0, 100% 30%, 100% 100%, 8% 100%, 0 70%)",
                }}
              >
                <span className="relative z-10">Volunteer</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full" />
              </Link>

              <Link
                href="/about"
                className={`${orbitron.className} rounded-sm border border-purple-300/70 bg-purple-700/20 px-6 py-3.5 text-center text-sm font-black uppercase tracking-widest text-purple-100 shadow-[0_0_24px_rgba(168,85,247,0.35)] transition hover:-translate-y-1 hover:scale-[1.03] hover:bg-purple-600/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.7)]`}
                style={{
                  clipPath:
                    "polygon(8% 0, 100% 0, 92% 100%, 0 100%, 0 28%)",
                }}
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right side info panel */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div
              className="relative min-h-[360px] border border-white/12 bg-black/30 p-5 shadow-[0_0_40px_rgba(168,85,247,0.18)] backdrop-blur-md hero-card"
              style={{
                clipPath:
                  "polygon(7% 0, 100% 0, 94% 18%, 100% 35%, 91% 100%, 0 93%, 5% 70%, 0 45%)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-red-600/20" />

              <div className="relative z-10">
                <div
                  className={`${orbitron.className} text-xs uppercase tracking-[0.32em] text-red-300 sm:text-sm`}
                >
                  Car Club Info
                </div>

                <div className="mt-6 rounded-sm border border-red-400/35 bg-red-600/10 p-4 shadow-[0_0_22px_rgba(239,68,68,0.18)]">
                  <p
                    className={`${bebas.className} text-5xl leading-none tracking-wide sm:text-6xl`}
                  >
                    Every Week!
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-widest text-neutral-300 sm:text-sm">
                    Wednesdays during, B-Lunch in room 506
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="min-h-[112px] border border-purple-400/35 bg-purple-600/12 p-4 shadow-[0_0_18px_rgba(168,85,247,0.18)] skew-box">
                    <p
                      className={`${orbitron.className} text-[10px] uppercase tracking-widest text-purple-200 sm:text-xs`}
                    >
                      Contact Number
                    </p>

                    <p className="mt-3 text-sm leading-6 text-neutral-200">
                      +1 (689) 237-8806
                    </p>
                  </div>

                  <div className="min-h-[112px] border border-red-400/35 bg-red-600/12 p-4 shadow-[0_0_18px_rgba(239,68,68,0.18)] skew-box-alt">
                    <p
                      className={`${orbitron.className} text-[10px] uppercase tracking-widest text-red-200 sm:text-xs`}
                    >
                      Club Email
                    </p>

                    <p className="mt-3 break-words text-sm leading-6 text-neutral-200">
                      tchscarclub@gmail.com
                    </p>
                  </div>
                </div>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-red-500 to-purple-400 shadow-[0_0_20px_rgba(239,68,68,0.55)] loading-bar" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-5 md:grid-cols-3">
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
                <p className={`${bebas.className} text-4xl tracking-wide text-white`}>
                  {feature.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-neutral-300 md:text-base">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Club activity */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p
                className={`${orbitron.className} text-xs uppercase tracking-[0.35em] text-red-300`}
              >
                What We Do
              </p>
              <h2 className={`${bebas.className} mt-2 text-5xl tracking-wide md:text-6xl`}>
                Club Activity
              </h2>
            </div>

            <Link
              href="/events"
              className="hidden text-sm uppercase tracking-widest text-neutral-300 transition hover:text-red-300 md:block"
            >
              View Events →
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

                <p
                  className={`${orbitron.className} text-xs uppercase tracking-[0.3em] text-red-300`}
                >
                  {event.tag}
                </p>

                <h3 className={`${bebas.className} relative mt-4 text-4xl tracking-wide`}>
                  {event.title}
                </h3>

                <p className="relative mt-3 text-sm leading-7 text-neutral-300 md:text-base">
                  {event.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div
            className="relative overflow-hidden border border-red-400/40 bg-black/45 p-8 text-center shadow-[0_0_60px_rgba(239,68,68,0.25)] backdrop-blur md:p-10"
            style={{
              clipPath:
                "polygon(4% 0, 96% 0, 100% 18%, 97% 100%, 5% 94%, 0 78%, 3% 25%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/25 via-purple-600/25 to-red-600/25" />

            <div className="relative z-10">
              <h2 className={`${bebas.className} text-5xl tracking-wide md:text-7xl`}>
                Join The Club
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-200 md:text-base">
                Whether you are into cars already or just starting to get
                interested, Timber Creek Car Club is a place to meet people,
                learn more, and get involved through volunteering.
              </p>

              <Link
                href="/signup"
                className={`${orbitron.className} mt-8 inline-block rounded-sm bg-white px-7 py-3.5 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_35px_rgba(255,255,255,0.3)] transition hover:-translate-y-1 hover:scale-105 hover:bg-red-500 hover:text-white hover:shadow-[0_0_55px_rgba(239,68,68,0.75)]`}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 px-6 py-8 text-center text-xs uppercase tracking-widest text-neutral-500 md:text-sm">
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
            transform: translateY(-18px) scale(1.05);
          }
        }

        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0) rotate(-1deg);
          }
          50% {
            transform: translateY(-8px) rotate(1deg);
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