/**
 * Roversaigotchi – pet behaviors, background loop, and event hooks.
 *
 * The turn upside down gesture and radio receiver are registered here at startup.
 * Each behavior sets _busy = true while it runs so the background
 * display loop pauses automatically without any extra wiring.
 */
namespace roversaigotchi {

    // Custom event handlers – students can override defaults with
    // onCustomWake() and onFriendNearby() blocks.
    let _wakeHandler: (() => void) | null = null
    let _friendHandler: (() => void) | null = null
    let _radioTick = 0

    // ── Startup registrations ─────────────────────────────────────────────────

    // Turn upside down: wake the pet if asleep, otherwise run the default angry reaction
    // (or a custom handler if the student provided one).
    input.onGesture(Gesture.ScreenDown, function () {
        if (_sleeping) {
            _sleeping = false          // interrupts the lullaby loop in goSleep()
        } else if (_wakeHandler) {
            _wakeHandler()
        } else {
            // Default: angry reaction
            music.play(
                music.builtInPlayableMelody(Melodies.Dadadadum),
                music.PlaybackMode.InBackground
            )
            music.setVolume(255)
            changeWellbeing(-10)
            basic.showIcon(IconNames.Angry)
            basic.pause(1000)
        }
    })

    // Radio: detect a nearby friend (signal strength > –80 filters for proximity)
    radio.onReceivedString(function (receivedString: string) {
        if (!_busy && radio.receivedPacket(RadioPacketProperty.SignalStrength) > -80) {
            if (_friendHandler) {
                _friendHandler()
            } else {
                // Default friend reaction
                _busy = true
                music.play(
                    music.builtinPlayableSoundEffect(soundExpression.giggle),
                    music.PlaybackMode.UntilDone
                )
                basic.showIcon(IconNames.Rabbit)
                changeWellbeing(20)
                basic.pause(3000)
                basic.clearScreen()
                _busy = false
            }
        }
    })

    // ── Setup ─────────────────────────────────────────────────────────────────

    /**
     * Start the pet. Call this once in "on start".
     * Sets the radio group and launches the background display loop.
     */
    //% block="start roversaigotchi"
    //% weight=100
    //% group="Setup"
    export function start(): void {
        radio.setGroup(1)
        // Background loop: updates the display and decays wellbeing every 2 s.
        // Pauses automatically while any behavior is running (_busy = true).
        control.inBackground(function () {
            while (true) {
                if (!_busy) {
                    _radioTick += 1
                    if (_radioTick % 5 == 0) {
                        radio.sendString("hey!")     // broadcast every 10 s
                    }
                    showFace()
                    _decayWellbeing()
                }
                basic.pause(2000)
            }
        })
    }

    // ── Display ───────────────────────────────────────────────────────────────

    export function showFace(): void {
        if (_wellbeing < 50) {
            basic.showIcon(IconNames.Angry)
        } else if (_wellbeing < 70) {
            basic.showIcon(IconNames.Sad)
        } else if (_wellbeing < 80) {
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

    /**
     * Display a bar graph of the pet's wellbeing for 3 seconds.
     */
    //% block="show wellbeing stats"
    //% weight=50
    //% group="Wellbeing"
    export function showStats(): void {
        _busy = true
        led.plotBarGraph(_wellbeing, 100)
        basic.pause(3000)
        basic.clearScreen()
        _busy = false
    }

    // ── Behaviors ─────────────────────────────────────────────────────────────

    /**
     * Put the pet to sleep. Plays a lullaby on loop until the
     * micro:bit is turned upside down, then plays the wake-up animation.
     */
    //% block="go to sleep || with effect %effect"
    //% weight=90
    //% group="Behaviors"
    //% effect.defl=20
    export function goSleep(effect = 20): void {
        _busy = true
        _sleeping = true
        basic.showIcon(IconNames.Asleep)

        music.setVolume(127)
        // Lullaby loops until turn upside down sets _sleeping = false
        while (_sleeping) {
            _playLullaby()
            roversa.forward()
            basic.pause(500)
            roversa.stop()
            basic.pause(500)
            roversa.backward()
            basic.pause(500)
            roversa.stop()
        }

        // Wake-up sequence
        music.stopAllSounds()
        music.setVolume(0)
        roversa.stop()
        for (let i = 0; i < 3; i++) {
            basic.pause(500)
            basic.showIcon(IconNames.Confused)
            basic.pause(500)
            basic.showIcon(IconNames.Asleep)
        }

        changeWellbeing(effect)
        _busy = false
    }

    /**
     * Take the pet for a run. Moves randomly and affects wellbeing.
     */
    //% block="go for a run || with effect %effect"
    //% weight=80
    //% group="Behaviors"
    //% effect.defl=10
    export function goRun(effect = 10): void {
        _busy = true

        for (let i = 0; i < 2; i++) {
            basic.showIcon(IconNames.Heart)
            basic.pause(500)
            basic.showIcon(IconNames.SmallHeart)
            basic.pause(500)
        }

        music.play(
            music.builtInPlayableMelody(Melodies.Chase),
            music.PlaybackMode.InBackground
        )

        for (let i = 0; i < 4; i++) {
            roversa.driveForwards(randint(500, 1500))
            if (Math.randomBoolean()) {
                roversa.right()
            } else {
                roversa.left()
            }
        }

        music.stopAllSounds()

        for (let i = 0; i < 6; i++) {
            basic.showIcon(IconNames.Heart)
            basic.pause(100)
            basic.showIcon(IconNames.SmallHeart)
            basic.pause(100)
        }

        changeWellbeing(effect)
        _busy = false
    }

    /**
     * Send a message to a friend. Plays a ringtone and affects wellbeing.
     */
    //% block="text a friend || with effect %effect"
    //% weight=75
    //% group="Behaviors"
    //% effect.defl=15
    export function textFriend(effect = 15): void {
        _busy = true
        music.setVolume(255)
        basic.showString("Hello!")
        roversa.turnRight(45)
        roversa.backward()
        roversa.turnLeft(45)
        basic.showString(". . .")
        music.play(
            music.builtInPlayableMelody(Melodies.Ringtone),
            music.PlaybackMode.InBackground
        )
        basic.showIcon(IconNames.Heart)
        basic.pause(2000)
        music.stopAllSounds()
        changeWellbeing(effect)
        _busy = false
    }

    /**
     * Simulate scrolling social media. Rapid pings and flashing icons
     * overstimulate the pet, draining wellbeing.
     */
    //% block="scroll social media || with effect %effect"
    //% weight=70
    //% group="Behaviors"
    //% effect.defl=-15
    export function scrollSocialMedia(effect = -15): void {
        _busy = true
        music.setVolume(200)

        const icons = [
            IconNames.Heart, IconNames.Silly, IconNames.Angry,
            IconNames.Surprised, IconNames.Happy, IconNames.Skull,
            IconNames.Diamond, IconNames.Ghost
        ]

        for (let i = 0; i < 8; i++) {
            basic.showIcon(icons[randint(0, icons.length - 1)])
            music.play(
                music.builtInPlayableMelody(Melodies.BaDing),
                music.PlaybackMode.UntilDone
            )
            // Random twitch
            if (Math.randomBoolean()) {
                roversa.driveForwards(randint(50, 150))
            } else {
                roversa.right()
                basic.pause(100)
                roversa.stop()
            }
        }

        basic.clearScreen()
        roversa.stop()
        music.stopAllSounds()
        changeWellbeing(effect)
        _busy = false
    }

    // ── Event hooks ───────────────────────────────────────────────────────────

    /**
     * Run custom code when the micro:bit is turned upside down (and the pet is not asleep).
     * Replaces the default angry reaction.
     */
    //% block="on wake"
    //% weight=90
    //% group="Events"
    export function onCustomWake(handler: () => void): void {
        _wakeHandler = handler
    }

    /**
     * Run custom code when a friend's pet is detected nearby via radio.
     * Replaces the default rabbit reaction.
     */
    //% block="on friend nearby"
    //% weight=80
    //% group="Events"
    export function onFriendNearby(handler: () => void): void {
        _friendHandler = handler
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    export function _playLullaby(): void {
        music.playMelody(
            "E4:1 E4:1 G4:4 " +
            "E4:1 E4:1 G4:4 " +
            "E4:1 G4:1 C5:2 B4:2 A4:2 A4:2 G4:4 " +
            "D4:1 E4:1 F4:2 D4:2 " +
            "D4:1 E4:1 F4:2 D4:2 " +
            "F4:1 B4:1 A4:1 G4:2 B4:2 C5:4",
            60
        )
    }
}
