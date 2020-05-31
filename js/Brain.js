importScripts('https://cdnjs.cloudflare.com/ajax/libs/synaptic/1.1.4/synaptic.js')

let brain = undefined
let config = undefined
let input = undefined

onmessage = function(message) {
    let {command, data} = message.data
    console.log('brain', {command, data})
    switch (command) {
        case 'activate':
            if (!config) config = data.config
            if (!brain) {
                brain = new synaptic.Architect.Perceptron(...config.layers)
            }
            input = data.input
            let vector = input.vector.slice(0, brain.layers.input.size)
            let output = brain.activate(vector)
            postMessage({command : 'makeCode', data : output})
            break
        case 'propagate':
            let target = [data.vector]
            brain.propagate(config.learningRate, target)
            postMessage({command : 'evolve'})
            break
    }
    
}