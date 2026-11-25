---
title: "How we light glass bottles in Blender"
description: "The studio setup we use for glass product renders in Blender Cycles: dark cards, strip lights, glass shader settings and render passes."
category: Tutorial
date: "[Date]"
tone: cool
obj: bottle
---

The studio setup we use for glass product renders in Cycles: dark cards, strip lights, glass shader settings and render passes.

## Why glass is hard to light

Glass has almost no colour of its own. What you see is what it reflects and refracts, so lighting glass means designing its surroundings. An empty, evenly lit scene makes glass look grey and flat.

## Start dark

We start from a black environment with no HDRI. Every highlight then comes from a light we placed on purpose, which keeps the edges of the bottle clean.

> **Tip:** Turn the world strength to zero before adding a single light.

## Strip lights define the shape

Two tall, narrow area lights either side of the bottle draw bright vertical lines down its edges. These lines are what tell the eye the object is round and glossy.

- Area lights set to rectangle, roughly 10 times taller than wide
- Placed slightly behind the bottle, angled toward the camera
- Hidden from camera so only their reflections show

## Dark cards hold the edge

A black plane behind the bottle gives a dark edge where the glass bends the background. Bright edge plus dark edge reads as thick, solid glass.

## Shader and render settings

We use the Principled BSDF with transmission at 1 and a low roughness, and increase the light paths for transmission so the glass does not render black where rays run out.

- Transmission bounces: 12 or more
- Total bounces high enough to match
- Filmic or AgX view transform for soft highlights

## Render passes

We render separate passes for the reflections and the label so each can be adjusted in compositing without a full re-render.
