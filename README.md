# Ajimshad S. — Portfolio

A single-page portfolio site built from the one-page résumé. Plain HTML, CSS and
JavaScript — no build step, no frameworks, no installation. Open `index.html` in a
browser and it works.

**Design:** a Swiss/editorial layout — hard rules, no rounded corners, no shadows, and
data presented the way an analyst would present it: numbered rows, a real table,
tabular figures.

The palette is "oxide & bone": bone paper, charcoal text, and iron-oxide red — the
pigment of red earth — as the one saturated colour. Pine green is a quiet second accent,
used twice on purpose: the "training · now" pill and the hardware project figure. Behind
the sun/moon button is a charcoal dark theme where the oxide lightens to warm clay and
the pine lightens to sage, so both themes stay one family at two values.

Type: **Outfit** for the giant hero name, **Space Grotesk** for other headings,
**IBM Plex Sans** for body copy, **IBM Plex Mono** for every label and number.

---

## 1. How to run it

**To look at it:** double-click `index.html`.

**To edit it:** open the folder in any text editor (VS Code, Notepad++, even Notepad),
change a file, save, then refresh the browser tab. Use `Ctrl + Shift + R` if a change
to the CSS doesn't show up — the browser caches it.

> If the résumé download button doesn't work when you open the file directly, that's a
> browser security rule for local files — it works once the site is hosted. To test it
> locally, run `python -m http.server 8000` in this folder and open
> `http://localhost:8000`.

---

## 2. File map

```
ajimshad/
├─ index.html                 ← ALL the words on the site live here
├─ README.md                  ← this file
├─ Ajimshad_S_ATS_Resume_Full_One_Page.pdf   (the original, untouched)
└─ assets/
   ├─ css/styles.css          ← colours, fonts, spacing, layout
   ├─ js/main.js              ← theme switch, scroll animations, counters, status bar
   ├─ js/particles.js         ← the grid of squares behind the hero
   ├─ img/favicon.svg         ← the icon in the browser tab
   └─ files/Ajimshad-S-Resume.pdf   ← the copy people download
```

Every editable spot is marked with a comment containing **`EDIT:`**.
Search for `EDIT:` in any file to jump between them.

---

## 3. Page structure

Top to bottom, so you know which block to go looking for:

| Block | What it is |
|---|---|
| Top bar | Fixed. Name, role, numbered menu, theme button |
| Hero | Label row, giant name, intro + buttons, contents list |
| Figures strip | CGPA / internships / projects / languages / diploma |
| Cobalt band | The moving strip of tool names |
| 01 Profile | Lead sentence, two columns of text, facts list |
| 02 Capabilities | Four rows — hover fills a row with ink |
| 03 Experience | Three numbered entries |
| 04 Projects | Two blocks, each with a drawn figure and numbered points |
| 05 Education | A real table with a header row |
| 06 Contact | Full-bleed cobalt block with the email in large type |
| Footer | Credit line and back-to-top |
| Status bar | Fixed along the bottom; shows the section you're reading |

---

## 4. "I want to change…" — quick lookup

| What you want to change | File | Where to look |
|---|---|---|
| Your name in the giant headline | `index.html` | line ~79, `EDIT: HERO` |
| The font of the giant name only | `assets/css/styles.css` | `--font-hero` in `EDIT: TYPE SCALE` |
| "— Data Analyst" beside the name | `index.html` | line ~81, the `<em>` |
| The intro paragraph | `index.html` | line ~86, `class="lede"` |
| The label row above the name | `index.html` | line ~77, `rule-label` |
| The five figures | `index.html` | line ~119, `EDIT: FIGURES` |
| Menu item names | `index.html` | line ~40, `EDIT: TOP BAR` |
| Contents list in the hero | `index.html` | search `class="index"` |
| The moving cobalt band | `index.html` | line ~133, `EDIT: TICKER` |
| Profile text and facts | `index.html` | line ~147, `EDIT: PROFILE / ABOUT` |
| Skills rows | `index.html` | line ~193, `EDIT: CAPABILITIES` |
| Internships / training | `index.html` | line ~244, `EDIT: EXPERIENCE` |
| Projects | `index.html` | line ~304, `EDIT: PROJECTS` |
| Education table | `index.html` | line ~374, `EDIT: EDUCATION` |
| Email, phone, location | `index.html` | line ~421, `EDIT: CONTACT` |
| Browser tab title & description | `index.html` | line ~8, `EDIT: META` |
| **Light colours** | `assets/css/styles.css` | line ~27, `EDIT: COLOUR PALETTE` |
| **Dark colours** | `assets/css/styles.css` | line ~47, `EDIT: DARK PALETTE` |
| **Fonts and text sizes** | `assets/css/styles.css` | line ~65, `EDIT: TYPE SCALE` |
| Particle field behaviour | `assets/js/particles.js` | line ~17, `EDIT: FIELD SETTINGS` |
| Whether it opens dark or light | `assets/js/main.js` | line ~21, `DEFAULT_THEME` |
| "Open to work" in the status bar | `assets/js/main.js` | line ~75, `IDLE_STATUS` |
| "Copied to clipboard" message | `assets/js/main.js` | line ~229, `COPY_OK` |
| The theme keyboard shortcut | `assets/js/main.js` | line ~300, `THEME_KEY` |
| How far buttons lean to the cursor | `assets/js/main.js` | line ~320, `PULL` |

Line numbers shift as you edit — the `EDIT:` comment is the reliable marker.

---

## 5. Common edits, step by step

### Change your email, phone or location
In `index.html`, find `EDIT: CONTACT`. Each one appears **twice** — once as the text
people see, once inside the link. Change both. The email also appears a third time in
the status bar at the very bottom of the file (search `statusbar__mail`).

### Change one of the five figures
Find `EDIT: FIGURES`. Each number appears twice — as `data-count` (the value it counts
up to) and as the text inside the tag (what shows if JavaScript is blocked):

```html
<div><dt>Internships</dt><dd><span data-count="2">2</span></dd></div>
```

- `data-decimals="1"` → one decimal place (used by CGPA)
- `data-pad="2"` → pad with a leading zero, so `2` shows as `02`
- The last cell is a word, not a number — it has no `data-count` and uses
  `class="figures__word"` to colour it cobalt.

### Replace the résumé PDF
Put your new PDF in `assets/files/` named exactly `Ajimshad-S-Resume.pdf` and nothing
else needs changing. For a different filename, update the two links that mention it
(search `Ajimshad-S-Resume.pdf`).

### Add a new project
Find `EDIT: PROJECTS` and copy a whole `<article class="work"> … </article>`. The left
column holds the number, title, kind, tool list and the figure; the right column holds
the points, which number themselves automatically.

```html
<article class="work reveal" data-delay="2">
  <div class="work__side">
    <span class="work__num">03</span>
    <h3>Project name</h3>
    <p class="work__kind">What kind of work it is</p>
    <p class="work__tools">Tool / Tool / Tool</p>
  </div>
  <ul class="points">
    <li>What you did.</li>
    <li>How you did it.</li>
  </ul>
</article>
```

Leave out the `<svg class="fig">` block if you have no figure for it.

### Add a new internship or job
Find `EDIT: EXPERIENCE` and copy a whole `<li class="entry"> … </li>`. Use
`<span class="pill">` for a normal entry, or `<span class="pill pill--now">` for
something in progress (it turns black instead of cobalt).

### Add a qualification
Education is a real table — add a `<tr>` with four cells: year, qualification,
institution, result.

```html
<tr>
  <td>2026</td>
  <td><strong>Course name</strong></td>
  <td>Institution</td>
  <td class="num">Result</td>
</tr>
```

### Add or remove a tool name
Tools are plain text separated by slashes, not chips:

```html
<p class="work__tools">Python / SQL / Power BI</p>
```

Just edit the sentence.

### Add another link (GitHub, portfolio, anything)
LinkedIn is already in the contact grid. To add another, copy the pattern:

```html
<div><dt>GitHub</dt><dd><a href="https://github.com/your-handle" target="_blank" rel="noopener">/your-handle</a></dd></div>
```

---

## 6. Changing the look

### Colours
All colours are defined once, at the top of `assets/css/styles.css`. There are two sets:
the bone-paper light theme (`EDIT: COLOUR PALETTE`, the default) and the charcoal dark
theme (`EDIT: DARK PALETTE`). Change a value in both to keep the themes in step.

The two palettes are deliberately one family at two values. The accent shifts with the
background — deeper on paper, lighter on charcoal — so it stays readable either way. If
you replace one, shift the other with it, or the toggle will feel like two different
websites.

The paper is tinted rather than grey and the red is dull rather than bright, and that is
the point: clean neutrals with a vivid accent is what generated designs default to.

| Variable | What it controls |
|---|---|
| `--paper` | page background |
| `--paper-2` | every second section band |
| `--surface` | raised surfaces |
| `--ink` | headings, the status bar, hard rules |
| `--ink-2` | body text |
| `--ink-3` | small mono labels |
| `--line` | hairlines |
| `--line-2` | the heavy 2px rules above section titles |
| `--accent` | the one saturated colour — links, numbers, figures, the contact block, the band. Oxide `#9c3b22` on paper, warm clay `#d2694a` in the dark theme |
| `--accent-2` | the accent when a button is hovered |
| `--on-accent` | text colour on top of the accent |
| `--accent-b` / `--on-accent-b` | the quiet second accent (pine): the "training" pill and the hardware figure |
| `--particle` / `--particle-op` | the hero grid colour and strength |

To change the whole site's accent, change `--accent` (and `--accent-2`) in both
palettes. Keep `--on-accent` readable against it — white on a mid-to-dark accent,
near-black on a light one.

If you change `--paper`, also update the matching value in `THEME_COLOR` near the top
of `main.js` — that's the colour mobile browsers paint their address bar with.

### Fonts
Two places have to agree:
1. The Google Fonts `<link>` near the top of `index.html` (line ~20).
2. The four font variables in `styles.css` (`EDIT: TYPE SCALE`).

| Variable | Used for | Currently |
|---|---|---|
| `--font-hero` | the giant name in the hero, and nothing else | Outfit 600 |
| `--font-display` | every other heading | Space Grotesk |
| `--font` | body copy | IBM Plex Sans |
| `--mono` | every small uppercase label and number | IBM Plex Mono |

The name has its own face on purpose — at that size it carries the page, so it is worth
tuning on its own. Two separate knobs control it:

- **The family**: `--font-hero` in `styles.css`, plus the family name in the `<link>`.
- **The weight**: `font-weight` on `.mega` (currently 600 — a semi-bold). Outfit ships
  400 and 500 if you want it softer, 700 if you want more weight. Heavier settings want
  tighter `letter-spacing` and lighter ones want looser: `.mega` sits at `-.03em` for
  600, where 300 wanted about `-.012em` and an 800 wanted `-.045em`.

Other families that work at this size: Jost, Sora, Manrope, Figtree or Chivo. Archivo
is the one to use if you ever want it genuinely heavy.

### Overall text size
`--t-mega` (the giant name), `--t-h2`, `--t-lead`, `--t-body` and friends, in the same
block. They use `clamp(min, scaling, max)` so text resizes smoothly between phone and
desktop — change the middle value to make the scaling more or less aggressive.

### Widths
`--wrap` is the maximum content width. The layout has no side rail, so this one value
controls how wide everything sits.

---

## 7. Interactive bits

| What it does | Where it's controlled |
|---|---|
| **Copy address** button on the contact block | `main.js` section 7. The address lives in `data-copy` on the button — keep it the same as the `mailto:` link. Falls back to a "press Ctrl+C" message if the browser blocks clipboard access |
| **Press `T`** anywhere to switch theme | `main.js` section 9, `THEME_KEY`. Ignored while typing in a field |
| **Live read percentage** in the status bar | `main.js` section 8 |
| **Top ↑** button in the status bar | `main.js` section 8 |
| Buttons leaning towards the cursor | `main.js` section 10, `PULL` |
| Project figures redrawing when you hover the block | `main.js` section 10 |
| Status bar naming the section you're reading | `main.js` section 3 |
| Capability rows filling with ink on hover | `.row:hover` in CSS |
| The band pausing when you hover it | `.band:hover` in CSS |

All the pointer effects are switched off automatically on touch screens and for anyone
who has "reduce motion" turned on.

---

## 8. Animations

| Effect | Where it's controlled |
|---|---|
| Grid of squares behind the hero | `assets/js/particles.js`, `CONFIG` |
| The name sliding up out of a mask | `.mega .ln` in CSS |
| Section rules drawing across | `.sheet__head::before` in CSS |
| Blocks fading up on scroll | `main.js` section 5 + the `.reveal` class |
| Numbers counting up | `main.js` section 6; values from `data-count` |
| Project bar chart growing | `.fig__bars rect` + `@keyframes grow` |
| Tool path drawing itself | `.fig__path` + `@keyframes draw` |
| Moving cobalt band | `.band__track` + `@keyframes slide` |
| Capability row filling with ink | `.row:hover` |
| Status bar following your scroll | `main.js` section 3 |

**To make any element fade in on scroll:** add `class="reveal"` to it.
Add `data-delay="1"`, `"2"`, `"3"` to stagger several of them.

> One thing worth knowing if you change the reveal effect: don't hide an element with
> `clip-path`, because that collapses its area to zero and the scroll observer that is
> supposed to reveal it never fires — the element stays invisible forever. Hide with
> `opacity` and `transform` instead, or put the mask on a child element, which is why
> the headline has that extra `<span class="ln">` wrapper.

**Particle settings** (`particles.js`):

The field is a grid of small round dots. They breathe gently on their own, and the ones
near your cursor grow and pick up a soft halo.

```js
cell:          46,   // px between grid points — larger = sparser
size:          3.2,  // dot diameter at rest
fillRatio:     0.42, // share of grid points that are occupied
breatheSpeed:  0.45, // how fast they fade in and out
mouseRadius:   165,  // cursor influence
mouseGrow:     2.6,  // extra px a lit dot grows by
glow:          15,   // strongest halo, in px — set 0 for flat dots
glowStart:     0.12, // only dots lit past this much get a halo
pulseEvery:    4.5,  // seconds between ring pulses (0 = off)
```

`glow` is deliberately restrained and only applies to dots the cursor (or a passing
pulse) has woken up — the resting field stays crisp. Pushing it much past 20 starts to
look neon rather than considered.

To remove the field entirely, delete this line near the bottom of `index.html`:
```html
<script src="assets/js/particles.js" defer></script>
```

Anyone whose system is set to "reduce motion" automatically gets a still version of the
whole site, and the page stays fully readable with JavaScript switched off.

---

## 9. How it behaves on different screens

| Width | What changes |
|---|---|
| 1100px and up | Full horizontal menu in the top bar, two-column hero, status bar along the bottom |
| 1000–1100px | Menu collapses to a burger; hero columns tighten |
| 861–1000px | Figures strip goes to three across; project blocks tighten |
| Up to 860px | Everything stacks to one column; the status bar is hidden; figures go two across |
| Up to 760px | The education table stops scrolling sideways and becomes stacked records, each field labelled from its `data-label` attribute |
| Up to 560px | Figures go one per row; buttons stretch to full width; "— Data Analyst" drops below the name |
| Up to 380px | Tighter gutters, smaller headline, table labels sit above their values |

Two things to keep in mind if you add to the page:

- Give any new `<section>` an `id` and it automatically gets `scroll-margin-top`, so
  clicking a menu link lands the heading below the fixed bar instead of under it.
- If you add a cell to the education table, give the `<td>` a `data-label` attribute or
  it will have no label when the table stacks on phones.

---

## 10. Putting it online (free options)

**GitHub Pages**
1. Create a repository on GitHub and upload this whole folder.
2. Settings → Pages → Source: `main` branch, `/root`.
3. Live in a minute or two at `https://yourname.github.io/repo-name`.

**Netlify / Vercel** — drag the folder onto their dashboard. Done.

Before publishing, update the `EDIT: META` block at the top of `index.html` so the title
and description are what you want appearing in search results.

---

## 11. Checklist before you send it to anyone

- [ ] Email is correct in the contact link, the copy button (data-copy) and the status bar
- [ ] `assets/files/Ajimshad-S-Resume.pdf` is your latest résumé
- [ ] Page title in `EDIT: META` reads the way you want
- [ ] LinkedIn URL in the contact grid points at the right profile
- [ ] Tested on a phone (or narrow the browser window to check)
- [ ] Clicked the theme button to confirm both light and dark look right
- [ ] Every menu item scrolls to the right section
