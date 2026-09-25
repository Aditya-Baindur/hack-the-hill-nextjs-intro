import Link from "next/link";
import IdeaBoard from "./idea-board";

export default function Home() {
  return (
    <main className="shell">
      <nav className="nav">
        <span className="brand">HACK THE HILL</span>
        <Link href="/about">About</Link>
      </nav>

      <header className="hero">
        <p className="eyebrow">YOUR WEEKEND STARTS HERE</p>
        <h1>Hackathon idea board</h1>
        <p>Next.js UI. Cloudflare Worker API. Ideas saved in D1.</p>
      </header>

      <IdeaBoard />
    </main>
  );
}
