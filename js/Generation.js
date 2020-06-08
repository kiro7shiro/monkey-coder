import { Messanger } from './js-events/Messanger.js'
import { Monkey } from './Monkey.js'

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
        let monkey = new Monkey(this.monkeyConfig, this.monkeys.length, this.trainingSet.data)
        monkey.evolve()
        monkey.on('done', this.monkeyOnDone, this)
        monkey.on('update', this.monkeyOnUpdate, this)
        this.monkeys.push(monkey)        
        
    }
    monkeyOnDone (message) {
        console.log('monkey done', message)
    }
    monkeyOnUpdate (message) {
        console.log('monkey update', message)
    }
}

export { Generation }