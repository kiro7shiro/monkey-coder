importScripts('https://cdnjs.cloudflare.com/ajax/libs/synaptic/1.1.4/synaptic.js')

let brain = undefined
let config = undefined
let input = undefined

onmessage = function(message) {
    let {command, data} = message.data
    // console.log('brain', {command, data})
    switch (command) {
        case 'activate':
            if (!config) config = data.config
            if (config.parents) {
                let a = config.parents[0]
                let b = config.parents[1]
                brain = synaptic.Network.fromJSON(crossOver(a, b))
            }
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
        case 'getJSON':
            let json = brain.toJSON()
            postMessage({command : 'json', data : json})
            break
    }
    
}

/* expecting network.toJSON as entries (Object, Object, Float(0 to 1)) */
crossOver = function(network1, network2, ratio) {
    if (!ratio) ratio = 0.5
    let ratioPartA = ratio
    let ratioPartB = 1 - ratio
    
    let ntk1 = synaptic.Network.fromJSON(network1)
    // Create a network, this will be the result of the two networks
    let offspring = ntk1.clone()
    let inputCount = offspring.inputs()
    offspring.clear()
    offspring = offspring.toJSON()

    // Let's combine the neuron biases for the offspring
    for (let i = inputCount; i < offspring.neurons.length; i++) {
        let bias1 = network1.neurons[i].bias * ratioPartA // get's the bias of neuron i of network1
        let bias2 = network2.neurons[i].bias * ratioPartB // get's the bias of neuron i of network2

        let new_bias = (bias1 + bias2) // this is the function that calculates the new bias, do whatever you want here

        offspring.neurons[i].bias = new_bias
    }

    // Let's combine the neuron conection weights for the offspring
    for (let i = 0; i < offspring.connections.length; i++) {
        let weight1 = network1.connections[i].weight * ratioPartA // get's the weight of connection i of network1
        let weight2 = network2.connections[i].weight * ratioPartB // get's the weight of connection i of network2

        let new_weight = (weight1 + weight2) // this is the function that calculates the new bias, do whatever you want here

        offspring.connections[i].weight = new_weight
    }

    // Now convert the offspring JSON back to a network and return it
    return offspring
}