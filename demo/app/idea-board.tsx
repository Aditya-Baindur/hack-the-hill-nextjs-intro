"use client";

import { useState, type FormEvent } from "react";

type Idea = { id: number; title: string };

const initialIdeas: Idea[] = [
  { id: 1, title: "Campus food map" },
  { id: 2, title: "Study buddy finder" },
];

export default function IdeaBoard() {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [title, setTitle] = useState("");

  function addIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) return;

    setIdeas((current) => [
      ...current,
      { id: Date.now(), title: nextTitle },
    ]);
    setTitle("");
  }

  return (
    <section className="board" aria-label="Hackathon ideas">
      <h2>Ideas so far</h2>
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
          />
          <button type="submit">Add idea</button>
        </div>
      </form>
      <p className="footnote">Ideas reset when you refresh this demo.</p>
    </section>
  );
}
