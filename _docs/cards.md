---
title: Cards and views
section: Shaping it
order: 6
icon: squares-four
description: Which card a collection wears, and the four ways a listing can look.
---

`card:` on a collection picks the design:

`blog` (editorial) · `portfolio` (repo card) · `video` (player) · `snippet`
(code window) · `prompt` (chat window) · `webseries` (portrait poster) ·
`episode` · `course` · `lesson` · `podcast` · `issue` · `trip` · `product` ·
`doc`

Leave it out and you get the editorial one — so a brand-new collection looks
right before it has a design of its own.

## Equal heights

Cards in a row are always the same height, whatever they carry. The grid
stretches each item to its row and the card's body takes up the slack. If you
write a new card, that is all it needs: `flex: 1` on the body, `margin-top:
auto` on the foot.

## Four views

Every listing can be shown four ways from the switch in its hero:

| View | What it does |
| --- | --- |
| `card` | The newest entry leads across the top, the rest in a grid |
| `grid` | Every card the same |
| `list` | One column, the picture beside the words |
| `simple` | One column, a title and a date — an index, not a feed |

The cards never change markup; the **feed** decides their shape, and the
reader's choice is remembered across the site. Turn the switch on with
`hero: { views: true }` on the collection.

## The covers

An entry with no `image:` gets one drawn from its collection: the collection's
colour, its pattern and its mark. No title — the title is already under the
card in real type that wraps and can be selected, and setting it again inside a
picture means it is set twice, at a size nobody chose.

`npm run thumbs` draws the same art as real `.svg` files for the cases that
need a URL — a social card, a collection's fallback image.
