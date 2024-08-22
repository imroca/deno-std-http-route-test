# Tipical ToDo app

This is a tipical todo app made to try the new @std/http/route package.

Backend stack:
* [Deno](https://docs.deno.com/) 
* [Deno KV](https://docs.deno.com/deploy/kv/manual/)
* [@std/http/route](https://jsr.io/@std/http/doc/~/route)
* [@std/http/file-server](https://jsr.io/@std/http/doc/~/serveFile)
* [@std/ulid](https://jsr.io/@std/ulid)

Frontend stack:
* [Pico CSS](https://picocss.com/)
* [Htmx](https://htmx.org/)
* [Alpinejs](https://alpinejs.dev/)

## Usage

Run this `deno` command on the root of the project

```shell
deno run -A --watch --unstable-kv main.ts
```
