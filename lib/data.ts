// Portfolio content. Later these functions can query PostgreSQL instead of
// returning hard-coded data — page.tsx won't need to change.

export type Profile = {
  name: string;
  username: string;
  bio: string;
  location: string;
  school: string;
  email: string;
  github: string;
  avatar: string;
  skills: string[];
  instagram: string;
};

export type Project = {
  title: string;
  url: string;
  linkText: string;
  description: string;
};

export type Portfolio = {
  profile: Profile;
  about: string;
  experience: string[];
  projects: Project[];
  achievements: string[];
};

export async function getPortfolio(): Promise<Portfolio> {
  return {
    profile: {
      name: "Tanny Dev",
      username: "@StoopidDev",
      bio: "Hi! I'm Tan, a stupid web developer.",
      location: "Samutprakan, Thailand",
      school: "Sarasas Witaed Suksa",
      email: "chantuchrealemail@gmail.com",
      github: "https://github.com",
      avatar: "/tanny.jpg",
      skills: ["HTML", "CSS", "JavaScript", "TypeScript", "Next.js", "Tailwind"],
      instagram: "https://www.instagram.com/asawachananont/",
    },
    about: "Hello! I'm a student interested in Computer Science. Please Click Here if you want to know more about me.",
    experience: ["Student", "School Student"],
    projects: [
      {
        title: "My First Website",
        url: "https://supwatch.winpim.workers.dev/",
        linkText: "SUPWATCH",
        description: ", a simple web application about E-commerce for Luxury Watches",
      },
    ],
    achievements: ["Joined a coding workshop", "Built my first portfolio"],
  };
}
