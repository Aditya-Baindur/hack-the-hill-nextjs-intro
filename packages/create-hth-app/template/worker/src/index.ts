type Idea = { id: number; title: string };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: corsHeaders });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname !== "/ideas") return json({ error: "Not found" }, 404);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      if (request.method === "GET") {
        const { results } = await env.DB.prepare(
          "SELECT id, title FROM ideas ORDER BY id DESC LIMIT 100",
        ).all<Idea>();
        return json(results);
      }

      if (request.method === "POST") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json({ error: "Send valid JSON" }, 400);
        }
        const title =
          typeof body === "object" && body !== null && "title" in body &&
          typeof body.title === "string"
            ? body.title.trim()
            : "";
        if (title.length < 1 || title.length > 120) {
          return json({ error: "Title must be 1–120 characters" }, 400);
        }

        const result = await env.DB.prepare(
          "INSERT INTO ideas (title) VALUES (?)",
        ).bind(title).run();
        return json({ id: result.meta.last_row_id, title }, 201);
      }

      return json({ error: "Method not allowed" }, 405);
    } catch (error) {
      console.error(JSON.stringify({
        event: "ideas_request_failed",
        message: error instanceof Error ? error.message : String(error),
      }));
      return json({ error: "Something went wrong" }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
