import { LitElement, html, css } from 'lit'

/**
 * @deprecated
 * @use qrcg-tab-content-renderer
 */
export class QrcgTabContent extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            tabId: {
                attribute: 'tab-id',
            },
            active: {
                type: Boolean,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        document.addEventListener('qrcg-tab:activate', this.onActivate)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener('qrcg-tab:activate', this.onActivate)
    }

    onActivate = (e) => {
        if (this.tabId === e.detail.tabId) {
            this.active = true
        } else {
            this.active = false
        }
    }

    updated(changed) {
        if (changed.has('active')) {
            if (this.active) {
                this.renderContent()
            } else {
                this.resetContent()
            }
        }
    }

    renderContent() {
        const slot = this.shadowRoot.querySelector('slot')

        const nodes = Array.from(slot.assignedNodes())

        const template = nodes.find((n) => n.matches && n.matches('template'))

        if (!template) {
            console.error('You must wrap tab contents with <template> tag')
            return
        }

        const content = template.content.cloneNode(true)

        this.appendChild(content)
    }

    resetContent() {
        this.querySelectorAll('*:not(template)').forEach((node) =>
            node.remove()
        )
    }

    render() {
        return html` <slot></slot> `
    }
}

window.defineCustomElement('qrcg-tab-content', QrcgTabContent)
