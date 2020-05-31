import { Message } from './Message.js'

class Messanger {
    constructor() {
        this.events = {}
    }

    dispatch(eventName, data) {
        const event = this.events[eventName]
        if (event) {
            event.fire(data)
        }
    }

    on(eventName, callback, context) {
        let event = this.events[eventName]
        if (!event) {
            event = new Message(eventName, context)
            this.events[eventName] = event
        }
        event.registerCallback(callback)
    }

    off(eventName, callback) {
        const event = this.events[eventName]
        if (event && event.callbacks.indexOf(callback) > -1) {
            event.unregisterCallback(callback)
            if (event.callbacks.length === 0) {
                delete this.events[eventName]
            }
        }
    }
}

export { Messanger }