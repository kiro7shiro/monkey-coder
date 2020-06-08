import { Brainfuck } from './js-brainfuck/Brainfuck.js'
import { Messanger } from './js-events/Messanger.js'

class Monkey2 extends Messanger {
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
        this.lastMem = undefined
        this.targetCommand = undefined

        this.brain.onerror = this.brainOnError.bind(this)
        this.brain.onmessage = this.brainOnMessage.bind(this)
    }
    brainOnError () {}
    brainOnMessage (message) {
        let {command, data} = message.data
        console.log('monkeys brain', {command, data})
        switch (command) {
            case 'makeCode':
                this.code.push(...this.brainfuck.decode(data))
                let input = this.inputs[this.inpCnt].code
                let {errors, memory, output} = this.brainfuck.run(this.code, input)
                this.error = this.calcError(errors, memory, output)
                this.findTargetCommand()
                break
            case 'evolve':
                this.post('update', {
                    code: code.join(''),
                    error,
                    inpCnt
                })
                this.evolve()
                break
            default:
                // TODO : make error handler
                break
        }
    }
    calcError(errors, memory, output) {
        console.log({errors, memory, output})
        let err = 0
        let target = this.inputs[this.inpCnt].vector[this.inputs[this.inpCnt].vector.length - 1]
        // errors
        if (errors.length) err += errors.length * 0.1
        // memory, difference to last memory 
        // difference to target? - may not
        
        // output
        if (!output || !output.length) output = [0]
        err = output.reduce((acc, curr) => {
            return acc += Math.abs(target - (curr || 0))
        }, err)
        console.log(err)
    }
    evolve () {
        // check if end goals reached
        if (this.code.length === this.config.codeLen && this.inpCnt === this.inputs.length - 1) {
            this.post('done', {
                code: code.join(''),
                error,
                id
            })
        }else if (this.code.length === this.config.codeLen) {
            this.code = []
            this.inpCnt++
        }
        // activate brain
        this.brain.postMessage({
            command : 'activate',
            data : {config: this.config, input : this.inputs[this.inpCnt]}
        })
    }
    findTargetCommand () {
        this.targetCommand = undefined
        let lastCmd = this.code.splice(-1, 1)
        let cmds = this.brainfuck.commands.filter(cmd => {
            return cmd.code !== lastCmd[0]
        })
        for (let cmdCnt = 0; cmdCnt < cmds.length; cmdCnt++) {
            const cmd = cmds[cmdCnt]
            this.code.push(cmd.code)
            let {errors, memory, output} = run()
            let err = calcError(errors, memory, output)
            // console.log({err, cmd: cmd.code})
            if (err < error) {
                targetCommand = cmd
                error = err
            }
            this.code.pop()
        }
        this.code.push(...lastCmd)
        if (!this.targetCommand) this.targetCommand = brainfuck.random()
        brain.postMessage({
            command : 'propagate',
            data : this.targetCommand
        })
    }
}

export { Monkey2 }