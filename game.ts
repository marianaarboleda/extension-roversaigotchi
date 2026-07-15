/**
 * Roversaigotchi – obstacle mini-game.
 *
 * Buttons A (move left) and B (move right) are registered here at startup.
 * They are guarded by _gameRunning so they are silent outside the game.
 * Students can also register their own A/B handlers — MakeCode runs all
 * registered handlers for the same event, so there is no conflict.
 */
namespace roversaPetBot {

    let _birdX = 2
    let _obstacleY = 4
    let _gapX = 0

    // Register controls once at startup
    input.onButtonPressed(Button.A, function () {
        if (_gameRunning && _birdX > 0) {
            _birdX -= 1
        }
    })

    input.onButtonPressed(Button.B, function () {
        if (_gameRunning && _birdX < 4) {
            _birdX += 1
        }
    })

    function _drawGame(): void {
        basic.clearScreen()
        led.plot(_birdX, 0)                   // bird on top row
        for (let x = 0; x <= 4; x++) {
            if (x != _gapX) {
                led.plot(x, _obstacleY)       // obstacle row with gap
            }
        }
    }

    /**
     * Run the obstacle mini-game. The pet dodges rising obstacle rows.
     * Press A to move left, B to move right.
     * Surviving a wave: wellbeing +1.
     * After 5 waves, wellbeing decreases by 2 for each additional wave survived.
     * Returns automatically when the game ends.
     */
    //% block="play obstacle game || with effects %effect_win_level|%effect_lose" 
    //% weight=70
    //% group="Behaviors"
    //% effect_win_level.defl=1
    //% effect_lose.defl=null
    export function playGame(effect_win_level = 1, effect_lose:number = null): void {
        _busy = true
        _gameRunning = true
        _birdX = 2
        _obstacleY = 4
        _gapX = randint(0, 4)
        let _game_speed = 700
        let _levels = 0
        if (effect_lose == null) {
            effect_lose = -2
        }

        while (_gameRunning) {
            _drawGame()
            basic.pause(_game_speed)
            _obstacleY -= 1

            if (_obstacleY == 0) {
                if (_birdX != _gapX) {
                    // Collision – game over
                    _gameRunning = false
                    basic.clearScreen()
                    basic.showString("GAME OVER")
                } else {
                    // Survived this wave – spawn next
                    changeWellbeing(effect_win_level)
                    _obstacleY = 4
                    _gapX = randint(0, 4)
                    _game_speed -= 20  // Increase difficulty
                    _levels += 1
                }
            }
        }
        if (_levels > 5){
            changeWellbeing(effect_lose*(_levels-5))  // longer play, more decrease in wellbeing
        }
        basic.clearScreen()
        _busy = false
    }
}
