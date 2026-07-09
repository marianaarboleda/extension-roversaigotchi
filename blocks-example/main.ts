// ─────────────────────────────────────────────────────────────────────────
// Roversa PetBot — BLOCKS edition (behind-the-scenes demo for teachers)
//
// This is the SAME pet as the roversaPetBot extension, but rebuilt entirely
// out of standard MakeCode blocks instead of hidden extension code. Open it
// in MakeCode and click "Blocks" to see how every behavior is assembled.
//
// Use it to invent your own behaviors: copy a function, swap the icons,
// sounds and robot moves, then wire it to a button.
// ─────────────────────────────────────────────────────────────────────────

// ── The pet's memory (variables) ──────────────────────────────────────────
// wellbeing is the pet's mood, 0–100. The flags stop behaviors from fighting
// over the screen: while one behavior runs, the idle loop waits its turn.
let wellbeing = 50
let busy = false
let sleeping = false
let gameRunning = false

// game state (only used while the obstacle game is running)
let birdX = 2
let obstacleY = 4
let gapX = 0

// ── On start: set the mood and begin the idle loop ────────────────────────
radio.setGroup(1)
wellbeing = 50
showFace()

// The idle loop: every 2 seconds, if no behavior is running, show the pet's
// face and let its mood slowly drop by 1. Care for the pet to keep it happy.
basic.forever(function () {
    if (!(busy)) {
        showFace()
        changeWellbeing(-1)
    }
    basic.pause(2000)
})

// ── Buttons: wire each activity to a Roversa touch pad ─────────────────────
roversa.onEvent(RoversaPin.P16, RoversaEvent.Click, function () {
    playGame()
})
roversa.onEvent(RoversaPin.P9, RoversaEvent.Click, function () {
    scrollSocialMedia()
})
roversa.onEvent(RoversaPin.P13, RoversaEvent.Click, function () {
    goRun()
})
roversa.onEvent(RoversaPin.P14, RoversaEvent.Click, function () {
    goSleep()
})
roversa.onEvent(RoversaPin.P15, RoversaEvent.Click, function () {
    textFriend()
})
roversa.onEvent(RoversaPin.P8, RoversaEvent.Click, function () {
    seekFriend()
})
roversa.onEvent(RoversaPin.P5, RoversaEvent.Click, function () {
    showStats()
})

// Shake to wake the pet up when it is asleep.
input.onGesture(Gesture.Shake, function () {
    sleeping = false
})

// A/B move the bird left and right — but only while the game is running.
input.onButtonPressed(Button.A, function () {
    if (gameRunning && birdX > 0) {
        birdX += -1
    }
})
input.onButtonPressed(Button.B, function () {
    if (gameRunning && birdX < 4) {
        birdX += 1
    }
})

// A friend's pet said hello over the radio: giggle and cheer up.
radio.onReceivedString(function (receivedString: string) {
    if (!(busy)) {
        busy = true
        music.play(music.builtinPlayableSoundEffect(soundExpression.giggle), music.PlaybackMode.UntilDone)
        basic.showIcon(IconNames.Rabbit)
        changeWellbeing(20)
        basic.pause(2000)
        basic.clearScreen()
        busy = false
    }
})

// ── The pet's face ─────────────────────────────────────────────────────────
// The face is just the wellbeing number turned into an icon. Change these
// thresholds or icons to give your pet a different personality.
function showFace() {
    if (wellbeing < 20) {
        basic.showIcon(IconNames.Angry)
    } else if (wellbeing < 50) {
        basic.showIcon(IconNames.Sad)
    } else if (wellbeing < 75) {
        basic.showLeds(`
            . . . . .
            . # . # .
            . . . . .
            . . . . #
            . # # # .
            `)
    } else {
        basic.showIcon(IconNames.Fabulous)
    }
}

// Add (or subtract) from the mood and keep it between 0 and 100.
function changeWellbeing(amount: number) {
    wellbeing = Math.constrain(wellbeing + amount, 0, 100)
}

// Show the current mood as a number for 3 seconds.
function showStats() {
    busy = true
    basic.showNumber(wellbeing)
    basic.pause(3000)
    basic.clearScreen()
    busy = false
}

// ── Behaviors ──────────────────────────────────────────────────────────────

// Go for a run: hearts, upbeat music, and random driving. Good for the pet.
function goRun() {
    busy = true
    for (let i = 0; i < 2; i++) {
        basic.showIcon(IconNames.Heart)
        basic.pause(500)
        basic.showIcon(IconNames.SmallHeart)
        basic.pause(500)
    }
    music.play(music.builtInPlayableMelody(Melodies.Chase), music.PlaybackMode.InBackground)
    for (let i = 0; i < 4; i++) {
        roversa.driveForwards(randint(500, 1500))
        if (Math.randomBoolean()) {
            roversa.right()
        } else {
            roversa.left()
        }
    }
    music.stopAllSounds()
    changeWellbeing(10)
    busy = false
}

// Text a friend: a ringtone, a little dance, and a heart. Cheers the pet up.
function textFriend() {
    busy = true
    basic.showString("Hello!")
    roversa.turnRight(45)
    roversa.backward()
    roversa.turnLeft(45)
    basic.showString(". . .")
    music.play(music.builtInPlayableMelody(Melodies.Ringtone), music.PlaybackMode.InBackground)
    basic.showIcon(IconNames.Heart)
    basic.pause(2000)
    music.stopAllSounds()
    changeWellbeing(15)
    busy = false
}

// Scroll social media: fast, flashing, noisy — and it drains the pet's mood.
function scrollSocialMedia() {
    busy = true
    let texts = ["Like!", "50% OFF", "Follow!", "Share!", "LOL", "OMG", "VIRAL!"]
    for (let i = 0; i < 3; i++) {
        basic.showString(texts[randint(0, texts.length - 1)])
        music.play(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.UntilDone)
    }
    basic.clearScreen()
    changeWellbeing(-15)
    busy = false
}

// Seek a friend: play a searching tune and send a radio hello. A nearby pet
// running this same program will hear it and react (see "on radio received").
function seekFriend() {
    busy = true
    for (let i = 0; i < 3; i++) {
        basic.showIcon(IconNames.EigthNote)
        basic.pause(300)
        basic.showIcon(IconNames.QuarterNote)
        basic.pause(300)
    }
    radio.sendString("hey!")
    basic.showIcon(IconNames.Target)
    basic.pause(1000)
    basic.clearScreen()
    changeWellbeing(5)
    busy = false
}

// Go to sleep: blink, play a lullaby once, then stay asleep showing the sleep
// face until someone shakes the pet awake (the shake handler sets sleeping =
// false). Waking up restores the pet's mood.
function goSleep() {
    busy = true
    sleeping = true
    for (let i = 0; i < 2; i++) {
        basic.showLeds(`
            . . . . .
            . # . # .
            . . . . .
            . # # # .
            . . . . .
            `)
        basic.pause(400)
        basic.showIcon(IconNames.Asleep)
        basic.pause(400)
    }
    music.play(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.UntilDone)
    while (sleeping) {
        basic.showIcon(IconNames.Asleep)
        basic.pause(300)
    }
    changeWellbeing(20)
    basic.clearScreen()
    busy = false
}

// Play the obstacle game: dodge the rising wall by moving through its gap.
// A moves left, B moves right. Survive a wave: +1. Get hit: −10 and game over.
function playGame() {
    busy = true
    gameRunning = true
    birdX = 2
    obstacleY = 4
    gapX = randint(0, 4)
    while (gameRunning) {
        // draw the bird on the top row and the wall (with its gap) below
        basic.clearScreen()
        led.plot(birdX, 0)
        for (let x = 0; x <= 4; x++) {
            if (x != gapX) {
                led.plot(x, obstacleY)
            }
        }
        basic.pause(700)
        obstacleY += -1
        if (obstacleY == 0) {
            if (birdX != gapX) {
                gameRunning = false
                basic.clearScreen()
                basic.showString("GAME OVER")
                changeWellbeing(-10)
            } else {
                changeWellbeing(1)
                obstacleY = 4
                gapX = randint(0, 4)
            }
        }
    }
    basic.clearScreen()
    busy = false
}
