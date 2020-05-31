import { Normalized } from "./Normalized.js"

class TrainingSet {
    constructor (file, scale = {min = 0, max = 1} = {}) {
        this.data = []
        this.file = file
        this.name = this.file.name
        this.scale = scale

        this.read(file)
    }
    read (file) {
        var self = this
        var reader = new FileReader()
        reader.onload = function (event) {
            var data = new Uint8Array(event.target.result)
            var workbook = XLSX.read(data, { type: 'array' })
            var sheet = workbook.Sheets[workbook.SheetNames[1]]
            var set = XLSX.utils.sheet_to_json(sheet)
            set.forEach(element => {                
                self.data.push(new Normalized(element, self.scale))
            })
        }
        reader.readAsArrayBuffer(file)
    }
}

export { TrainingSet }