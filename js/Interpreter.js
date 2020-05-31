class Interpreter {
    constructor () {
        this.code = []
        this.executions = 0
        this.history = undefined
        this.initalized = false
        this.input = []
        this.inPtr = 0
        this.jumps = [] 
        this.memory = []
        this.memPtr = 0
        this.output = []
        this.outPtr = 0
        this.running = false
        this.step = 0
        
        this.initalize()
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
                // jumps back, after the next loop command, if cell is not zero or undefined
                if (this.memory[this.memPtr] != 0 && this.memory[this.memPtr] != undefined) {
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
                        console.log(this.code)
                        throw new Error('jump without loop')
                    }
                }
                break
            case 'left':
                this.memPtr -= command.repeat
                if (this.memPtr < 0) this.memPtr = this.memory.length - 1
                break
            case 'loop':
                // jumps forward, after the next jump command, if cell is zero
                if (this.memory[this.memPtr] === 0) {
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
                            console.log(this.code)
                            throw new Error('loop without jump')
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
        this.history.push({
            command: command.code,
            memory: this.memory
        })
    }
    initalize () {
        this.code = []
        this.executions = 0
        this.history = []
        this.initalized = true
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
    run (code) {
        this.code = code
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