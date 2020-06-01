import { Messanger } from './js-events/Messanger.js'

/**
 * Monkey coders view. This represents the html page loaded in the browser.
 * It's purpose is to provide functionallity for manipulating the DOM.
 * @constructor
 */
class View extends Messanger {
    constructor () {
        super()
        document.querySelectorAll('[id]').forEach(element => {
            this[element.id] = element
            element.addEventListener('click', event => {
                this.post('click', event)
                this.post(event.target.id + 'Click', event)
            })
            element.addEventListener('change', event => {
                this.post('change', event)
                this.post(event.target.id + 'Change', event)
            })
        }, this)
        this.on('update', this.update, this)
    }
    /**
     * Read a forms data and return an object with the values.
     * @param {String} id The id attribute of the form to read.
     */
    readForm (id) {
        if (this[id]) {
            const data = new FormData(this[id])
            var result = {}
            for (var pair of data.entries()) {
                result[pair[0]] = pair[1]
            }
        }
        return result
    }
    /**
     * Perform a view update
     * @param {Object} data 
     */
    update (data) {
        if (!data) return
        let {id, val, css} = data
        console.log('view update', {id, val, css})
        if (this[id].draw) this[id].draw({val, css})
    }
}

export { View }