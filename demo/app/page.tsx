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
        <p>Keep a small list of things you could build this weekend.</p>
      </header>

      <IdeaBoard />
    </main>
  );
}
