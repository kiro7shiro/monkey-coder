import { Messanger } from './js-events/Messanger.js'
import { Monkey } from './Monkey.js'

class Generation extends Messanger {
    constructor (maxMonkeys, monkeyConfig, trainingSet, ancestors) {
        super()
        this.ancestors = ancestors
        this.best = undefined
        this.done = 0
        this.elite = []
        this.id = -1
        this.maxMonkeys = maxMonkeys
        this.monkeyConfig = monkeyConfig 
        this.monkeys = []
        this.trainingSet = trainingSet

        if (this.ancestors) {
            // reproduce

        }else{
            this.monkeys = this.spawn()
        }
    }
    evolve () {
        this.monkeys.forEach(monkey => monkey.evolve())
    }
    monkeyOnDone (id) {
        this.done++
        if(this.done === this.maxMonkeys) {
            this.elite = this.selectElite()
            this.best = this.elite[0]
            this.post('done', this.elite)
        }
    }
    monkeyOnUpdate (id) {
        let monkey = this.monkeys[id]
        if (monkey.code.length === this.monkeyConfig.codeLen) {
            this.elite = this.selectElite()
            this.best = this.elite[0]
            this.post('update', this.id)
        }
    }
    reproduce (ancestors) {
        let breed = []
        for (let mnkCnt = 0; mnkCnt < this.maxMonkeys; mnkCnt++) {
            let monkey = new Monkey(this.monkeyConfig, this.monkeys.length, this.trainingSet.data)
            monkey.on('done', this.monkeyOnDone, this)
            monkey.on('update', this.monkeyOnUpdate, this)
            breed.push(monkey)                
        }
        return breed
    }
    selectElite () {
        this.monkeys.sort((a, b) => {
            return a.error - b.error
        })
        return this.monkeys.slice(0, 10)
    }
    spawn () {
        let breed = []
        for (let mnkCnt = 0; mnkCnt < this.maxMonkeys; mnkCnt++) {
            let monkey = new Monkey(this.monkeyConfig, this.monkeys.length, this.trainingSet.data)
            monkey.on('done', this.monkeyOnDone, this)
            monkey.on('update', this.monkeyOnUpdate, this)
            breed.push(monkey)                
        }
        return breed
    }
}

export { Generation }