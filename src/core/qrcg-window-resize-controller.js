import { debounce } from './helpers'

export class QrcgWindowResizeController {
    constructor(host) {
        this.host = host
        this.host.addController(this)

        this.resizing = false
        this.resizingX = false

        this.onResizeEnd = debounce(this.onResizeEnd.bind(this), 500)
        this.onResizeXEnd = debounce(this.onResizeXEnd.bind(this), 500)

        this.lastWidth = window.innerWidth
    }

    hostConnected() {
        window.addEventListener('resize', this.onWindowResize)
    }

    hostDisconnected() {
        window.removeEventListener('resize', this.onWindowResize)
        this.host = null
    }

    onWindowResize = () => {
        this.onResizeStart()
        this.onResizeXStart()

        this.onResizeEnd()
        this.onResizeXEnd()
    }

    onResizeStart() {
        if (this.resizing) return

        this.fire('resize-start')

        this.resizing = true
    }

    onResizeXStart() {
        if (this.resizingX) {
            return
        }

        if (window.innerWidth == this.lastWidth) {
            return
        }

        this.fire('resize-start-x')

        this.lastWidth = window.innerWidth

        this.resizingX = true
    }

    onResizeEnd() {
        if (!this.resizing) return

        this.fire('resize-end')

        this.resizing = false
    }

    onResizeXEnd() {
        if (!this.resizingX) return

        this.fire('resize-end-x')

        this.resizingX = false
    }

    fire(name) {
        if (this.host) this.host.dispatchEvent(new CustomEvent(name))
    }
}
