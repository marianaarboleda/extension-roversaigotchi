/**
 * Roversaigotchi – a Tamagotchi-like pet for micro:bit v2 with Roversa.
 * This file declares all shared state and the wellbeing system.
 * It must be listed first in pxt.json so other files can reference these exports.
 */
//% color=#E83562 icon="\uf1b0" block="Roversai"
//% groups=["Setup", "Wellbeing", "Behaviors", "Events"]
namespace roversai {

    // ── Shared state ──────────────────────────────────────────────────────────
    // Exported so game.ts and behaviors.ts can read/write them directly.
    // The leading underscore signals "internal – not a student block."

    export let _wellbeing = 50   // 0–100
    export let _busy = false     // true while any behavior is running
    export let _sleeping = false // true while the pet is asleep
    export let _gameRunning = false

    // ── Student-facing wellbeing blocks ───────────────────────────────────────

    /**
     * The pet's current wellbeing level (0–100).
     */
    //% block="wellbeing"
    //% weight=90
    //% group="Wellbeing"
    export function getWellbeing(): number {
        return _wellbeing
    }

    /**
     * Change the pet's wellbeing by a positive or negative amount.
     * Automatically stays between 0 and 100.
     */
    //% block="change wellbeing by %amount"
    //% weight=80
    //% group="Wellbeing"
    //% amount.min=-100 amount.max=100
    export function changeWellbeing(amount: number): void {
        _wellbeing = Math.max(0, Math.min(100, _wellbeing + amount))
    }

    // Internal: called every 2 s by the background loop in behaviors.ts
    export function _decayWellbeing(): void {
        _wellbeing = Math.max(0, _wellbeing - 1)
    }
}
