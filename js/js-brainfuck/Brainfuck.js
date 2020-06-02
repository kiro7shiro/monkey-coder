import { Interpreter } from "./Interpreter.js"

const LANGUAGE = {
    commands:[
        {
            code : '-',
            name : 'dec',
            repeat : 0,
            vector : 0
        },
        {
            code : '+',
            name : 'inc',
            repeat : 0,
            vector : 0.14285714285714285
        },
        {
            code : ']',
            name : 'jump',
            repeat : 0,
            vector : 0.2857142857142857
        },
        {
            code : '<',
            name : 'left',
            repeat : 0,
            vector : 0.42857142857142855
        },
        {
            code : '[',
            name : 'loop',
            repeat : 0,
            vector : 0.5714285714285714
        },
        {
            code : ',',
            name : 'read',
            repeat : 0,
            vector : 0.7142857142857143
        },
        {
            code : '>',
            name : 'right',
            repeat : 0,
            vector : 0.8571428571428571
        },
        {
            code : '.',
            name : 'write',
            repeat : 0,
            vector : 1
        }
    ],
    name : 'Brainfuck',
    version : 1.0
}

class Brainfuck {
    constructor () {
        this.lang = LANGUAGE
        this.code = []
        this.commands = this.lang.commands
        this.current = []
        this.interpreter = new Interpreter()        
    }
    compile (code) {
        var result = []
        for (let chrCnt = 0; chrCnt < code.length; chrCnt++) {
            var char = code[chrCnt]
            var command = this.commands.find(function(cmd) {
                return cmd.code === char
            })
            // make a shallow copy so we don't reference the language dictionary
            command = JSON.parse(JSON.stringify(command))
            // count command repeat
            if (command.name != 'jump' && command.name != 'loop') {
                while (code[chrCnt] === code[chrCnt + 1]) {
                    command.repeat += 1
                    chrCnt++
                }
            }
            result.push(command)
        }
        return result
    }
    decode (value) {
        if (value instanceof Array) {
            var result = []
            value.forEach(val => {result.push(this.decode(val))}, this)
            return result
        }
        var idx = (this.commands.length - 1) * value - 0 * value + 0
        return this.commands[idx.toFixed(0)].code
    }
    encode (string) {
        var result = []
        for (let cnt = 0; cnt < string.length; cnt++) {
            var chr = string[cnt]
            var idx = this.commands.findIndex(function(cmd) {
                return cmd.code === chr
            })
            result.push(this.commands[idx].vector)
        }
        return result
    }
    random () {
        var rnd = Math.random() * this.commands.length - 1
        return this.commands[Math.abs(rnd.toFixed(0))]
    }
    run (code, input) {
        var compiled = this.compile(code)
        this.current = compiled
        this.interpreter.initalize()
        this.interpreter.input = input
        return this.interpreter.run(compiled)
    }
}

export { Brainfuck }