class Normalized {
    constructor (data, {min = 0, max = 1} = {}) {
        this.vector = []
        this.code = []
        this.min = min
        this.max = max
        this.source = data

        // TODO: rethink the following process!
        // missing case, data is a string or number
        if (data instanceof Array) {
            data.forEach(element => {
                let chr = element.toString().charCodeAt(0)
                this.code.push(chr)
                this.vector.push(this.encode(chr))
            }, this)
        }else if (data instanceof Object) {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    let chr = data[key].toString().charCodeAt(0)
                    this.code.push(chr)
                    this.vector.push(this.encode(chr))
                }
            }
        }

    }
    decode(value) {
        return this.max * value - this.min * value + this.min
    }
    encode(value) {
        return (value - this.min) / (this.max - this.min)
    }
}

export { Normalized }