import { Event } from './Event.js'

/**
 * Represents a messanger that can send or recieve events.
 */
class Messanger {
    constructor() {
        this.events = {}
    }

    off(eventName, callback) {
        const event = this.events[eventName]
        if (event && event.callbacks.indexOf(callback) > -1) {
            event.removeCallback(callback)
            if (event.callbacks.length === 0) {
                delete this.events[eventName]
            }
        }
    }

    on(eventName, callback, context) {
        let event = this.events[eventName]
        if (!event) {
            event = new Event(eventName, context)
            this.events[eventName] = event
        }
        event.addCallback(callback)
    }
    
    post(eventName, data) {
        const event = this.events[eventName]
        if (event) event.execute(data)
    }
}

export { Messanger }