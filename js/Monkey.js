/**
 * Represents a monkey.
 */
import { Brainfuck } from './js-brainfuck/Brainfuck.js'
import { ExecuteError } from './js-brainfuck/ExecuteError.js'

let brain = undefined
let brainfuck = new Brainfuck()
let code = []
let config = undefined
let error = 0
let id = -1
let inputs = []
let inpCnt = 0
let lastStep = undefined
let targetCommand = undefined

/**
 * Callback for brains worker.
 * @param {Object} message 
 */
function brainOnMessage(message) {
    let {command, data} = message.data
    // console.log('monkeys brain', {command, data})
    switch (command) {
        case 'makeCode':
            code.push(...brainfuck.decode(data))
            let output = execute()
            let history = brainfuck.interpreter.history
            error = calcError(output, history)
            findTargetCommand()
            break
        case 'evolve':
            postMessage({
                command : 'update',
                data: {code: code.join(''), error}
            })
            // redirect call saves code lines ;)
            onmessage(message)
            break
        default:
            // TODO : make error handler
            break
    }
}

/**
 * Calculate the error of the current output
 * @param {Array} output 
 * @param {Array} history 
 */
function calcError(output, history) {
    if (!output.length) output.push(0)
    let err = 0
    let target = inputs[inpCnt].vector[inputs[inpCnt].vector.length - 1]
    err = output.reduce((acc, curr) => {
        return acc += Math.abs(target - (curr || 0))
    }, err)
    
    // TODO : score memory history
    /*let step = history[history.length - 1]
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
    lastStep = step*/

    return err
}

function execute() {
    try {
        return brainfuck.run(code, inputs[inpCnt].code)
    } catch (e) {
        if(e instanceof ExecuteError) {
            console.error(e, e.code, e.step)
        }else{
            throw e
        }
    }
}
/**
 * Find a command that has a lower error than the last or
 * set targetCommand to a random command.
 */
function findTargetCommand() {
    targetCommand = undefined
    let lastCmd = code.splice(-1, 1)
    let cmds = brainfuck.commands.filter(cmd => {
        return cmd.code !== lastCmd[0]
    })
    for (let cmdCnt = 0; cmdCnt < cmds.length; cmdCnt++) {
        const cmd = cmds[cmdCnt]
        code.push(cmd.code)
        let output = execute()
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

/**
 * Callback for monkeys worker.
 */
onmessage = function (message) {
    let {command, data} = message.data
    // console.log('monkey', {command, data})
    switch (command) {
        case 'evolve':
            if (!config) config = data.config
            if (id === -1) id = data.id
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
                return
            }
            // check if end goals reached
            if (code.length === config.codeLen && inpCnt === inputs.length) {
                postMessage({
                    command : 'done',
                    data : {code, id}
                })
            }
            if (code.length >= config.codeLen) {
                code = []
                inpCnt++
                // wait at last input until the code generation is finished
                if (inpCnt === inputs.length) inpCnt = inputs.length - 1 
            }
            // activate brain
            brain.postMessage({
                command : 'activate',
                data : {input : inputs[inpCnt]}
            })
            break
    }
    
}