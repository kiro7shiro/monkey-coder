import { Brainfuck } from './js-brainfuck/Brainfuck.js'

let brain = undefined
let brainfuck = new Brainfuck()
let code = []
let config = undefined
let error = 0
let inputs = []
let inpCnt = 0
let lastStep = undefined
let targetCommand = undefined

function brainOnMessage(message) {
    let {command, data} = message.data
    // console.log('monkeys brain', {command, data})
    switch (command) {
        case 'makeCode':
            code.push(...brainfuck.decode(data))
            let output = brainfuck.run(code, inputs[inpCnt].code)
            let history = brainfuck.interpreter.history
            error = calcError(output, history)
            findTargetCommand()
            
            break
        case 'evolve':
            postMessage({
                command : 'update',
                data: {code: code.join(''), error}
            })
            onmessage(message)
            break
        default:
            // TODO : make error handler
            break
    }
}

function calcError(output, history) {
    if (!output.length) output.push(0)
    let err = 0
    let target = inputs[inpCnt].vector[inputs[inpCnt].vector.length - 1]
    err = output.reduce((acc, curr) => {
        return acc += Math.abs(target - (curr || 0))
    }, err)
    
    // TODO : score memory history
    let step = history[history.length - 1]
    if (lastStep) {
        let memErr = 0
        let memTrg = inputs[inpCnt].code[inputs[inpCnt].code.length - 1]
        if (!step.memory.length) step.memory.push(0)
        memErr = step.memory.reduce((acc, curr) => {
            return acc += Math.abs(memTrg - (curr || 0))
        }, memErr)
        // console.log({
        //     last : lastStep.command + ' ' + lastStep.memory.toString(),
        //     curr: step.command + ' ' + step.memory.toString(),
        //     memErr,
        //     memTrg
        // })
    }
    lastStep = step

    return err
}

function findTargetCommand() {
    targetCommand = undefined
    let lastCmd = code.splice(-1, 1)
    let cmds = brainfuck.commands.filter(cmd => {
        return cmd.code !== lastCmd[0]
    })
    for (let cmdCnt = 0; cmdCnt < cmds.length; cmdCnt++) {
        const cmd = cmds[cmdCnt]
        code.push(cmd.code)
        let output = brainfuck.run(code, inputs[inpCnt].code)    
        let history = brainfuck.interpreter.history
        let err = calcError(output, history)
        // console.log({err, cmd: cmd.code})
        if (err < error) {
            targetCommand = cmd
            error = err
        }
        code.pop()
    }
    code.push(...lastCmd)
    if (!targetCommand) targetCommand = brainfuck.random()
    brain.postMessage({
        command : 'propagate',
        data : targetCommand
    })
}

onmessage = function (message) {
    let {command, data} = message.data
    console.log('monkey', {command, data})
    switch (command) {
        case 'evolve':
            if (!config) config = data.config
            if (!inputs.length) inputs = data.inputs
            if (!brain) {
                // init brain
                brain = new Worker('./Brain.js')
                brain.onmessage = brainOnMessage
                brain.postMessage({
                    command : 'activate',
                    data : {
                        config,
                        input : inputs[inpCnt]
                    }
                })
                inpCnt++
                break
            }
            // activate brain
            if (code.length === config.codeLen && inpCnt === inputs.length) {
                postMessage({
                    command : 'done',
                    data : code
                })
            }
            if (code.length >= config.codeLen) {
                code = []
                inpCnt++
                if (inpCnt === inputs.length) inpCnt = 0
            }
            brain.postMessage({
                command : 'activate',
                data : {input : inputs[inpCnt]}
            })
            break
    }
    
}