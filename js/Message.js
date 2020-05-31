class Message {
    constructor(eventName, context) {
        this.eventName = eventName
        this.callbacks = []
        this.context = context
    }

    registerCallback(callback) {
        this.callbacks.push(callback)
    }

    unregisterCallback(callback) {
        const index = this.callbacks.indexOf(callback)
        if (index > -1) {
            this.callbacks.splice(index, 1)
        }
    }

     fire(data) {
        const callbacks = this.callbacks.slice(0)
        callbacks.forEach((callback) => {
            callback.call(this.context, data)
        })
    }
}

export { Message }