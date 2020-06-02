import { Messanger } from './js-events/Messanger.js'

class Generation extends Messanger {
    constructor (maxMonkeys, monkeyConfig, trainingSet) {
        super()
        this.done = 0
        this.elite = []
        this.maxMonkeys = maxMonkeys
        this.monkeyConfig = monkeyConfig 
        this.monkeys = []
        this.trainingSet = trainingSet
    }
    evolve () {
        let monkey = new Worker('./js/Monkey.js', { type: "module" })
        monkey.onerror = this.onerror
        monkey.onmessage = this.onmessage.bind(this)
        monkey.postMessage({
            command : 'evolve',
            data : {
                config : this.monkeyConfig,
                inputs : this.trainingSet.data
            }
        })
        this.monkeys.push(monkey)
    }
    onerror (message) {
        console.log('generation error :', message, this)
    }
    onmessage (message) {
        let {command, data} = message.data
        // console.log('generation', {command, data})
        switch (command) {
            case 'update':
                this.post('update', data)
                break
        }
    }
}

export { Generation }