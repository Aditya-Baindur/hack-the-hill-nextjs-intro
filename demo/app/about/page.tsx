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
          This URL comes from <code>app/about/page.tsx</code>. The idea board on
          the homepage is a Client Component because its form uses state.
        </p>
      </header>
    </main>
  );
}
