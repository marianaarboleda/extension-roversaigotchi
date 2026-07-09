/**
 * ────────────────────────────────────────────────────────────────
 * 
 * Roversa PetBot — BLOCKS edition (behind-the-scenes demo)
 * 
 * This is the SAME pet as the roversaPetBot extension, but rebuilt
 * 
 * out of standard MakeCode blocks instead of hidden extension code. Open it
 * 
 * in MakeCode and click "Blocks" to see how every behavior is assembled.
 * 
 * Use it to invent your own behaviors: copy a function, swap the icons,
 * 
 * sounds and robot moves, then wire it to a button.
 * 
 * ────────────────────────────────────────────────────────────────
 */
// Show the current mood as a number for 3 seconds.
function showStats () {
    busy = true
    basic.showNumber(wellbeing)
    basic.pause(3000)
    basic.clearScreen()
    busy = false
}
// ── Behaviors ──────────────────────────────────────────────────────────────
// Go for a run: hearts, upbeat music, and random driving. Good for the pet.
function goRun () {
    busy = true
    for (let index = 0; index < 2; index++) {
        basic.showIcon(IconNames.Heart)
        basic.pause(500)
        basic.showIcon(IconNames.SmallHeart)
        basic.pause(500)
    }
    music.play(music.builtInPlayableMelody(Melodies.Chase), music.PlaybackMode.InBackground)
    for (let index = 0; index < 4; index++) {
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
// Scroll social media: fast, flashing, noisy — and it drains the pet's mood.
function scrollSocialMedia () {
    busy = true
    texts = [
    "Like!",
    "50% OFF",
    "Follow!",
    "Share!",
    "LOL",
    "OMG",
    "VIRAL!"
    ]
    for (let index = 0; index < 2; index++) {
        music.play(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.UntilDone)
        basic.showString("" + (texts[randint(0, texts.length - 1)]))
    }
    basic.clearScreen()
    changeWellbeing(-15)
    busy = false
}
// A/B move the bird left and right — but only while the game is running.
input.onButtonPressed(Button.A, function () {
    if (gameRunning && birdX > 0) {
        birdX += -1
    }
})
// ── Buttons: wire each activity to a Roversa touch pad ─────────────────────
roversa.onEvent(RoversaPin.P16, RoversaEvent.Click, function () {
    playGame()
})
roversa.onEvent(RoversaPin.P9, RoversaEvent.Click, function () {
    scrollSocialMedia()
})
// Add (or subtract) from the mood and keep it between 0 and 100.
function changeWellbeing (amount: number) {
    wellbeing = Math.constrain(wellbeing + amount, 0, 100)
}
// Go to sleep: blink, play a lullaby once, then stay asleep showing the sleep
// face until someone shakes the pet awake (the shake handler sets sleeping =
// false). Waking up restores the pet's mood.
function goSleep (sleeping: boolean) {
    busy = true
    for (let index = 0; index < 2; index++) {
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
    music.play(music.builtInPlayableMelody(Melodies.PowerDown), music.PlaybackMode.InBackground)
    changeWellbeing(20)
    basic.showIcon(IconNames.Asleep)
    basic.pause(5000)
    busy = false
}
// Seek a friend: play a searching tune and send a radio hello. A nearby pet
// running this same program will hear it and react (see "on radio received").
function seekFriend () {
    busy = true
    for (let index = 0; index < 3; index++) {
        basic.showIcon(IconNames.Heart)
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
roversa.onEvent(RoversaPin.P13, RoversaEvent.Click, function () {
    goRun()
})
// Play the obstacle game: dodge the rising wall by moving through its gap.
// A moves left, B moves right. Survive a wave: +1. Get hit: −10 and game over.
function playGame () {
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
// Text a friend: a ringtone, a little dance, and a heart. Cheers the pet up.
function textFriend () {
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
// Shake to wake the pet up when it is asleep.
input.onGesture(Gesture.ScreenDown, function () {
    for (let index = 0; index < 2; index++) {
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
    sleeping = false
})
// A friend's pet said hello over the radio: giggle and cheer up.
radio.onReceivedString(function (receivedString) {
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
input.onButtonPressed(Button.B, function () {
    if (gameRunning && birdX < 4) {
        birdX += 1
    }
})
roversa.onEvent(RoversaPin.P14, RoversaEvent.Click, function () {
    sleeping = true
    goSleep(sleeping)
})
roversa.onEvent(RoversaPin.P8, RoversaEvent.Click, function () {
    if (gameRunning == false) {
        seekFriend()
    }
})
roversa.onEvent(RoversaPin.P5, RoversaEvent.Click, function () {
    showStats()
})
roversa.onEvent(RoversaPin.P15, RoversaEvent.Click, function () {
    textFriend()
})
// ── The pet's face ─────────────────────────────────────────────────────────
// The face is just the wellbeing number turned into an icon. Change these
// thresholds or icons to give your pet a different personality.
function showFace () {
    if (sleeping) {
        basic.showIcon(IconNames.Asleep)
    } else {
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
}
let sleeping = false
let gapX = 0
let gameRunning = false
let texts: string[] = []
let busy = false
let obstacleY = 0
let birdX = 0
let wellbeing = 0
// ── The pet's memory (variables) ──────────────────────────────────────────
// wellbeing is the pet's mood, 0–100. The flags stop behaviors from fighting
// over the screen: while one behavior runs, the idle loop waits its turn.
wellbeing = 50
// game state (only used while the obstacle game is running)
birdX = 2
obstacleY = 4
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
