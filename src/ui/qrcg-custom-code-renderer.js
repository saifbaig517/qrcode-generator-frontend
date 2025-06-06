import { Base64Encoder } from '../core/base64-encoder'

export class QRCGCustomCodeRenderer extends HTMLElement {
    static get tag() {
        return 'qrcg-custom-code-renderer'
    }

    get position() {
        return this.getAttribute('position')
    }

    static hasCode(position) {
        const instance = new QRCGCustomCodeRenderer()

        instance.setAttribute('position', position)

        const template = instance.getTemplate()

        if (!template) {
            return false
        }

        const html = template.innerHTML.trim()

        return html.length > 0
    }

    constructor() {
        super()

        this.attachShadow({ mode: 'open' })

        this.renderStyles()

        this.renderCustomCode()
    }

    renderStyles() {
        const style = document.createElement('style')

        style.innerHTML = ':host { display: block; }'

        this.shadowRoot.appendChild(style)
    }

    renderCustomCode() {
        if (!this.position) return

        const template = this.getTemplate()

        if (!template) return

        let code = Base64Encoder.decode(template.innerHTML)

        this.shadowRoot.appendChild(this.renderFragement(code))
    }

    renderFragement(html) {
        return document.createRange().createContextualFragment(html)
    }

    getTemplate() {
        const templates = Array.from(document.querySelectorAll('template'))

        return templates.find(
            (t) => t.getAttribute('position') === this.position
        )
    }
}

window.defineCustomElement(QRCGCustomCodeRenderer.tag, QRCGCustomCodeRenderer)
