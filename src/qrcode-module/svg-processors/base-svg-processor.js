export class BaseSvgProcessor {
    host

    constructor(host) {
        this.host = host

        document.addEventListener(
            'qrcg-qrcode-image:svg-after-render',
            this.onSvgAfterRender
        )

        host.addController(this)
    }

    hostDisconnected() {
        this.destroy()
    }

    destroy() {
        document.removeEventListener(
            'qrcg-qrcode-image:svg-after-render',
            this.onSvgAfterRender
        )
    }

    onSvgAfterRender = (e) => {
        if (this.shouldProcess()) this.process(e.detail.svgContainer)
    }

    shouldProcess() {
        return true
    }

    // eslint-disable-next-line
    process(svgContainer) {}
}
