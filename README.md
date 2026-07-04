
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
roversaPetBot.start()

roversa.onEvent(RoversaPin.P16, RoversaEvent.Click, function () {
    roversaPetBot.playGame(1, -10)
})
roversa.onEvent(RoversaPin.P13, RoversaEvent.Click, function () {
    roversaPetBot.goRun()
})
roversa.onEvent(RoversaPin.P14, RoversaEvent.Click, function () {
    roversaPetBot.goSleep()
})
roversa.onEvent(RoversaPin.P15, RoversaEvent.Click, function () {
    roversaPetBot.textFriend()
})
roversa.onEvent(RoversaPin.P9, RoversaEvent.Click, function () {
    roversaPetBot.scrollSocialMedia()
})
roversa.onEvent(RoversaPin.P8, RoversaEvent.Click, function () {
    roversaPetBot.seekFriend()
})
roversa.onEvent(RoversaPin.P5, RoversaEvent.Click, function () {
    roversaPetBot.showStats()
})
```

## Available blocks

| Group     | Block                    | Description                                           |
|-----------|--------------------------|-------------------------------------------------------|
| Setup     | `start roversaPetBot`    | Initializes radio and the background loop             |
| Wellbeing | `wellbeing`              | Returns current wellbeing (0–100)                     |
| Wellbeing | `change wellbeing by N`  | Adds/subtracts from wellbeing (clamped 0–100)         |
| Wellbeing | `show wellbeing stats`   | Shows the current wellbeing number for 3 s            |
| Behaviors | `go to sleep`            | Plays a lullaby, then sleeps until `wake up pet`      |
| Behaviors | `wake up pet`            | Wakes a sleeping pet — wire to any button or motion   |
| Behaviors | `go for a run`           | Random driving to upbeat music                        |
| Behaviors | `text a friend`          | Ringtone + heart animation                            |
| Behaviors | `scroll social media`    | Chaotic flashing icons + pings — overstimulating      |
| Behaviors | `seek a friend`          | Broadcasts a radio signal to nearby pets              |
| Behaviors | `play obstacle game`     | Dodge rising obstacles (A = left, B = right)          |
| Events    | `on friend nearby`       | Custom handler when a nearby pet sends a signal       |

## File structure

```
extension-roversaigotchi/
├── pxt.json        extension manifest and dependencies
├── wellbeing.ts    shared state variables + wellbeing blocks  (loaded first)
├── game.ts         obstacle mini-game + button A/B handlers
└── behaviors.ts    all behaviors, background loop, event hooks
```

## Creating a new personality

To create a different personality:

1. Fork this repo and rename it
2. Replace the behavior implementations in `behaviors.ts` with new animations,
   sounds, and robot movements
3. Keep the same exported function names so lesson plan projects are compatible
4. Update the namespace name, color, and icon in `wellbeing.ts`

Students import the new extension — the blocks look identical, the pet behaves differently.
