import type { Profile } from "@/lib/data";

function Str({ children }: { children: string }) {
  return <span className="text-amber-300">&quot;{children}&quot;</span>;
}

// Editor-style card that shows the profile as a TypeScript object.
export default function CodeWindow({ profile }: { profile: Profile }) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#141414] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-emerald-500" />
        <span className="ml-3 font-mono text-xs text-zinc-500">about-me.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-zinc-200">
        <code>
          <span className="text-purple-400">const</span>{" "}
          <span className="text-sky-300">me</span> = {"{"}
          {"\n  "}name: <Str>{profile.name}</Str>,
          {"\n  "}handle: <Str>{profile.username}</Str>,
          {"\n  "}location: <Str>{profile.location}</Str>,
          {"\n  "}school: <Str>{profile.school}</Str>,
          {"\n  "}skills: [
          {profile.skills.map((skill, i) => (
            <span key={skill}>
              {i % 3 === 0 ? "\n    " : " "}
              <Str>{skill}</Str>,
            </span>
          ))}
          {"\n  "}],
          {"\n  "}learning: <span className="text-emerald-400">true</span>,
          {"\n"}
          {"};"}
        </code>
      </pre>
    </div>
  );
}
