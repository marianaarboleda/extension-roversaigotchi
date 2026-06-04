
> Open this page at [https://marianaarboleda.github.io/extension-roversaigotchi/](https://marianaarboleda.github.io/extension-roversaigotchi/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/marianaarboleda/extension-roversaigotchi** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/marianaarboleda/extension-roversaigotchi** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>


## Student project template

```typescript
// ── on start ──────────────────────────────────────────────────────────────
roversaigotchi.start()

// ── button / pin wiring  (students choose what triggers what) ─────────────
roversa.onEvent(RoversaPin.P15, RoversaEvent.Click, function () {
    roversaigotchi.playGame()
})
roversa.onEvent(RoversaPin.P16, RoversaEvent.Click, function () {
    roversaigotchi.goSleep()
})
roversa.onEvent(RoversaPin.P8, RoversaEvent.Click, function () {
    roversaigotchi.goRun()
})
roversa.onEvent(RoversaPin.P14, RoversaEvent.Click, function () {
    roversaigotchi.textFriend()
})
roversa.onEvent(RoversaPin.P5, RoversaEvent.Click, function () {
    roversaigotchi.showStats()
})
```

## Available blocks

| Group      | Block                      | Description                                  |
|------------|----------------------------|----------------------------------------------|
| Setup      | `start roversaigotchi`     | Initializes radio and the background loop    |
| Wellbeing  | `wellbeing`                | Returns current wellbeing (0–100)            |
| Wellbeing  | `change wellbeing by N`    | Adds/subtracts from wellbeing (clamped 0–100)|
| Behaviors  | `play obstacle game`       | Runs the mini-game (A = left, B = right)     |
| Behaviors  | `go to sleep`              | Lullaby loop — shake to wake                 |
| Behaviors  | `go for a run`             | Random driving + wellbeing boost             |
| Behaviors  | `text a friend`            | Ringtone + heart animation + wellbeing boost |
| Behaviors  | `show pet face`            | Displays mood icon based on wellbeing        |
| Behaviors  | `show wellbeing stats`     | Bar graph of wellbeing for 3 s               |
| Events     | `on shake`                 | Custom shake handler (replaces angry default)|
| Events     | `on friend nearby`         | Custom radio friend handler                  |

## File structure

```
roversaigotchi/
├── pxt.json        extension manifest and dependencies
├── wellbeing.ts    shared state variables + wellbeing blocks  (loaded first)
├── game.ts         obstacle mini-game + button A/B handlers
└── behaviors.ts    all behaviors, background loop, event hooks
```

## Creating a new personality

To create a different personality (e.g. `spacegotchi`):

1. Fork this repo and rename it
2. Replace the behavior implementations in `behaviors.ts` with new animations,
   sounds, and robot movements
3. Keep the same exported function names so lesson plan projects are compatible
4. Update the namespace name, color, and icon in `wellbeing.ts`

Students import the new extension — the blocks look identical, the pet behaves
differently.
