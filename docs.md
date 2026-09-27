---
layout: page
title: Docs
permalink: /docs/
description: "How to use this theme — set it up, add a collection, change what a page is made of, and put it on GitHub Pages."
sidebar: false
ad_rails: false
---

This site runs on **Imprint**, an open Jekyll theme. Everything you can see
here — thirteen content collections, the resume, the tag index, the search —
comes out of the box, and almost all of it is configured rather than coded.

If you are reading this because you want your own, start at
[Getting started](#getting-started). If you already have it running and want
to change something, the section you want is
[What a page is made of](#what-a-page-is-made-of).

{% include components/callout.html type="tip" title="The short version" text="Clone it, run `npm run setup`, answer the form, push to a repo named `username.github.io`. Everything below is detail you only need when you want something specific." %}

## Getting started

You need **Ruby 3.4** and **Node 18+**. The macOS system Ruby (2.6) cannot
build this site; `bin/serve` and `bin/build` put the right one on your PATH,
so use those rather than calling Jekyll directly.

```bash
git clone https://github.com/imswarnil/Personal-Website-Jekyll-Theme.git my-site
cd my-site
npm run setup      # a form opens in your browser
npm run dev        # http://localhost:4000
```

`npm run setup` is a local form — it binds to `127.0.0.1` only, nothing is
uploaded, and everything it replaces is copied to `.imprint-backup/` first.
It covers your name and bio, the accent colour, the header and footer,
navigation, social links, which collections you want, ads, analytics, the
newsletter endpoint and the domain. Run it again whenever you like.

### The commands

| Command | What it does |
| --- | --- |
| `npm run setup` | The browser setup form |
| `npm run dev` | Local server with live reload |
| `npm run build` | Production build into `_site/` |
| `npm run new` | Scaffold an entry in any collection |
| `npm run thumbs` | Redraw the generated cover art from your accent colour |
| `npm run doctor` | Check the config for the mistakes that break a build |
| `npm run check` | Doctor + build — what CI runs |

## Putting it on GitHub Pages

1. Create a repository. Name it **`username.github.io`** for a site at
   `https://username.github.io`, or anything you like for a project page at
   `https://username.github.io/repo-name/`.
2. Push this tree to `main`.
3. **Settings → Pages → Source: GitHub Actions.**

That is all. The workflow passes GitHub's own base path to Jekyll, so the
**same configuration is correct for both** a user page and a project page —
you never set `baseurl` by hand.

Using your own domain? Put it in `CNAME` (the setup form does this) and point
the DNS at GitHub. No custom domain? Delete `CNAME`.

## Content

Each kind of content lives in its own folder and gets its own card, colour,
landing page and structured-data type.

| Folder | What it is | Lives at |
| --- | --- | --- |
| `_posts/` | Essays and notes | `/blog/` |
| `_portfolio/` | Projects, films, design | `/portfolio/` |
| `_videos/` | Films and video essays (9:16 entries become reels) | `/videos/` |
| `_webseries/` + `_episodes/` | A series and its episodes | `/webseries/` |
| `_courses/` + `_lessons/` | A course and its curriculum | `/courses/` |
| `_podcast/` | Audio episodes | `/podcast/` |
| `_newsletter/` | Issues, in full | `/newsletter/` |
| `_snippets/` | Copy-pasteable code | `/snippets/` |
| `_prompts/` | Prompts, and what they produced | `/prompts/` |
| `_travel/` | Trips | `/travel/` |
| `_uses/` | Hardware, software, gear | `/uses/` |

Delete any you do not want — the setup form will retire the folder, the
landing page and the config entry together, and back them up first.

An entry is a Markdown file with front matter:

```yaml
---
title: "What I learned shipping it"
date: 2026-01-14
description: "One line. It becomes the card blurb and the search result."
tags: [craft, web]
image: /assets/img/posts/shipping.jpg
---
```

A child entry says which parent it belongs to — `series: my-series` on an
episode, `course: my-course` on a lesson — and orders itself with `episode:`
or `lesson:`.

## What a page is made of

This is the part worth knowing, because it is what stops you editing
templates. **An entry page is composed from a list in `_config.yml`:**

```yaml
collections:
  portfolio:
    single:
      lead: portfolio
      parts: [breadcrumbs, head, lead, prose, tags, share, ask, comments, author, nav]
      widgets: [details, toc, collection, cta]
```

- **`parts`** are stacked down the page, in the order you write them
- **`widgets`** fill the sidebar, in the order you write them
- **`lead`** is the block between the title and the body

Every name is a file: `parts` are `_includes/single/<name>.html`, `widgets`
are `_includes/widgets/<name>.html`, `lead` is `_includes/leads/<name>.html`.
**To invent one, drop a file in and name it.** No layout changes.

Any single entry can override all three in its own front matter, so one post
can drop the comments or add a widget without affecting the rest.

{% include components/callout.html type="info" title="What ships" text="Parts: breadcrumbs, head, toc-mobile, lead, prose, tags, share, ask, comments, author, nav, episodes, lessons, siblings. Widgets: toc, details, collection, about, cta, share, subscribe, ad. Leads: cover, video, prompt, snippet, portfolio, series, audio." %}

### Adding a collection

```yaml
  recipes:
    output: true
    title: Recipes
    singular: Recipe
    description: "One line about this collection."
    permalink: /recipes/:name/
    landing: /recipes/
    icon: cooking-pot
    schema: Recipe
    card: blog
    hero: { pattern: dots, views: true }
    image: "/assets/img/covers/recipes.svg"
```

Then create the folder `_recipes/`, a landing page that sets
`list_collection: recipes`, and run `npm run thumbs` to draw the cover.
`npm run doctor` tells you if you missed a step.

### Cards and views

`card:` picks the design: `blog`, `portfolio`, `video`, `snippet`, `prompt`,
`webseries`, `episode`, `course`, `lesson`, `podcast`, `issue`, `trip`,
`product`. Leave it out and you get the editorial one.

Every listing can be shown four ways — **card**, **grid**, **list** and
**simple** — from the switch in the collection's hero. The cards never change;
the feed decides their shape, and a reader's choice is remembered across the
site. Turn the switch on with `hero: { views: true }`.

Cards in a row are always the same height, whatever they carry.

### Tags

Every tag gets a page of its own at `/tags/<tag>/`, listing everything that
carries it **from every collection** — a film, a trip and a post under one
subject — with chips at the top to jump to a kind. `/tags/` is the index of
all of them. Tags are grouped by their slug, so `Analytics` and `analytics`
are one subject rather than two.

The pages are written by `_plugins/tag_pages.rb`, which runs because the
workflow invokes Jekyll itself. If you ever switch to GitHub's legacy
"build from a branch" mode, set `tag_pages: false` — the tag links then fall
back to anchors on `/tags/`, which work either way.

### A folded code block

For a long block a reader may not need:

```liquid
{% raw %}{% include components/code.html
   title="The whole config"
   lang="yaml"
   code="…" %}{% endraw %}
```

It is a `<details>`, so it is open to find-in-page, it prints open, and it
needs no JavaScript. Add `open=true` to start it unfolded.

## Making it yours

**One colour.** `accent_color` in `_config.yml` sets the accent, and every
collection's hue is derived from it by rotating the hue — change one value and
the whole site moves. Run `npm run thumbs` afterwards to redraw the covers.

**Dark mode** is automatic, with a toggle in the header. Every colour is a
`--im-*` custom property, so nothing has to be defined twice.

**The CSS** lives in `_sass/im/` and follows the Im Design System. It has
exactly two interactions, and knowing them is most of what you need:

- **Hover** — the thing *fills*. Nothing sharpens a border, nothing grows,
  nothing rests on a drop shadow.
- **Current** ("you are here") — a stronger fill and a bolder label. Never a
  change of colour.

The accent is for the primary button, a link's hover, the focus ring, text
selection and each collection's hue. Nothing else.

## Getting help

The full reference — including how the setup wizard behaves, what each part
and widget does, and the house rules for writing CSS — is in the repository at
`.claude/skills/personal-site/SKILL.md`. It is written for an AI assistant, so
if you use one, point it there and ask for what you want.
