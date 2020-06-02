const TYPES = {
    JUMP_WITHOUT_LOOP : 'jump without loop',
    LOOP_WITHOUT_JUMP : 'loop without jump'
}

class ExecuteError extends Error {
    constructor(message, type) {
        super(message)
        this.name = this.constructor.name
        this.type = type
    }
}

export { ExecuteError, TYPES }