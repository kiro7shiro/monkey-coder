/**
 * Represents an event that get's send around.
 */
class Event {
    constructor(eventName, context) {
        this.eventName = eventName
        this.callbacks = []
        this.context = context
    }

    addCallback(callback) {
        this.callbacks.push(callback)
    }

    execute(data) {
        const callbacks = this.callbacks.slice(0)
        callbacks.forEach((callback) => {
            callback.call(this.context, data)
        })
    }

    removeCallback(callback) {
        const index = this.callbacks.indexOf(callback)
        if (index > -1) {
            this.callbacks.splice(index, 1)
        }
    }
}

export { Event } 