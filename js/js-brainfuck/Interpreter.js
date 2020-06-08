import { ExecuteError } from './ExecuteError.js'

class Interpreter {
    constructor () {
        this.code = []
        this.executions = 0
        this.input = []
        this.inPtr = 0
        this.jumps = [] 
        this.memory = []
        this.memPtr = 0
        this.output = []
        this.outPtr = 0
        this.running = false
        this.step = 0
    }
    execute (command) {
        switch (command.name) {
            case 'dec':
                if (!this.memory[this.memPtr]) this.memory[this.memPtr] = 0
                this.memory[this.memPtr] -= command.repeat + 1  
                break
            case 'inc':
                if (!this.memory[this.memPtr]) this.memory[this.memPtr] = 0
                this.memory[this.memPtr] += command.repeat + 1
                break
            case 'jump':
                // jumps back, after the next loop command, if cell is not undefined
                if (this.memory[this.memPtr]) {
                    // find last loop, search backwards
                    var found = false
                    for (var stpCnt = this.step; stpCnt >= 0; stpCnt--) {
                        var currCmd = this.code[stpCnt]
                        if (currCmd.name === 'loop') {
                            // set step and exit loop
                            this.step = stpCnt 
                            found = true
                            break
                        }
                    }
                    if (!found) {
                        throw new ExecuteError(this.code, this.step, ExecuteError.JUMP_WITHOUT_LOOP)
                    }
                }
                break
            case 'left':
                this.memPtr -= command.repeat
                // jump forward to the end, if pointer is less than zero.
                if (this.memPtr < 0) this.memPtr = this.memory.length - 1
                break
            case 'loop':
                // jumps forward, after the next jump command, if cell is undefiend
                if (!this.memory[this.memPtr]) {
                    // find next jump
                    var found = false
                    for (let stpCnt = this.step; stpCnt < this.code.length; stpCnt++) {
                        var currCmd = this.code[stpCnt]
                        if (currCmd.name === 'jump') {
                            this.step = stpCnt
                            found = true
                            break
                        }
                        if (!found) {
                            throw new ExecuteError(this.code, this.step, ExecuteError.LOOP_WITHOUT_JUMP)
                        }
                    }

                }
                break
            case 'read':
                this.memory[this.memPtr] = this.input[this.inPtr]
                this.inPtr++
                break
            case 'right':
                this.memPtr += command.repeat + 1
                // extend memory to the right if needed
                if (this.memory.length === 0 ||
                    this.memory.length - 1 < this.memPtr) this.memory.push(0)
                break
            case 'write':
                if (this.output.length) this.outPtr++
                this.output[this.outPtr] = this.memory[this.memPtr]
                break
        }
    }
    initalize () {
        this.executions = 0
        this.inPtr = 0
        this.jumps = [] 
        this.memory = []
        this.memPtr = 0
        this.output = []
        this.outPtr = 0
        this.running = false
        this.step = 0
    }
    run (code, input) {
        this.code = code
        if (input) this.input = input
        if (!this.running) this.running = true
        for (let step = this.step; step < code.length; step++) {
            var command = code[step]
            this.step = step
            this.execute(command)
            if (!this.running) break
        }
        return this.output
    }
}

export { Interpreter }