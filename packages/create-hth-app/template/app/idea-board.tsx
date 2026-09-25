"use client";

import { useEffect, useState, type FormEvent } from "react";

type Idea = { id: number; title: string };

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default function IdeaBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/ideas`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load ideas");
        return response.json() as Promise<Idea[]>;
      })
      .then(setIdeas)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  async function addIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || saving) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle }),
      });
      if (!response.ok) throw new Error("Could not save idea");
      const idea = (await response.json()) as Idea;
      setIdeas((current) => [idea, ...current]);
      setTitle("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save idea");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="board" aria-label="Hackathon ideas">
      <h2>Ideas so far</h2>
      {loading ? <p role="status">Loading ideas…</p> : null}
      {error ? <p role="alert" className="error">{error}</p> : null}
      <ul className="idea-list">
        {ideas.map((idea) => (
          <li key={idea.id}>{idea.title}</li>
        ))}
      </ul>

      <form onSubmit={addIdea} className="idea-form">
        <label htmlFor="idea-title">Add your idea</label>
        <div className="form-row">
          <input
            id="idea-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Your next idea…"
            maxLength={120}
            required
          />
          <button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add idea"}
          </button>
        </div>
      </form>
      <p className="footnote">Saved in D1. Refresh the page to check.</p>
    </section>
  );
}
