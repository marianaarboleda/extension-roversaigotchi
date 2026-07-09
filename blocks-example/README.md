# Roversa PetBot — Blocks Edition (behind the scenes)

This is the **same pet** as the `roversaPetBot` extension, but rebuilt entirely
out of **standard MakeCode blocks** instead of hidden extension code.

When students import the extension, they only see finished blocks like
`go for a run`. This project pulls back the curtain: every behavior is written
with ordinary blocks — variables, `on start`, loops, `show icon`, `play melody`,
and Roversa moves — so **teachers can see exactly how a behavior is built and
invent their own**.

> There is no new magic here. If you can read these blocks, you can write a pet.

## How to open it

Because a GitHub repo import in MakeCode reads the project at the **repo root**,
this demo lives in its own folder. To open it as blocks, either:

**Option A — copy into a New Project (quickest)**
1. Open <https://makecode.microbit.org/> → **New Project**
2. Add the Roversa extension (gearwheel → **Extensions** →
   `github:eb8ga/pxt-roversa-2`)
3. Switch to **JavaScript**, paste the contents of [`main.ts`](main.ts), then
   switch back to **Blocks**. MakeCode converts the code into blocks for you.

**Option B — import as its own project**
Push this `blocks-example/` folder to its own public GitHub repo (so its
`pxt.json` is at the root), then in MakeCode use **Import → Import URL** with
that repo. It opens straight into the block editor.

> If MakeCode ever opens on the JavaScript view, just click **Blocks** — the
> code is written to convert cleanly, with no grey "text" blocks.

## What each behavior teaches

Open the matching function in the block editor to see the pattern.

| Behavior (function)   | Wired to | Block concepts on display                                  |
|-----------------------|----------|------------------------------------------------------------|
| idle loop (`on start`)| —        | `forever`, a boolean flag, `if`, calling a function        |
| `showFace`            | —        | `if / else if / else`, comparing a variable, LED drawing   |
| `changeWellbeing`     | —        | function **with a parameter**, `constrain` to clamp 0–100  |
| `goRun`               | P13      | `for` loop, `play melody`, random driving, random true/false|
| `textFriend`          | P15      | sequencing text, sound and robot moves                     |
| `scrollSocialMedia`   | P9       | **arrays** + `pick random` to choose a message             |
| `seekFriend`          | P8       | `radio send`, animation loop                               |
| `goSleep`             | P14      | `while` loop + a flag interrupted by the **shake** handler |
| `playGame`            | P16      | game state variables, `while` loop, `plot`, nested `if`    |
| friend reaction       | radio    | `on radio received`, the `busy` flag preventing overlap    |

## The two ideas that make it all work

**1. One mood, many faces.** The pet has a single number, `wellbeing` (0–100).
The face is just that number turned into an icon in `showFace`. Change a
threshold or an icon and you have a new personality.

**2. The `busy` flag.** Every behavior sets `busy = true` while it runs and
`busy = false` when it finishes. The idle loop checks `if not busy` before it
draws, so behaviors never fight over the screen — no complicated state machine
needed. `sleeping` and `gameRunning` work the same way for their loops.

## Make it your own

1. Copy one of the behavior functions.
2. Swap the icons, the melody, and the Roversa moves.
3. End it with `change wellbeing by ...` (positive to help, negative to harm).
4. Wire it to a spare pad in the `on ... click` blocks.

That's a brand-new pet behavior — built entirely in blocks.
