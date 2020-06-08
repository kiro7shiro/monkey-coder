import { Messanger } from './js-events/Messanger.js'
import { Monkey2 } from './Monkey2.js'

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
        let monkey = new Monkey2(this.monkeyConfig, this.monkeys.length, this.trainingSet.data)
        monkey.evolve()
        monkey.on('update', this.monkeyOnUpdate, this)
        this.monkeys.push(monkey)        
        
    }
    monkeyOnUpdate (message) {
        console.log(message)
    }
    onerror (message) {
        console.log('generation error :', message, this)
    }
    onmessage (message) {
        let {command, data} = message.data
        // console.log('generation', {command, data})
        switch (command) {
            case 'done':
                this.post('update', data)
                this.monkeys[0].terminate()
                break
            case 'update':
                this.post('update', data)
                break
        }
    }
}

export { Generation }