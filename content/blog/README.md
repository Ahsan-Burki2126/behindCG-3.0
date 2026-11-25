# Writing a blog post

1. Copy `_template.md` to `your-post-slug.md` (the file name becomes the URL: `/blog/your-post-slug`).
2. Fill in the front matter at the top and write the post in Markdown below it.
3. Add a cover image at `public/images/blog/your-post-slug.jpg` (3:2, about 2400px wide), or set `cover:` to another path.
4. Commit and push. The post appears on `/blog`, gets its own page, social image, sitemap entry and structured data.

Front matter:

| Field | Required | Example |
|---|---|---|
| `title` | yes | `How we light glass bottles in Blender` |
| `description` | yes | One or two sentences; used on the card, in Google and in link previews |
| `category` | yes | `Tutorial`, `Breakdown` or `Guide` (filters on /blog) |
| `date` | yes | `2026-11-20` (newest posts show first) |
| `tone`, `obj` | no | Colours of the placeholder until the cover exists: `teal`/`warm`/`cool`/`clay`/`wire` and `bottle`/`jar`/`round`/`box`/`can` |
| `cover` | no | `/images/blog/other-name.jpg` |
| `read` | no | Overrides the automatic read time, e.g. `12 min read` |
| `draft` | no | `true` hides the post everywhere |

Writing tips:
- Use `##` for section headings: they build the table of contents.
- A blockquote (`> Tip: ...`) becomes a highlighted callout.
- Images: `![What the image shows](/images/blog/your-image.jpg)`.
- Links to other sites open in a new tab automatically.
