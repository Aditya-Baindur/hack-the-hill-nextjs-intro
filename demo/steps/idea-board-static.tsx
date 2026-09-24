type Idea = { id: number; title: string };

const ideas: Idea[] = [
  { id: 1, title: "Campus food map" },
  { id: 2, title: "Study buddy finder" },
];

export default function IdeaBoard() {
  return (
    <section className="board" aria-label="Hackathon ideas">
      <h2>Ideas so far</h2>
      <ul className="idea-list">
        {ideas.map((idea) => (
          <li key={idea.id}>{idea.title}</li>
        ))}
      </ul>
    </section>
  );
}
