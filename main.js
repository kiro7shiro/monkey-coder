/**
 * Monkey Coder 0.1
 */

import { View } from "./js/View.js"
import { MonkeyCoder } from "./js/MonkeyCoder.js"

const view = new View()
const coder = new MonkeyCoder(view)
// attach drawing callbacks
view.bestCode.draw = function(data) {
    this.innerHTML = data.val
}
view.statusBar.draw = function(data) {
    this.innerHTML = data.val || coder.status
}
view.eliteMonkeys.draw = function (data) {
    this.tBodies[0].innerHTML = data.val
}
view.monkeyBar.draw = function (data) {
    this.innerHTML = data.val + '%'
    this.style.width = data.css.width
}

window.coder = coder