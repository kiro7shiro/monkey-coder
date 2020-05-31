import { Messanger } from './Messanger.js'

class View extends Messanger {
    constructor () {
        super()
        document.querySelectorAll('[id]').forEach(element => {
            this[element.id] = element
            element.addEventListener('click', event => {
                this.dispatch('click', event)
                this.dispatch(event.target.id + 'Click', event)
            })
            element.addEventListener('change', event => {
                this.dispatch('change', event)
                this.dispatch(event.target.id + 'Change', event)
            })
        }, this)
        this.on('update', this.update, this)
    }
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
    update (data) {
        if (!data) return
        let {id, val, css} = data
        console.log('view update', {id, val, css})
        if (this[id].draw) this[id].draw({val, css})
    }
}

export { View }