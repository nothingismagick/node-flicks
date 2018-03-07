'use strict'

let expect = require('chai').expect
let Flicks = require('../index')

describe('#Flicks Lookup Table', function() {
    it('must lookup the mathematically correct value for a frequency of 1/second according to the spec', function() {
        let result = Flicks._LU[1]
        expect(result).to.equal(Flicks._per_second)
    })
    it('must not care if you pass a string or a number (as long as it looks the same)', function() {
        let result = Flicks._LU['1']
        expect(result).to.equal(Flicks._per_second)
    })
    it('must lookup the mathematically correct value because D.C. makes music at 120 bpm since it fits so well with 60 fps', function() {
        let result = Flicks._LU[120]
        expect(result).to.equal(Flicks._per_second / 120)
    })
})

describe('#Flicks Naming Conventions', function() {
    it('must return an array', function() {
        let result = Flicks._SI['septillion'].power
        expect(result).to.equal(24)
    })
    it('must show a shorthand label', function() {
        let result = Flicks._SI['quintillion'].short
        expect(result).to.equal('eF')
    })
    it('must show a long label', function() {
        let result = Flicks._SI['million'].long
        expect(result).to.equal('mega-Flicks')
    })
    it('must return a power value', function() {
        let result = Flicks._SI['septillion'].power
        expect(result).to.equal(24)
    })
    it('must throw an error if the selector is wrong', function() {
        try {
            expect(() => Flicks._SI['septtillion'].power).not.to.throw(Error)
        }
        catch (err) {
            expect(() => Flicks._SI['septtillion'].power).to.throw(Error)
        }
    })
})

describe('#Helpers', function() {
    it('_ratio should always resolve to 1.4172335600907028e-9', function() {
        let result = Flicks._ratio
        expect(result).to.equal(1.4172335600907028e-9)
    })

    it('_per_second should always be 705600000', function() {
        let result = Flicks._per_second
        expect(result).to.equal(705600000)
    })
    // TODO: change this from just being a stub
    it('_tickify should return an array', function() {
        let result = [] = Flicks._tickify(1204000)
        expect(result).to.eql([1204000, '1204 kF', '1204 kilo-Flicks'])
    })

    it('_parity should be true if the number of seconds converts to a Flick that is an integer', function() {
        let result = Flicks._parity(23425.333)
        expect(result).to.equal(true)
    })

    it('_parity must throw an error if the number of seconds converts to a Flick that is not an integer', function() {
        try {
            expect(() => Flicks._parity(23425.331)).not.to.throw(Error)
        }
        catch (err) {
            expect(() => Flicks._parity(23425.331)).to.throw(Error)
        }
    })

    it('_parity must throw an error if the number of seconds is passed as a string', function() {
        try {
            expect(() => Flicks._parity('23425.333')).not.to.throw(Error)
        }
        catch (err) {
            expect(() => Flicks._parity('23425.333')).to.throw(Error)
        }
    })
})

describe('#Flicks.in_seconds', function() {

    it('should never be negative', function () {
        let result = Flicks.in_seconds(-1)
        expect(result).to.equal(705600000)
    })

    it('should always be whole numbers', function () {
        let result = Flicks.in_seconds(1)
        expect(result).to.equal(705600000)
    })

    it('should not accept non-numbers', function () {
        try {
            expect(() => Flicks.in_seconds('1')).not.to.throw(Error)
        }
        catch (err) {
            expect(() => Flicks.in_seconds('1')).to.throw(Error)
        }
    })
})

describe('#Flicks.per_frame', function() {
    it('should correctly divide Flicks per second by frames per second', function () {
        let result = Flicks.per_frame(30)
        expect(result).to.equal(23520000)
    })

    it('should always return a positive number', function () {
        let result = Flicks.per_frame(-12000)
        expect(result).to.equal(58800)
    })

    it('non-numbers will not pass', function () {
        try {
            expect(() => Flicks.per_frame('1')).not.to.throw(Error)
        }
        catch (err) {
            expect(() => Flicks.per_frame('1')).to.throw(Error)
        }
    })
})

describe('#Flicks.computed_length', function() {
    it('should correctly divide Flicks per second by frames per second', function () {
        let result = Flicks.computed_length(3000, 30)
        expect(result).to.equal(63504000000000)
    })

    it('should always return a positive number', function () {
        let result = Flicks.computed_length(3000, -120)
        expect(result).to.equal(254016000000000)
    })

    it('non-numbers will not pass', function () {
        try {
            expect(() => Flicks.computed_length('1')).not.to.throw(Error)
        }
        catch (err) {
            expect(() => Flicks.computed_length('1')).to.throw(Error)
        }
    })
})


describe('#Flicks.to_timecode', function() {
    it('must create a valid timecode position when given ticks and fps #1', function() {
        let result = Flicks.to_timecode(564480000, 30)
        expect(result).to.equal("00:00:00.24")
    })
    it('must create a valid timecode position when given ticks and fps #2', function() {
        let result = Flicks.to_timecode(2145024000, 25)
        expect(result).to.equal("00:00:03.1")
    })
    /*
it('must create a valid timecode position when given ticks and fps #3', function() {
    let result = Flicks.to_timecode(42359520000, 30)
    expect(result).to.equal("00:01:00.1")
})

it('must create a valid timecode position when given Flicks in short form and fps', function() {
    let result = Flicks.to_timecode("564.48 mF", 120)
    expect(result).to.equal("00:00:03.1")
})
*/
})

