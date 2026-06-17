# roversaigotchi – project context for Claude Code

## What this is
A MakeCode extension for micro:bit v2 that encapsulates all behaviors for a
Tamagotchi-like pet built on the Roversa robot platform. The goal is to let
students import the extension and wire behaviors to events without touching the
internals — different "personalities" (lesson plan narratives) are created by
forking the repo and changing the behavior implementations while keeping the
same exported block names.

## Hardware
- BBC micro:bit **v2** (not v1 — program size exceeds v1 flash)
- Roversa robot platform (motors, buttons on pins P5, P8, P14, P15, P16)
- micro:bit v2 sound expressions API is available (`soundExpression.giggle` etc.)

## MakeCode TypeScript constraints
- Extensions are TypeScript hosted on a public GitHub repo
- Blocks are created with `//% block="..."` annotations
- `//% block="label || param %name"` makes params optional/expandable (student clicks `+`)
- `//% param.defl=N` sets the default value shown in the block editor
- Files in `pxt.json` are compiled **in order** — wellbeing.ts must be first
  because it declares the shared state variables other files reference
- Event handler registrations at namespace level (outside any function) run at
  startup — this is how button A/B and gesture/radio handlers are registered
- `control.inBackground()` launches a background fiber — used for the idle
  display loop inside `start()`
- MakeCode fibers are cooperative: they yield at `basic.pause()` calls, which
  is what allows the shake gesture handler to fire and set `_sleeping = false`
  while `_playLullaby()` is blocking

## Key architecture decisions

### _busy flag pattern
Every behavior sets `_busy = true` at the start and `_busy = false` at the end.
The background loop in `start()` checks `if (!_busy)` before updating the
display or decaying wellbeing. This means any behavior automatically pauses the
idle display without extra coordination — no state machine needed.

### No dependency on the `states` extension
The student's MakeCode project uses a `states` extension (setState /
setEnterHandler / addLoopHandler) for their own state machine. The roversaigotchi
extension does NOT depend on `states` — it manages its own state with simple
boolean flags (_busy, _sleeping, _gameRunning). This keeps the extension
self-contained.

### Sleep interrupt mechanism
`goSleep()` runs `while (_sleeping) { _playLullaby() }`. The shake gesture
handler (registered at startup) sets `_sleeping = false`. Because `_playLullaby`
uses `music.playTone` internally (which calls `basic.pause`, yielding the fiber),
the shake handler CAN fire mid-lullaby. When the current lullaby call returns,
the while loop exits cleanly.

### playGame exit
The original implementation used `control.reset()` to exit the game, which
rebooted the whole micro:bit. The fix was to replace game.LedSprite with raw
`led.plot()` calls (no hidden sprite state to clean up) and use a `_gameRunning`
flag with a `while` loop. Setting `_gameRunning = false` exits the loop cleanly
and the behavior function returns normally.

### Idle display conflict (resolved)
The original code had no "playing" state, so the Idle loop handler fired during
gameplay and fought with the game display. Fixed by:
1. Transitioning to a "playing" state before the game starts
2. Adding `basic.pause(2000)` to the Fabulous branch of the Idle loop (it had
   no pause, causing the loop to spin and drain wellbeing instantly when happy)

## File structure
```
roversaigotchi/
├── pxt.json        manifest — lists files in load order, declares roversa dep
├── wellbeing.ts    shared state exports + wellbeing blocks  ← loaded first
├── game.ts         obstacle mini-game + button A/B startup registrations
├── behaviors.ts    all behaviors, background loop, shake/radio registrations
└── README.md       setup instructions and block reference
```

## Exported state (wellbeing.ts)
All cross-file variables are exported from wellbeing.ts:
- `_wellbeing: number` — 0–100, decays by 1 every 2 s in idle loop
- `_busy: boolean` — true while any behavior is running
- `_sleeping: boolean` — true while goSleep() lullaby loop is active
- `_gameRunning: boolean` — true during playGame() while loop

## Student-facing blocks
| Function          | Parameters                        | Default impact      |
|-------------------|-----------------------------------|---------------------|
| `start()`         | none                              | —                   |
| `getWellbeing()`  | none                              | —                   |
| `changeWellbeing` | amount (-100 to 100)              | —                   |
| `playGame()`      | winAmount=5, loseAmount=-10       | +per wave / -on hit |
| `goSleep()`       | none                              | +20 on wake         |
| `goRun()`         | none                              | +10 after run       |
| `textFriend()`    | none                              | +15 after text      |
| `showFace()`      | none                              | —                   |
| `showStats()`     | none                              | —                   |
| `onCustomShake()` | handler callback                  | overrides default   |
| `onFriendNearby()`| handler callback                  | overrides default   |

## TODO / known issues
- `pxt.json`: replace `"github:OWNER/pxt-roversa"` with actual Roversa extension URL
- Repo must be pushed to a **public** GitHub repo for MakeCode to import it
- The default angry reaction (shake when not asleep) and default friend reaction
  (rabbit icon + giggle) are hardcoded — students replace them entirely via
  `onCustomShake()` / `onFriendNearby()` rather than parameterising them
- Radio sends "hey!" every 10 s from the background loop — in a classroom with
  many devices on the same radio group this could be noisy; consider making the
  group configurable in `start(groupId)`
- `_playLullaby()` is exported (lowercase `_` convention) only because TypeScript
  requires export for cross-file namespace access; it should not be used as a block

## Student project template (for reference)
```typescript
roversaigotchi.start()

roversa.onEvent(RoversaPin.P15, RoversaEvent.Click, function () {
    roversaigotchi.playGame(5, -10)
})
roversa.onEvent(RoversaPin.P16, RoversaEvent.Click, function () {
    roversaigotchi.goSleep(20)
})
roversa.onEvent(RoversaPin.P8, RoversaEvent.Click, function () {
    roversaigotchi.goRun(10)
})
roversa.onEvent(RoversaPin.P14, RoversaEvent.Click, function () {
    roversaigotchi.textFriend(15)
})
roversa.onEvent(RoversaPin.P5, RoversaEvent.Click, function () {
    roversaigotchi.showStats()
})
```
