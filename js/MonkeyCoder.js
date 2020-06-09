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
        this.maxMonkeys = 12
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
            next.on('update', this.generationOnUpdate, this)
            next.evolve()
            this.generations.push(next)
        }else{
            this.status = 'idle'
        }
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
    generationOnUpdate (message) {
        this.progress++
        let icnt = this.trainingSets[0].data.length * this.maxMonkeys
        let prc = this.progress / icnt * 100
        console.log('generation update', message, prc)
        this.view.post('update', {
            id : 'monkeyBar',
            val : prc.toFixed(0),
            css : {
                width : prc + '%'
            }
        })
        if (prc === 100) this.status = 'idle'
    }
}

export { MonkeyCoder }