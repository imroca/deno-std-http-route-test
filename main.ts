import { type Route, route } from "@std/http/route";
import { serveDir } from "@std/http/file-server";
import { api } from "./api.ts";

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/api/v1/todos" }),
    handler: api.todos.getOrCreateItem,
  },
  {
    pattern: new URLPattern({ pathname: "/api/v1/todos/:ulid/edit" }),
    handler: api.todos.patchItem,
  },
  {
    pattern: new URLPattern({ pathname: "/api/v1/todos/:ulid" }),
    handler: api.todos.getOrDeleteItem,
  },
  {
    pattern: new URLPattern({ pathname: "/" }),
    handler: (req: Request) => serveDir(req, { fsRoot: "public" }),
  },
];

function defaultHandler(_req: Request) {
  return new Response("Not found", { status: 404 });
}

await Deno.serve(
  route(routes, defaultHandler),
).finished;
