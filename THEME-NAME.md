# Naming this theme

Ten candidates. The brief: it is for **builders, developers and creators** —
people who ship code *and* make things — and it should be what someone would
actually type into a search box when looking for this.

## What people actually search

Before the names, the search terms this has to sit near, because a name that
wins on taste and loses on search costs you every visitor who was looking for
exactly this:

> `jekyll portfolio theme` · `jekyll blog theme` · `developer portfolio
> template` · `personal website template github pages` · `jekyll theme for
> creators` · `multi collection jekyll theme` · `jekyll theme with portfolio
> and blog`

None of those contain a brand name. They contain **jekyll**, **portfolio**,
**developer**, **creator**, **github pages**. Whatever you pick, the repo
description and the README's first line should carry those words — the name
itself only has to be memorable, spellable and free.

## The ten

| # | Name | The idea | Why it might win | Why it might not |
| --- | --- | --- | --- | --- |
| 1 | **Imprint** | A mark pressed into a surface — what you leave behind. Also *print*, which is where this typography comes from. | Short, real word, spellable, no plural trap. Reads as craft rather than software. | Common word; `imprint` alone is taken on npm, so it ships as `imprint-theme`. |
| 2 | **Shipyard** | Where things get built and then actually leave. Developers already use "ship". | Strong single word; says *builders* immediately; memorable. | Slightly industrial; nothing about writing or film. |
| 3 | **Bylines** | The line that says who made this. A byline is the writer's, the director's, the committer's. | Points straight at the person; works for a blog, a film credit and a commit. | Skews editorial; a developer may not feel addressed. |
| 4 | **Makerfile** | A pun on `Makefile` — the file that says how a thing gets built. | Developers get it instantly and smile; "maker" covers creators too. | The joke needs one beat to land; risks reading as a build tool. |
| 5 | **Longform** | The format this theme is actually good at: essays, series, courses, films with a story. | Says what the content is, not what the tool is. Confident. | Undersells the portfolio and gear collections. |
| 6 | **Portfolio Kit** | Exactly what people search for, with no cleverness at all. | Unbeatable on search intent. Nobody has to be told what it is. | Generic; hard to own; forgettable as a brand. |
| 7 | **Groundwork** | The part you lay before anything else stands on it — which is what a theme is. | Warm, honest, developer-adjacent without being twee. | Abstract; says nothing about *what* it builds. |
| 8 | **Studio** | The place a creator works, whatever they make. | One word, universal across code, film and design. | Very taken. Search is hopeless on its own. |
| 9 | **Fieldnote** | What you write down while the work is still happening. Notes, trips, snippets, prompts. | Distinctive, fits the travel and snippets collections, quietly literary. | Doesn't say portfolio; singular/plural confusion. |
| 10 | **Everything** | The point of the theme: thirteen collections, one site, all of it in one place. | Cheeky and memorable; the tagline writes itself ("your everything, on one site"). | Unsearchable as a word; risky. |

## If you want my read

**Imprint** if you want it to feel like craft, and you are happy being
`imprint-theme` on npm. It is already in the repo, the docs and the gemspec,
so choosing it costs nothing.

**Shipyard** if you want one word that says *builders* louder than anything
else here, and you are willing to pay the rename.

**Portfolio Kit** if you would rather win search than win taste. It is the
boring answer and it is probably the one that gets installed most.

## What renaming costs

The name appears in `package.json`, `imprint-theme.gemspec`, the README, the
docs, `.claude/skills/`, and the setup wizard's copy — about a dozen files.
`npm run test` and `npm run doctor` will catch anything missed. Nothing is
published yet, so there is no deprecation to manage: this is the cheapest it
will ever be to change.

Tell me the number and I will do the rename in one pass.
