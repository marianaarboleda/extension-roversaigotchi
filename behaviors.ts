/**
 * Roversaigotchi – pet behaviors, background loop, and event hooks.
 *
 * The turn upside down gesture and radio receiver are registered here at startup.
 * Each behavior sets _busy = true while it runs so the background
 * display loop pauses automatically without any extra wiring.
 */
namespace roversaPetBot {

    // Custom event handler – students can override the default friend
    // reaction with the onFriendNearby() block.
    let _friendHandler: (() => void) | null = null
    let _radioGroup = 0

    // ── Startup registrations ─────────────────────────────────────────────────

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
    //% block="start roversaPetBot || on radio group %radioGroup | with idle wellbeing impact %idleImpact | every %time seconds"
    //% weight=100
    //% group="Setup"
    //% radioGroup.defl=0
    //% idleImpact.defl=null
    //% time.defl=10
    export function start(radioGroup = 0, idleImpact:number = null, time = 10): void {
        _radioGroup = radioGroup
        if (_radioGroup == 0) {
            _radioGroup = randint(1, 6)
        }
        radio.setGroup(_radioGroup)
        // Background loop: updates the display and decays wellbeing every 2 s.
        // Pauses automatically while any behavior is running (_busy = true).
        control.inBackground(function () {
            while (true) {
                if (!_busy) {
                    showFace()
                    if (idleImpact == null) {
                        _idleWellbeing(-1)  // default wellbeing decay of –1 every 2 s
                    } else {
                        _idleWellbeing(idleImpact)
                    }
                }
                basic.pause(time * 1000)
            }
        })
    }

    /**
     * The pet's current radio group (1–6). Pets will only detect friends on the same group.
     * Set this at the start or change it later with radio.setGroup() blocks.
     */
    //% block="radio group"
    //% weight=95
    //% group="Setup"
    export function getRadioGroup(): number {
        return _radioGroup
    }

    // ── Display ───────────────────────────────────────────────────────────────

    export function showFace(): void {
        if (_wellbeing < 20) {
            basic.showIcon(IconNames.Angry)
        } else if (_wellbeing < 50) {
            basic.showIcon(IconNames.Sad)
        } else if (_wellbeing < 75) {
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
        // led.plotBarGraph(_wellbeing, 100)
        basic.showNumber(_wellbeing)
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
        music.setVolume(127)
        // show a few blinks before the lullaby starts
        start_time = 400
        for (let i = 0; i < 2; i++) {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                . # # # .
                . . . . .
                `)                      // eyes open
            basic.pause(start_time + i*50)
            basic.showIcon(IconNames.Asleep)                      // eyes closed
            basic.pause(start_time + i*50)
        }   
        _playLullaby()
        for (let i = 2; i < 4; i++) {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                . # # # .
                . . . . .
                `)                      // eyes open
            basic.pause(start_time + i*50)
            basic.showIcon(IconNames.Asleep)                      // eyes closed
            basic.pause(start_time + i*50)
        }  
        changeWellbeing(effect)
        // based on feedback: lullaby plays only once. We show sleeping face until waking up motion sets _sleeping = false
        while (_sleeping) {
            basic.showIcon(IconNames.Asleep)
            
            // roversa can rock back and forth while the lullaby plays
            // roversa.forward()
            // basic.pause(500)
            // roversa.stop()
            // basic.pause(500)
            // roversa.backward()
            // basic.pause(500)
            // roversa.stop()
        }

        // Wake-up sequence: blink the eyes open and closed
        music.stopAllSounds()
        music.setVolume(0)
        roversa.stop()
        start_time = 400
        _busy = false
    }

    /**
     * Wake the pet up if it is sleeping.
     * Wire this to whatever button or motion you want to use as the wake-up trigger
     * (for example a shake gesture, a button press, or turning the micro:bit over).
     * Does nothing if the pet is already awake.
     */
    //% block="wake up pet || with effect %effect || how %emotion"
    //% weight=85
    //% group="Behaviors"
    //% effect.defl=0
    //% emotion.defl="neutral"
    //% emotion.fieldEditor="gridpicker"
    //% emotion.fieldOptions.items="neutral, happy, surprised, angry"
    export function wakeUp(effect = 0, emotion = "neutral"): void {
        _sleeping = false   // interrupts the sleep loop in goSleep()
        
        for (let i = 0; i < 4; i++) {
            basic.showIcon(IconNames.Asleep)                      // eyes closed
            basic.pause(start_time - i*50)
            switch (emotion) {
            case 'angry': basic.showIcon(IconNames.Angry);
                break;
            case 'happy': basic.showIcon(IconNames.Happy);
                break;
            case 'surprised': basic.showIcon(IconNames.Surprised);
                break;
            case 'neutral':  basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                . # # # .
                . . . . .
                `)   
        }                 // eyes open
            basic.pause(start_time - i*50)
        }

        changeWellbeing(effect)

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
    //% effect.defl=30
    export function textFriend(effect = 30): void {
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
    //% effect.defl=null
    export function scrollSocialMedia(effect: number = null): void {
        _busy = true
        music.setVolume(200)
        if (effect == null) {
            effect = -15}

        // const icons = [
        //     IconNames.Heart, IconNames.Silly, IconNames.Angry,
        //     IconNames.Surprised, IconNames.Happy, IconNames.Skull,
        //     IconNames.Diamond, IconNames.Ghost
        // ]
        const texts = [
            "Like!", "50% OFF", "Follow!", "Share!", "GRWM",
            "LOL", "OMG", "Wow!", "VIRAL!", "FLASH NEWS!",
            "#trending"
        ]

        for (let i = 0; i < 2; i++) {
            basic.showString(texts[randint(0, texts.length - 1)])
            music.play(
                music.builtInPlayableMelody(Melodies.BaDing),
                music.PlaybackMode.UntilDone
            )
        }

        basic.clearScreen()
        roversa.stop()
        music.stopAllSounds()
        changeWellbeing(effect)
        _busy = false
    }

    /**
     * Reach out to a nearby friend via radio. Plays a searching animation
     * and sends a signal — a nearby pet will react if they receive it.
     */
    //% block="seek a friend || with effect %effect"
    //% weight=65
    //% group="Behaviors"
    //% effect.defl=5
    export function seekFriend(effect = 5): void {
        _busy = true
        music.setVolume(180)
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
        changeWellbeing(effect)
        _busy = false
    }

    // ── Event hooks ───────────────────────────────────────────────────────────

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
