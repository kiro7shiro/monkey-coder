import { Generation } from "./Generation.js"
import { TrainingSet } from './TrainingSet.js'

/**
 * Represents a monkey coder.
 * @constructor
 */
class MonkeyCoder{
    constructor (view) {
        this.autoEvolve = true
        this.maxGenerations = 64
        this.maxMonkeys = 32
        this.generations = []
        this.monkeyConfig = {
            codeLen : 16,
            layers : [1, 4, 4, 1],
            learningRate : 0.2,
            minError : 0.03
        }
        this.trainingSets = []
        this.progress = 0
        this._status = 'idle'

        this.view = view
        this.view.on('startButtonClick', this.startButtonClick, this)
        this.view.on('selectInputsButtonChange', this.selectInputsButtonChange, this)
    }
    get status () {
        return this._status
    }
    set status (val) {
        this._status = val
        this.view.post('update', {
            id :'statusBar',
            val: this._status
        })
    }
    /**
     * Assign a configuration to the coder.
     * @param {Object} config 
     */
    assignConfig (config) {
        var coder = {
            autoEvolve : config.autoEvolve,
            maxGenerations : config.maxGenerations,
            maxMonkeys : config.maxMonkeys
        }
        var monkey = {
            codeLen : config.codeLen,
            layers : config.layers,
            learningRate : config.learningRate,
            minError : config.minError
        }
        for (const key in coder) {
            if (this.hasOwnProperty(key)) {
                const val = coder[key]
                if (key === 'autoEvolve') {
                    this.autoEvolve = Boolean(val)
                }else{
                    this[key] = Number(val) || this[key]
                }
            }
        }
        for (const key in monkey) {
            if (this.monkeyConfig.hasOwnProperty(key)) {
                var val = monkey[key]
                if (key === 'layers' && val) {
                    val = JSON.parse(val)
                }else if (val) {
                    val = Number(val)
                }
                this.monkeyConfig[key] = val || this.monkeyConfig[key]
            }
        }
    }
    /**
     * Start evolution.
     */
    evolve () {
        if (!this.trainingSets.length) return
        if (this.generations.length < this.maxGenerations) {
            // TODO : reproduce elite
            var next = new Generation(this.maxMonkeys, this.monkeyConfig, this.trainingSets[0])
            next.on('done', this.generationOnDone, this)
            next.on('update', this.generationOnUpdate, this)
            next.evolve()
            this.generations.push(next)
        }else{
            this.status = 'idle'
        }
    }
    /**
     * Callback for generation on done
     * @param {*} message 
     */
    generationOnDone (elite) {
        let rows = ''
        for (let eltCnt = 0; eltCnt < elite.length; eltCnt++) {
            const monkey = elite[eltCnt]
            rows += '<tr><td>' + monkey.id + '</td>'
            rows += '<td>' + monkey.code.join('') + '</td>'
            rows += '<td>' + monkey.error + '</td></tr>'
        }
        this.view.post('update', {
            id : 'eliteMonkeys',
            val : rows
        })
    }
    /**
     * Callback for generation on update
     * @param {*} message 
     */
    generationOnUpdate (message) {
        this.progress++
        let icnt = this.trainingSets[0].data.length * this.maxMonkeys
        let prc = this.progress / icnt * 100
        let monkey = this.generations[0].monkeys[message]
        //console.log('generation update', monkey.code.join(''), monkey.error)
        console.log(`generation update:  id - ${message} code - ${monkey.code.join('')} error - ${monkey.error}`)
        this.view.post('update', {
            id : 'monkeyBar',
            val : prc.toFixed(0),
            css : {
                width : prc + '%'
            }
        })
        if (prc === 100) this.status = 'idle'
    }
    /**
     * Event handler for selectInputsButton change event.
     * @param {*} event 
     */
    selectInputsButtonChange (event) {
        event.stopPropagation()
        console.log('selectInputsButtonChange', event)
        this.trainingSets.push(new TrainingSet(event.target.files[0], {min : 32, max : 127}))
    }
    /**
     * Event handler for startButton click event.
     * @param {*} event 
     */
    startButtonClick (event) {
        event.stopPropagation()
        console.log('startButtonClick', event)
        if (this.status === 'idle') {
            this.status = 'evolve'
            this.assignConfig(this.view.readForm('monkeyConfigForm'))
            this.evolve()
        }else if (this._status === 'evolve') {
            this.status = 'idle'
        }
    }

}

export { MonkeyCoder }