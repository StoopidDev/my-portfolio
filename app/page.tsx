import Image from "next/image";
import CodeWindow from "@/app/components/CodeWindow";
import FloatingBackground from "@/app/components/FloatingBackground";
import FollowButton from "@/app/components/FollowButton";
import ProjectLink from "@/app/components/ProjectLink";
import Reveal from "@/app/components/Reveal";
import { getPortfolio } from "@/lib/data";

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-6 font-mono text-sm text-emerald-400">
      <span className="text-zinc-600">## </span>
      {children}
    </h2>
  );
}

const panel = "rounded-xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm";

export default async function Home() {
  const { profile, about, experience, projects, achievements } = await getPortfolio();

  return (
    <>
      <FloatingBackground src={profile.avatar} />

      {/* LANDING: wide hero card centered in the first screen */}
      <div className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-2 py-16 sm:px-4">
        <div className={`overflow-hidden ${panel}`}>
          <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
            <a href="#" className="flex items-center gap-3">
              <Image
                src={profile.avatar}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full border border-white/10 object-cover"
              />
              <span className="font-mono text-sm text-zinc-300">~/{profile.username.slice(1)}</span>
            </a>
            <nav className="flex items-center gap-2">
              <a
                href="#projects"
                className="hidden rounded-md border border-white/15 px-4 py-1.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-white/30 sm:block"
              >
                Projects
              </a>
              <FollowButton />
            </nav>
          </header>

          <section className="fade-up grid grid-cols-1 items-center gap-10 px-6 py-12 sm:px-12 md:grid-cols-2 md:gap-12 [&>*]:min-w-0">
            <div>
              <p className="font-mono text-sm text-emerald-400">$ whoami</p>
              <h1 className="mt-3 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                {profile.name}
              </h1>
              <p className="mt-3 text-lg text-zinc-400">{profile.bio}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener"
                  className="rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
                >
                  GitHub
                </a>
                <a
                  href="#projects"
                  className="rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30"
                >
                  Projects
                </a>
              </div>
            </div>
            <div className="hidden sm:block">
              <CodeWindow profile={profile} />
            </div>
          </section>
        </div>

        <a
          href="#about"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-400"
        >
          scroll
          <span className="animate-bounce text-base">↓</span>
        </a>
      </div>

      {/* CONTENT: revealed while scrolling */}
      <div className="mx-auto max-w-6xl space-y-16 px-2 pb-16 sm:px-4 md:space-y-24">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <Reveal className="h-full">
            <section id="about" className={`h-full scroll-mt-4 p-6 sm:p-12 ${panel}`}>
              <SectionTitle>about</SectionTitle>
              <p className="leading-7 text-zinc-300">{about}</p>
            </section>
          </Reveal>
          <Reveal className="h-full" delay={150}>
            <section className={`h-full p-6 sm:p-12 ${panel}`}>
              <SectionTitle>experience</SectionTitle>
              <ul className="space-y-3">
                {experience.map((item) => (
                  <li key={item} className="flex gap-3 text-zinc-300">
                    <span className="font-mono text-emerald-400">▹</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        <Reveal>
          <section id="projects" className={`scroll-mt-4 p-6 sm:p-12 ${panel}`}>
            <SectionTitle>projects</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectLink
                  key={project.title}
                  href={project.url}
                  className="group rounded-xl border border-white/10 bg-[#141414] p-5 transition hover:-translate-y-1 hover:border-emerald-500/60"
                >
                  <h3 className="font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    <span className="text-emerald-400">{project.linkText}</span>
                    {project.description}
                  </p>
                  <p className="mt-4 font-mono text-xs text-zinc-500 transition-colors group-hover:text-emerald-400">
                    visit →
                  </p>
                </ProjectLink>
              ))}
            </div>
          </section>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          <Reveal className="h-full">
            <section className={`h-full p-6 sm:p-12 ${panel}`}>
              <SectionTitle>achievements</SectionTitle>
              <ul className="space-y-3">
                {achievements.map((item) => (
                  <li key={item} className="flex gap-3 text-zinc-300">
                    <span className="font-mono text-emerald-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
          <Reveal className="h-full" delay={150}>
            <section className={`h-full p-6 sm:p-12 ${panel}`}>
              <SectionTitle>contact</SectionTitle>
              <ul className="space-y-3 font-mono text-sm">
                <li>
                  <span className="text-zinc-500">email: </span>
                  <a href={`mailto:${profile.email}`} className="break-all text-zinc-200 hover:text-emerald-400">
                    {profile.email}
                  </a>
                </li>
                <li>
                  <span className="text-zinc-500">github: </span>
                  <a href={profile.github} target="_blank" rel="noopener" className="text-zinc-200 hover:text-emerald-400">
                    {profile.username}
                  </a>
                </li>
                <li>
                  <span className="text-zinc-500">location: </span>
                  <span className="text-zinc-200">{profile.location}</span>
                </li>
              </ul>
            </section>
          </Reveal>
        </div>

        <footer className="px-2 py-4 text-center font-mono text-xs text-zinc-600">
          © {profile.name} · built with Next.js + Tailwind
        </footer>
      </div>
    </>
  );
}
