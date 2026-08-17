---
title: Wandern
tags:
    - python
    - cli
    - databases
    - migrations
    - postgresql
    - typer
---

Wandern (German for *hiking*, or *migrating*) is a lightweight CLI tool for database migrations in Python.
Migrations are plain SQL files that you write yourself. No DSL, no ORM in the way.
Wandern handles versioning, ordering, and applying them, including automatic detection of circular dependencies and divergent revisions. It supports SQLite, PostgreSQL and MySQL.
Wandern also has a cool little CLI app made with [Typer](https://typer.tiangolo.com/) and [Rich](https://rich.readthedocs.io/en/stable/) that lets you view and filter migrations by author or tag, or draft a migration for you using the previous migration context from a plaintext prompt if you BYOK (bring your own LLM key).

```bash
uv add wandern

wandern init
wandern generate --message "create users table"
wandern up
```

Read more about Wandern in the [README](https://github.com/s-bose/wandern#readme).

![GitHub Repo Card](https://githubcard.com/s-bose/wandern.svg)
