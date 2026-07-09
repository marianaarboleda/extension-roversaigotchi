# Roversa PetBot – Teacher Guide

## What is this?

Roversa PetBot is a MakeCode extension for the micro:bit v2 + Roversa robot. It turns the robot into a digital pet — a Tamagotchi-like character with a **wellbeing score** (0–100) that goes up and down depending on what the student programs it to do.

The goal is to give students a tangible, physical way to explore how different activities affect wellbeing, and to introduce sequencing, events, and cause-and-effect in programming.

---

## The wellbeing score and the three faces

The pet always has a wellbeing value between 0 and 100. It decays by 1 point every 2 seconds automatically — the pet needs care to stay healthy.

The face the robot displays reflects how it is feeling:

| Wellbeing | Display | What it means |
|-----------|---------|---------------|
| 80–100 | 😎 Fabulous | The pet is thriving |
| 70–79 | 🙂 Neutral smile | Doing okay, but could be better |
| 50–69 | 😢 Sad | Struggling — needs attention |
| 0–49 | 😠 Angry | In distress |

You can point students to the face as a quick feedback loop: *"Look at your robot — how is it feeling right now? What did you do that changed its face?"*

---

## Lesson 1 — Guided challenge: Help Roversa feel better

### Story prompt (read aloud or display)

> Roversa hasn't been feeling well lately. She's been spending a lot of time scrolling on her phone, and she lost a few rounds of her favourite game. Can you try different things to help her feel better — and figure out what actually works?

### Setup

Flash the following starter code onto each micro:bit before the lesson. Students do **not** write code in this activity — they press buttons and observe.

```block
roversa.onEvent(RoversaPin.P16, RoversaEvent.Click, function () {
    roversaPetBot.playGame(1, -10)
})
roversa.onEvent(RoversaPin.P9, RoversaEvent.Click, function () {
    roversaPetBot.scrollSocialMedia(-15)
})
roversa.onEvent(RoversaPin.P13, RoversaEvent.Click, function () {
    roversaPetBot.goRun()
})
roversa.onEvent(RoversaPin.P14, RoversaEvent.Click, function () {
    roversaPetBot.goSleep()
})
input.onGesture(Gesture.Shake, function () {
    roversaPetBot.wakeUp()
})
roversa.onEvent(RoversaPin.P5, RoversaEvent.Click, function () {
    roversaPetBot.showStats()
})
roversa.onEvent(RoversaPin.P15, RoversaEvent.Click, function () {
    roversaPetBot.textFriend()
})
roversaPetBot.start()
```

> **Note:** Waking the pet is now a separate block (`wake up pet`). The starter code above wires it to a **shake** gesture, but you can choose any button or motion. If you don't wire a wake trigger, a sleeping pet will never wake up.

### Button map for students

| Button | Activity |
|--------|----------|
| P16 | Play a game |
| P9 | Scroll social media |
| P13 | Go for a run |
| P14 | Go to sleep |
| Shake | Wake the pet up |
| P5 | Show wellbeing number |
| P15 | Text a friend |

### What each activity does

| Activity | Default effect | What the pet does |
|----------|---------------|-------------------|
| **Play a game** | +1 per wave survived, −10 on hit | Dodge obstacles — A moves left, B moves right |
| **Scroll social media** | −15 | Rapid flashing icons + notification sounds — chaotic, overstimulating |
| **Go for a run** | +10 | Drives around randomly to upbeat music |
| **Go to sleep** | +20 on wake | Plays a lullaby, then sleeps until woken. Blinks its eyes open when it wakes |
| **Wake the pet up** | — | Ends sleep. Wire it to any button or motion you like (starter code uses shake) |
| **Text a friend** | +15 | Plays a ringtone and shows a heart |
| **Show stats** | — | Displays the current wellbeing number for 3 seconds |

### Discussion questions

- Which activities made Roversa feel better? Which made her feel worse?
- Why do you think scrolling social media has a negative effect?
- What happened if you let the robot sit without doing anything?
- Did you notice the face changing? When did it change?

---

## Lesson 2 — Students write their own program

Once students have explored the guided challenge, they write their own version: they decide which button triggers which activity, and they can customise the effect values using the `+` button on each block.

### What students can change

Every behavior block has an optional **effect** parameter. Click the `+` on the block to reveal it. The value can be positive (helps the pet) or negative (hurts the pet).

Examples students can try:
- Make scrolling social media have a bigger negative effect: `scroll social media with effect -30`
- Make sleep less restorative: `go to sleep with effect 5`
- Make running hurt instead of help: `go for a run with effect -10`

### Discussion questions after customisation

- What choices did you make? Why?
- If you made scrolling worse, what were you trying to model?
- Could you design a "villain" pet whose wellbeing goes down no matter what?

---

## Block reference

| Block | Group | Description |
|-------|-------|-------------|
| `start roversaPetBot` | Setup | Must be called once in "on start". Starts the background loop and radio. |
| `wellbeing` | Wellbeing | Returns the current wellbeing value (0–100). Use inside conditions. |
| `change wellbeing by N` | Wellbeing | Directly adds or subtracts from wellbeing. Useful for custom events. |
| `show wellbeing stats` | Wellbeing | Shows the current wellbeing number for 3 seconds. |
| `go to sleep` | Behaviors | Plays a lullaby, then sleeps until `wake up pet` is called. Blinks its eyes open on waking. |
| `wake up pet` | Behaviors | Ends sleep. Wire it to any button or motion. Does nothing if the pet is already awake. |
| `go for a run` | Behaviors | Random driving to upbeat music. |
| `text a friend` | Behaviors | Ringtone + heart animation. |
| `scroll social media` | Behaviors | Rapid flashing icons + notification pings. Overstimulating. |
| `seek a friend` | Behaviors | Broadcasts a radio signal so a nearby pet can react. |
| `play obstacle game` | Behaviors | Dodge rising obstacles. A = left, B = right. |
| `on friend nearby` | Events | Replace the default reaction when another Roversa PetBot pet is detected via radio. |

---

## Tips and troubleshooting

**The pet's face doesn't change.**
Make sure `start roversaPetBot` is called in "on start". Without it, the background loop doesn't run.

**The pet won't wake up / is stuck asleep.**
Waking is a separate `wake up pet` block — it must be wired to a button or motion. Check that a trigger (e.g. the shake gesture in the starter code) calls `wake up pet`. Without a wake trigger, a sleeping pet stays asleep forever.

**Two pets react to each other.**
That's the radio feature working. Pets broadcast a signal every 10 seconds — if another Roversa PetBot is nearby, both pets play the friend reaction. This is intentional.

**The game never ends.**
The game ends when the pet gets hit by an obstacle. Keep playing until a collision happens.
