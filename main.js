/**
 * Monkey Coder 0.1
 */

import { View } from "./js/View.js"
import { MonkeyCoder } from "./js/MonkeyCoder.js"

const view = new View()
const coder = new MonkeyCoder(view)
// attach drawing callbacks
view.statusBar.draw = function(data) {
    this.innerHTML = data.val || coder.status
}
view.eliteMonkeys.draw = function (data) {
    
}
view.monkeyBar.draw = function (data) {
    
}

window.coder = coder