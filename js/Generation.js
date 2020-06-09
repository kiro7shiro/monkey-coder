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
        for (let mnkCnt = 0; mnkCnt < this.maxMonkeys; mnkCnt++) {
            let monkey = new Monkey(this.monkeyConfig, this.monkeys.length, this.trainingSet.data)
            monkey.on('done', this.monkeyOnDone, this)
            monkey.on('update', this.monkeyOnUpdate, this)
            monkey.evolve()
            this.monkeys.push(monkey)                
        }
    }
    monkeyOnDone (message) {
        //console.log('monkey done', message)
        this.done++
        if(this.done === this.maxMonkeys) {
            this.selectElite()
            console.log(this.elite)
        }
    }
    monkeyOnUpdate (message) {
        //console.log('monkey update', message)
        if (message.code.length === this.monkeyConfig.codeLen) {
            this.post('update', message)
        }
    }
    selectElite () {
        this.monkeys.sort((a, b) => {
            return a.error - b.error
        })
        this.elite = this.monkeys.slice(0, 10)
    }
}

export { Generation }