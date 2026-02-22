export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Job {
  id: string;
  domainId: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  techStack?: string[];
}

export const DOMAINS: Domain[] = [
  { id: "fe", name: "Frontend", description: "React, TypeScript, UI/UX", icon: "🎨" },
  { id: "be", name: "Backend", description: "Node.js, Python, APIs", icon: "⚙️" },
  { id: "fullstack", name: "Full Stack", description: "End-to-end development", icon: "🚀" },
  { id: "ml", name: "ML/AI", description: "Machine learning, NLP", icon: "🧠" },
  { id: "devops", name: "DevOps", description: "Cloud, CI/CD, infrastructure", icon: "☁️" },
];

export const JOBS: Job[] = [
  {
    id: "j1",
    domainId: "fullstack",
    title: "Senior Full Stack Engineer",
    company: "TechCorp",
    description: "Build and scale web applications. Strong React and Node.js required.",
    requirements: ["4+ years React", "Node.js", "System design"],
    techStack: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
  },
  {
    id: "j2",
    domainId: "fe",
    title: "Frontend Engineer",
    company: "StartupXYZ",
    description: "Create beautiful, performant UIs with React and TypeScript.",
    requirements: ["3+ years React", "TypeScript", "CSS"],
    techStack: ["React", "TypeScript", "TailwindCSS", "Next.js"],
  },
  {
    id: "j3",
    domainId: "be",
    title: "Backend Engineer",
    company: "DataFlow",
    description: "Design APIs and data pipelines. Python or Node.js.",
    requirements: ["Python/Node", "SQL", "APIs"],
    techStack: ["Python", "Node.js", "PostgreSQL", "Redis", "Docker"],
  },
  {
    id: "j4",
    domainId: "ml",
    title: "ML Engineer",
    company: "AI Labs",
    description: "Train and deploy ML models. NLP experience preferred.",
    requirements: ["Python", "PyTorch/TF", "NLP"],
    techStack: ["Python", "PyTorch", "TensorFlow", "NLP", "GCP"],
  },
  {
    id: "j5",
    domainId: "fullstack",
    title: "Full Stack Developer",
    company: "BuildCo",
    description: "Full-stack role with React and Express.",
    requirements: ["React", "Express", "PostgreSQL"],
    techStack: ["React", "Express", "PostgreSQL", "MongoDB"],
  },
];
