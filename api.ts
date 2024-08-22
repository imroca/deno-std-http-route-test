import { ulid } from "@std/ulid";
import { Todo } from "./models.ts";

const kv = await Deno.openKv();

const api = {
  todos: {
    getOrCreateItem: async (req: Request): Promise<Response> => {
      if (req.method === "POST" && req.body) {
        const formdata = await req.formData();
        kv.set(["todos", ulid()], {
          description: formdata.get("description"),
          pending: true,
        });
        return new Response(null, {
          status: 204,
          headers: { "HX-Trigger": "todos" },
        });
      }

      const iter = kv.list<Todo>({ prefix: ["todos"] });
      let todos = "";
      let total = 0;
      let pending = 0;
      for await (const res of iter) {
        const id = res.key[1].toString();
        const isPending = res.value?.pending ? "check_circle" : "cancel";
        let description = res.value?.description.toString();
        total++;
        if (res.value?.pending) {
          description = `<ins>${description}</ins>`;
          pending++;
        } else {
          description = `<del>${description}</del>`;
        }
        todos += `<tr>
                    <td scope="row">${description}</td>
                    <td>
                        <a href="javascript:void(0);" hx-patch="/api/v1/todos/${id}/edit" hx-trigger="click"><span class="material-symbols-rounded">${isPending}</span></a> <a href="javascript:void(0);" hx-delete="/api/v1/todos/${id}" hx-trigger="click"><span class="material-symbols-rounded">delete</span></a>
                    </td>
                </tr>`;
      }

      if (!todos) {
        todos = `<tr><td colspan="2">No items added yet</td></tr>`;
      }

      return new Response(
        todos,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html",
            "HX-Trigger": JSON.stringify({ count: { total, pending } }),
          },
        },
      );
    },
    getOrDeleteItem: async (
      req: Request,
      _info?: Deno.ServeHandlerInfo,
      params?: URLPatternResult | null,
    ): Promise<Response> => {
      const ulid = params?.pathname.groups.ulid;
      if (!ulid) {
        return new Response("Not found", {
          status: 404,
        });
      }
      const todo = await kv.get(["todos", ulid]);
      console.log(todo);
      if (!todo.value && !todo.versionstamp) {
        return new Response("Not found", {
          status: 404,
        });
      }

      if (req.method === "DELETE") {
        await kv.delete(["todos", ulid]);
        return new Response(null, {
          status: 200,
          headers: { "HX-Trigger": "todos" },
        });
      } else {
        return Response.json({ todo: todo.value }, {
          status: 200,
        });
      }
    },
    patchItem: async (
      req: Request,
      _info?: Deno.ServeHandlerInfo,
      params?: URLPatternResult | null,
    ): Promise<Response> => {
      const ulid = params?.pathname.groups.ulid;
      if (!ulid) {
        return new Response("Not found", {
          status: 404,
        });
      }
      const todo = await kv.get<Todo>(["todos", ulid]);
      if (req.method === "PATCH" && todo) {
        await kv.set(["todos", ulid], {
          ...todo.value,
          pending: !todo.value?.pending,
        });
      }
      return new Response(null, {
        status: 200,
        headers: { "HX-Trigger": "todos" },
      });
    },
  },
};

export { api };
