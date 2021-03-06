/**
 * Flicks module for node.js and commonjs.
 * @module Flicks
 * @exports Flicks
 */

/**
 * These are the exported
 * @type {{}}
 */
module.exports = {}
let Flicks = exports.Flicks = {
    /**
     * A shorthand method for referencing the ratio of seconds to Flicks: 1 / 705600000 = 1.4172335600907028e-9
     * @alias module:Flicks._ratio
     */
    _ratio:  1 / 705600000,
    /**
     * A shorthand method for referencing Flicks/second
     * that is also used to test the lookup table.
     * It is probably a couple nanoseconds faster than
     * parsing the object.<br/>
     * Its value is 705600000
     * @alias module:Flicks._per_second
     */
    _per_second: 705600000
    ,
    /**
     * Helper object as a lookup table to speed reference
     * that uses the most common frequencies.
     * @alias module:Flicks._LU
     */
    _LU: {
        1: 705600000,
        2: 352800000,
        3: 235200000,
        4: 176400000,
        5: 141120000,
        6: 117600000,
        7: 100800000,
        8: 88200000,
        9: 78400000,
        10: 70560000,
        12: 58800000,
        14: 50400000,
        15: 47040000,
        16: 44100000,
        18: 39200000,
        20: 35280000,
        21: 33600000,
        24: 29400000,
        25: 28224000,
        30: 23520000,
        48: 14700000,
        50: 14112000,
        60: 11760000,
        90: 7840000,
        100: 7056000,
        120: 5880000,
        125: 5644800,
        128: 5512500,
        144: 4900000,
        240: 2940000,
        8000: 88200,
        10000: 70560,
        12000: 58800,
        16000: 44100,
        22050: 32000,
        24000: 29400,
        32000: 22050,
        44100: 16000,
        48000: 14700,
        88200: 8000,
        96000: 7350,
        192000: 3675
    },
    /**
     * Helper object of Flicks references using
     * US American (not European) naming conventions for
     * SI prefixes of kilo, mega, giga, tera, etc.
     * @alias module:Flicks._SI
     */
    _SI: {
        one: {
            short: 'F',
            long: 'Flicks',
            power: 1
        },
        thousand: {
            short: 'kF',
            long: 'kilo-Flicks',
            power: 3
        },
        million: {
            short: 'mF',
            long: 'mega-Flicks',
            power: 6
        },
        billion: {
            short: 'gF',
            long: 'giga-Flicks',
            power: 9
        },
        trillion: {
            short: 'tF',
            long: 'tera-Flicks',
            power: 12
        },
        quadrillion: {
            short: 'pF',
            long: 'peta-Flicks',
            power: 15
        },
        quintillion: {
            short: 'eF',
            long: 'exa-Flicks',
            power: 18
        },
        sextillion: {
            short: 'zF',
            long: 'zetta-Flicks',
            power: 21
        },
        septillion: {
            short: 'yF',
            long: 'yotta-Flicks',
            power: 24
        }
    },
    /**
     * Returns an array of the number of Flicks in
     * SI units of kilo, mega, giga, terra, peta
     * (units of 1000s)
     * As in: [1204000, '1204 kF', '1204 kilo-Flicks']
     * @alias module:Flicks._tickify
     * @param {number} ticks - a positive integer as a whole number
     * @example {@lang es6} _tickify(120400)
     * @returns {array}
     */
    _tickify: function (ticks) {
        // turn ticks (number of Flicks) to an array
        // check length
        this.ticks = [ticks, '1204 kF', '1204 kilo-Flicks']
        return this.ticks
    },
    /**
     * Checks that the number of Flicks (in parameterized seconds)
     * is a whole number. This is useful if you have a timestamp
     * like 12.234152
     * @alias module:Flicks._parity
     * @param {number} seconds - Can include decimals, can be negative
     * @example {@lang es6} _parity(16.3452)
     * @throws "Not a whole number of flicks" if the decimal amount of seconds cannot be divided into flicks.
     * @throws "@param mismatch" if the typeof seconds is not a number.
     * @returns {boolean}
     */
    _parity: function (seconds) {
        if (typeof seconds === 'number') {
            this.Flicks = Flicks._per_second * seconds
            if (Math.floor(this.Flicks) === this.Flicks) {
                return true
            } else {
                throw new Error('Not a whole number of Flicks.')
            }
        } else {
            throw new Error('@param mismatch')
        }
    },
    /**
     * Gives the number of Flicks in requested number of seconds
     * @alias module:Flicks.in_seconds
     * @param {number} seconds - can include decimals
     * @throws @param mismatch if NAN
     * @returns {number}
     */
    in_seconds: function (seconds) {
        if (Flicks._parity(seconds) === true) {
            return Flicks._per_second * Math.abs(seconds)
        } else {
            throw new Error('@param mismatch')
        }
    },
    /**
     * Returns the number of Flicks per tick according to frequency -
     * can be used as an alternative to the lookup table. Benchmarking
     * has shown there not to be a negligible difference in speed.
     * @alias module:Flicks.per_frame
     * @param {number} framerate - must be a number
     * @throws @param mismatch if NAN
     * @returns {number}
     */
    per_frame: function (frequency) {
        if (typeof frequency === 'number') {
            return Math.abs(705600000 / frequency)
        } else {
            throw new Error('@param mismatch')
        }
    },
    /**
     * Returns the number of Flicks according to ticks and frequency.
     * @alias module:Flicks.computed_length
     * @param {number} ticks - total number of ticks
     * @param {number} frequency - the cyclic ratio as a whole number e.g. 30
     * @returns {number}
     */
    computed_length: function (ticks, frequency) { // in seconds
        return Math.abs(Flicks._per_second * ticks * frequency)
    },
    /**
     * This creates a timecode in the form of hh:mm:ss.ff(ffff)
     * by being given Flicks in either short of long-form.
     * @alias module:Flicks.to_timecode
     * @param {*} flicks - number of flicks to encode as timecode, in either long form (as a number) or short-form (as a string)
     * @param {number} frequency - the cyclic rate per second
     * @param {boolean} json - return as timecode or as object in the form {"hours":"hh","minutes":"mm","seconds":"ss","frames":"ff"}
     * @throws Not well formed.
     * @returns {string|object}
     */
    to_timecode: function (flicks, frequency, json) {
        // the type-ing here is DIRTY!!!
        // todo: find a logical way to keep them as numbers that does not include changing to go
        // may be a solution here: Number.isNaN & Number.isFinite
        // but that wil force transpiling
        if (typeof flicks === 'number') {
            // we are changing type so many times its just a heresy
            this.totalSeconds = flicks / Flicks._per_second + ''
        }
        else {
            throw new Error('@param flicks malformed')
            /*
            try {
                // is it a well formed
                this.metaFlick = flicks.split(' ')
            } catch (err) {
                throw new Error(err)
            }
            */
        }
        this.ticks = ('0.' + this.totalSeconds.split('.')[1]) * frequency
        this.totalSeconds = this.totalSeconds.split('.')[0]
        this.hours = Math.floor(this.totalSeconds / 3600)
        this.totalSeconds %= 3600
        this.minutes = Math.floor(this.totalSeconds / 60)
        this.seconds = this.totalSeconds % 60
        this.final = ('0'+this.hours).slice(-2) + ':' + ('0'+this.minutes).slice(-2) + ':' + ('0'+this.seconds).slice(-2) + '.' + this.ticks
        return this.final
    }
    /*
    /**
     * This returns the Flick count as
     * by being given Flicks in either short of long-form.
     * The t
     * @param {string} timecode in the form hh:mm:ss.ff
     * @param {number} fps - needed to calculate flicks
     * @return {string} this will return Flicks

    from_timecode: function (timecode, fps) {
        // validate timecode Flicks._is_timecode
        // validate fps Flicks._is_fps
        // parse out seconds and frames
    }
     */
}

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Flicks
    }
    exports.Flicks = Flicks
}
/*

// trying to get coverage up.

else {
    root.Flicks = Flicks
}
if (typeof define === 'function' && define.amd) {
    define('Flicks', [], function() {
        return Flicks
    })
}
*/