import { Brainfuck } from './js-brainfuck/Brainfuck.js'
import { Messanger } from './js-events/Messanger.js'

class Monkey extends Messanger {
    constructor(config, id, inputs) {
        super()
        this.code = []
        this.config = config
        this.brain = new Worker('./js/Brain.js')
        this.brainfuck = new Brainfuck()
        this.error = 0
        this.id = id
        this.inputs = inputs
        this.inpCnt = 0
        this.lastMem = []
        this.targetCommand = undefined

        this.brain.onerror = this.brainOnError.bind(this)
        this.brain.onmessage = this.brainOnMessage.bind(this)
    }
    brainOnError (error) {
        console.log('brain error', error)
    }
    brainOnMessage (message) {
        let {command, data} = message.data
        // console.log('monkeys brain', {command, data})
        switch (command) {
            case 'makeCode':
                this.code.push(...this.brainfuck.decode(data))
                let input = this.inputs[this.inpCnt].code
                let {errors, memory, output} = this.brainfuck.run(this.code, input)
                this.error = this.calcError(errors, memory, output)
                this.targetCommand = this.findTargetCommand()
                console.log({
                    error : this.error,
                    trgCmd: this.targetCommand.code
                })
                this.brain.postMessage({
                    command : 'propagate',
                    data : this.targetCommand
                })
                break
            case 'evolve':
                this.post('update', {
                    code: this.code.join(''),
                    error: this.error,
                    inpCnt: this.inpCnt
                })
                this.evolve()
                break
            default:
                // TODO : make error handler
                break
        }
    }
    calcError(errors, memory, output) {
        // console.log({errors, memory, output})
        let memDiff = 0
        let error = 0
        let target = this.inputs[this.inpCnt].vector[this.inputs[this.inpCnt].vector.length - 1]
        let memTrg = this.inputs[this.inpCnt].code[this.inputs[this.inpCnt].code.length - 1]
        // errors
        if (errors.length) error += errors.length * 0.1
        // memory
        if (!memory || !memory.length) memory = [0]
        memDiff = memory.reduce((acc, curr) => {
            return acc += Math.abs(memTrg - (curr || 0))
        }, memDiff)
        // output
        if (!output || !output.length) output = [0]
        error = output.reduce((acc, curr) => {
            return acc += Math.abs(target - (curr || 0))
        }, error)
        error += memDiff
        return error
    }
    evolve () {
        // check if end goals reached
        if (this.code.length === this.config.codeLen && this.inpCnt === this.inputs.length - 1) {
            this.post('done', {
                code: this.code.join(''),
                error: this.error,
                id: this.id
            })
            return
        }else if (this.code.length === this.config.codeLen) {
            this.code = []
            this.inpCnt++
        }
        // activate brain
        this.brain.postMessage({
            command : 'activate',
            data : {
                config: this.config,
                input : this.inputs[this.inpCnt]
            }
        })
    }
    findTargetCommand () {
        let trgCmd = undefined
        let lastCmd = this.code.splice(-1, 1)
        let cmds = this.brainfuck.commands.filter(cmd => {
            return cmd.code !== lastCmd[0]
        })
        for (let cmdCnt = 0; cmdCnt < cmds.length; cmdCnt++) {
            const cmd = cmds[cmdCnt]
            this.code.push(cmd.code)
            let input = this.inputs[this.inpCnt].code
            let {errors, memory, output} = this.brainfuck.run(this.code, input)
            let err = this.calcError(errors, memory, output)
            if (err < this.error) {
                trgCmd = cmd
                this.error = err
            }
            this.code.pop()
        }
        this.code.push(...lastCmd)
        if (!trgCmd) trgCmd = this.brainfuck.random()
        return trgCmd
    }
}

export { Monkey }