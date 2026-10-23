"use client";

import { useState } from "react";

export default function FollowButton() {
  const [following, setFollowing] = useState(false);

  return (
    <button
      onClick={() => setFollowing(!following)}
      className={
        following
          ? "rounded-md border border-white/15 px-4 py-1.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-white/30"
          : "rounded-md bg-white px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
      }
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
