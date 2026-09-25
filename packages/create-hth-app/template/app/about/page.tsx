import Link from "next/link";

export default function About() {
  return (
    <main className="shell">
      <nav className="nav">
        <span className="brand">HACK THE HILL</span>
        <Link href="/">Back home</Link>
      </nav>
      <header className="hero">
        <p className="eyebrow">ABOUT THIS DEMO</p>
        <h1>One folder, one more page.</h1>
        <p>
          This URL comes from <code>app/about/page.tsx</code>. The idea board
          calls a Cloudflare Worker, which saves each idea in D1.
        </p>
      </header>
    </main>
  );
}
