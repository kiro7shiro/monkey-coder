class ExecuteError extends Error {
    
    static JUMP_WITHOUT_LOOP = 'jump without loop'
    static LOOP_WITHOUT_JUMP = 'loop without jump'

    constructor(code, step, type) {
        super(type + ` @step:${step}`)
        this.code = code
        this.name = this.constructor.name
        this.step = step
        this.type = type
    }

}

export { ExecuteError }