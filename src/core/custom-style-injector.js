import { isEmpty } from './helpers'

export class CustomStyleInjector {
    constructor(host) {
        this.host = host
        this.host.addController(this)
    }

    hostConnected() {
        this.injectStyles()
    }

    injectStyles = () => {
        if (!this.host) return

        const customStyles = Array.from(
            document.querySelectorAll(
                `.${this.host.tagName.toLowerCase()}-custom-style`
            )
        )

        if (!isEmpty(customStyles)) {
            for (const style of customStyles) {
                const sheet = new CSSStyleSheet()

                sheet.replaceSync(style.innerHTML)

                this.host.shadowRoot.adoptedStyleSheets = [
                    ...this.host.shadowRoot.adoptedStyleSheets,
                    sheet,
                ]
            }
        }
    }

    hostDisconnected() {
        this.host = null
    }
}
