---
title: "Batch rendering many .blend files overnight"
description: "How to queue several Blender scenes with their own render settings so a whole colour range renders while you sleep."
category: Tutorial
date: "[Date]"
tone: wire
obj: box
---

Queueing scenes with their own settings, so a whole colour range renders while you sleep.

## The problem

A product in eight colours often means eight .blend files, or one file rendered eight times with changes between each. Doing that by hand means babysitting renders.

## Options in Blender

Blender can render from the command line, which lets you script a queue. It works, but every change to the queue means editing a script.

## Using a queue addon

A queue addon such as Batch Render Pro keeps a list of files, each with its own settings, and renders them one after another.

## Set up for an overnight run

- Check output paths so files do not overwrite each other
- Render one test frame from each scene first
- Leave enough disk space for every output
- Turn off sleep mode on the machine
