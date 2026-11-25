# Images

Every image on the site has a slot with a fixed filename. Save a file with that name and it shows on the next build or dev reload. Until then the shaded render stand-in shows, so missing images never break a page.

- Format: JPG (or change the extension in `lib/catalog.ts`). About 1600px on the long side, 2400px for the home hero.
- Alt text comes from the data files (`alt` fields in `lib/catalog.ts` and `lib/services.ts`). Update it to describe the real image.
- The image fills its frame (crop, no letterboxing). Card ratios: portfolio 4:3 or 4:5, films 16:9, addons 4:3, courses 16:9, blog 3:2, services 4:5 and 4:3.

## Home and about

- `public/images/home/hero.jpg` (first screen, full width; keep the left third dark for the headline)
- `public/images/home/for-brands.jpg`
- `public/images/home/for-artists.jpg`
- `public/images/home/showreel-poster.jpg` (also used on Animations)
- `public/images/home/learn.jpg`
- `public/images/about/studio.jpg`

## Portfolio

- `public/images/work/plant-based-sleeping-mask.jpg` (Plant-based sleeping mask)
- `public/images/work/wireless-earbuds.jpg` (Wireless earbuds)
- `public/images/work/sparkling-water-can.jpg` (Sparkling water can)
- `public/images/work/eau-de-parfum-bottle.jpg` (Eau de parfum bottle)
- `public/images/work/gift-box-set.jpg` (Gift box set)
- `public/images/work/smart-speaker.jpg` (Smart speaker)
- `public/images/work/lounge-chair.jpg` (Lounge chair)
- `public/images/work/alloy-wheel.jpg` (Alloy wheel)
- `public/images/work/serum-dropper.jpg` (Serum dropper)
- `public/images/work/table-lamp.jpg` (Table lamp)
- `public/images/work/protein-tub.jpg` (Protein tub)
- `public/images/work/car-key-fob.jpg` (Car key fob)

## Films (poster frames)

- `public/images/films/wireless-earbuds-launch-film.jpg` (Wireless earbuds launch film)
- `public/images/films/serum-bottle-reveal.jpg` (Serum bottle reveal)
- `public/images/films/sparkling-can-pour.jpg` (Sparkling can pour)
- `public/images/films/smart-speaker-turntable.jpg` (Smart speaker turntable)
- `public/images/films/gift-box-unboxing.jpg` (Gift box unboxing)
- `public/images/films/alloy-wheel-detail-pass.jpg` (Alloy wheel detail pass)

## Addons

- `public/images/addons/batch-render-pro.jpg` (Batch Render Pro)
- `public/images/addons/clay-render-pro.jpg` (Clay Render Pro)
- `public/images/addons/smart-texture-loader.jpg` (Smart Texture Loader)
- `public/images/addons/simple-texture-baker.jpg` (Simple Texture Baker)
- `public/images/addons/drive-it.jpg` (Drive it)

## Free downloads

- `public/images/downloads/studio-product-scene.jpg` (Studio product scene)
- `public/images/downloads/glass-lighting-starter.jpg` (Glass lighting starter)
- `public/images/downloads/gobo-sample-pack.jpg` (Gobo sample pack)

## Courses

- `public/images/courses/product-visualization-masterclass.jpg` (Product Visualization Masterclass)
- `public/images/courses/product-animation-in-blender.jpg` (Product animation in Blender)
- `public/images/courses/lighting-glass-and-liquids.jpg` (Lighting glass and liquids)

## Blog covers

- `public/images/blog/how-we-light-glass-bottles-in-blender.jpg` (How we light glass bottles in Blender)
- `public/images/blog/sleeping-mask-launch-breakdown.jpg` (Breakdown: a skincare launch from dieline to final render)
- `public/images/blog/what-to-send-for-a-3d-render-quote.jpg` (What to send for a 3D render quote)
- `public/images/blog/batch-rendering-many-blend-files.jpg` (Batch rendering many .blend files overnight)
- `public/images/blog/cgi-vs-product-photography.jpg` (CGI or product photography: which suits your launch?)

## Services

- `public/images/services/product-visualization.jpg` (Product visualization)
- `public/images/services/product-animation.jpg` (Product animation)
- `public/images/services/blender-addon-development.jpg` (Blender addon development)
- `public/images/services/ai-automation.jpg` (AI and social automation)

## Case study: plant-based sleeping mask

- `public/images/case-studies/plant-based-sleeping-mask/hero.jpg` (21:9)
- `public/images/case-studies/plant-based-sleeping-mask/clay.jpg` and `final.jpg` (16:9, same camera, for the clay-to-final slider)
- `public/images/case-studies/plant-based-sleeping-mask/packshot-front.jpg`, `packshot-open.jpg`, `detail-lid.jpg` (1:1)
- `public/images/case-studies/plant-based-sleeping-mask/lifestyle-bathroom.jpg`, `lifestyle-night.jpg`, `packshot-box.jpg` (4:5)

## Film: wireless earbuds launch film

- `public/images/films/wireless-earbuds-launch-film.jpg` (poster frame, 16:9)
- `public/images/films/wireless-earbuds-launch-film-reveal-cut.jpg`, `-feature-cut.jpg` (4:5), `-loop.jpg` (1:1)

Service pages (left of "What you get"):
- `public/images/services/<service>-set.jpg` (16:9) and `<service>-detail.jpg` (1:1, hero inset)

About and hero extras:
- `public/images/about/clay.jpg`, `founder.jpg`, `process.jpg`
- `public/images/membership/scene.jpg`, `breakdown.jpg`; `public/images/faq/support.jpg`, `install.jpg`
