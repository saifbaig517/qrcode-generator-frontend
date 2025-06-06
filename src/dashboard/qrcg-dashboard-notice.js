import { html } from 'lit'

import style from './qrcg-dashboard-notice.scss?inline'
import { BaseComponent } from '../core/base-component/base-component'

export class QrcgDashboardNotice extends BaseComponent {
    static styleSheets = [...super.styleSheets, style]

    constructor() {
        super()
        this.apiEvents = []
        this.visible = false
        this.onShowRequested = this.onShowRequested.bind(this)
        this.onHideRequested = this.onHideRequested.bind(this)
    }

    static get properties() {
        return {
            link: {},
            message: {},
            visible: { type: Boolean, reflect: true },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.addApiEvent('request-show', this.onShowRequested)

        this.addApiEvent('request-hide', this.onHideRequested)

        this.registerApiEvents()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeApiEvents()
    }

    addApiEvent(name, cp) {
        this.apiEvents.push({ name, cp })
    }

    registerApiEvents() {
        for (const { name, cp } of this.apiEvents) {
            document.addEventListener(this.eventName(name), cp)
        }
    }

    removeApiEvents() {
        for (const { name, cp } of this.apiEvents) {
            document.removeEventListener(this.eventName(name), cp)
        }
    }

    eventName(name) {
        return this.tagName.toLowerCase() + ':' + name
    }

    onShowRequested(e) {
        this.visible = true

        this.message = e.detail.message

        this.link = e.detail.link
    }

    onHideRequested() {
        this.visible = false
        this.reset()
    }

    reset() {
        this.message = ''

        this.link = null
    }

    render() {
        let link = ''

        if (this.link) {
            link = html`<a href="${this.link}"></a>`
        }

        return html`${link}${this.message}`
    }
}

window.defineCustomElement('qrcg-dashboard-notice', QrcgDashboardNotice)

export const showNotice = ({ message, link }) => {
    document.dispatchEvent(
        new CustomEvent('qrcg-dashboard-notice:request-show', {
            detail: {
                message,
                link,
            },
        })
    )
}
