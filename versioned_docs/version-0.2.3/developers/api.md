---
sidebar_position: 5
title: "API (Connect-RPC)"
---

# API (Connect-RPC)

Openbeehive exposes its backend API through [Connect-RPC](https://connectrpc.com/). The contract is defined in Protocol Buffers, and a single set of `.proto` files drives both the gRPC and the HTTP/JSON interfaces, plus the generated client and server code.

If you only want to use the app, you never need to touch this page. It is here for self-hosters who want to script exports, and for developers building on top of Openbeehive.

## The proto contract is the source of truth

Everything starts from the schema under `proto/openbeehive/v1`. The messages, services and RPCs declared there define the entire API surface. Generated Go and TypeScript code is derived from these files, never hand-written, so the schema and the code can never drift apart.

When you change the API, you change the proto first, regenerate, then implement. Do not edit generated files by hand.

## Connect-RPC: one contract, two wire formats

Connect-RPC serves each RPC over two compatible protocols from the same endpoint:

- **gRPC** for native, streaming-friendly clients (Go, etc.).
- **HTTP/JSON** for plain HTTP clients: every RPC is reachable as a `POST` with a JSON body, so you can call it with `curl` or `fetch`.

This means you get an efficient binary protocol and a simple, debuggable JSON protocol without maintaining two APIs.

## Services

The contract is organised into the following services:

| Service | Purpose |
| --- | --- |
| `Apiary` | Create, read, update and delete apiaries. |
| `Hive` | Manage hives within apiaries. |
| `Queen` | Manage queens, including marking colour and lineage. |
| `Inspection` | Record and retrieve inspections (visits). |
| `Task` | Manage tasks. |
| `Stats` | Aggregate figures and summaries across your records. |
| `Event` | Read the append-only event log. |
| `Sync` | The endpoint the offline-first app uses to push and pull changes in the background. |

:::note
These are the only services. The service names above are the complete list; there are no hidden endpoints beyond them.
:::

## How the app uses the API

Openbeehive is offline-first. The SvelteKit PWA reads and writes through a **local-first repository** backed by a SQLite-WASM database in the browser (OPFS). Day-to-day app data never round-trips to the server on the critical path; it is local and instant, and it works with no signal.

The `Sync` service is what carries those local changes to the server (and other devices) in the background. For the details of how this stays conflict-free, see the [sync protocol](/developers/sync-protocol).

The per-entity CRUD RPCs (`Apiary`, `Hive`, `Queen`, and so on) are **server-authoritative** endpoints. The app itself does not use them for ordinary record-keeping. They exist for things like export, administration and integrations, where you want the server's authoritative view rather than a single device's local copy.

:::tip
If you are building a script, prefer reading through the CRUD and `Stats` services. Writing your own records through them is supported, but for normal beekeeping use the app, so that your changes flow through the conflict-free sync path.
:::

## Calling the API over HTTP/JSON

Every RPC maps to a URL of the form:

```text
POST {BEEHIVE_PUBLIC_BASE_URL}/openbeehive.v1.{Service}/{Method}
```

The request body is the RPC's request message as JSON, and the response body is the response message as JSON. Two headers matter:

- `Content-Type: application/json`
- a session or auth header, unless your self-host instance runs single-user with no login configured.

A minimal example using `curl`:

```bash
curl -X POST \
  http://localhost:8080/openbeehive.v1.Apiary/ListApiaries \
  -H "Content-Type: application/json" \
  -d '{}'
```

The exact method names and request fields for each service are defined in the proto files; treat those as the canonical reference for field names and shapes.

:::caution
Method names such as `ListApiaries` above are illustrative of the calling convention. Always confirm the actual RPC and message names against `proto/openbeehive/v1` before relying on them, since the proto is the single source of truth.
:::

### Authentication

The API uses the same session-based authentication as the app. If your instance is configured with OIDC providers or WebAuthn, requests must carry a valid session. If you run a single-user self-host with `BEEHIVE_OIDC_PROVIDERS` empty and `BEEHIVE_WEBAUTHN_ENABLED=false`, there is no login and calls are unauthenticated. See [authentication](/self-hosting/authentication) for the configuration details.

## Regenerating the stubs with buf

Code generation is driven by [buf](https://buf.build/). The repository wraps it in a `make` target:

```bash
make proto
```

This regenerates both the Go and the TypeScript code from `proto/openbeehive/v1`. Run it whenever you change a `.proto` file, and commit the regenerated output alongside the schema change.

You will need:

- Go 1.25 or newer
- Node 22 or newer
- `buf`

After regenerating, `make build` compiles the server binary (`./server/bin/openbeehive`). For the full setup, see [contributing](/developers/contributing).

:::note
Because Go and TypeScript are generated from the same contract, the backend and the frontend always agree on message shapes. A schema change that breaks one will surface in the other at build time, not at runtime.
:::

## Where to go next

- [Architecture overview](/developers/architecture) for how the API fits into the wider system.
- [Sync protocol](/developers/sync-protocol) for how offline changes reach the server.
- [Data model](/developers/data-model) for the entities behind the services.
