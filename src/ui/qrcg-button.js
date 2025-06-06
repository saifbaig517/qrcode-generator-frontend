import { LitElement, html, css } from 'lit'
import { isEmpty } from '../core/helpers'

import './qrcg-loader-h'
import { DirectionAwareController } from '../core/direction-aware-controller'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-button.scss?inline'

export class QRCGButton extends BaseComponent {
    #dir = new DirectionAwareController(this)

    static tag = 'qrcg-button'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            type: {},
            loading: {
                type: Boolean,
                reflect: true,
            },
            disabled: {
                type: Boolean,
                reflect: true,
            },
            href: {},
            target: {},
            transparent: {
                type: Boolean,
                reflect: true,
            },
            download: { reflect: true },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    // eslint-disable-next-line
    onClick(e) {}

    updated(changed) {
        if (changed.has('href') || changed.has('download')) {
            this.updateLink()
        }
    }

    updateLink() {
        const link = this.renderRoot.querySelector('a')

        if (!link) return

        if (isEmpty(this.download)) {
            link.removeAttribute('download')
        } else {
            link.setAttribute('download', this.download)
        }
    }

    renderContent() {
        return html`<slot></slot>`
    }

    render() {
        return html`
            <button
                type=${this.type}
                part="button"
                .disabled=${this.disabled || this.loading}
            >
                ${this.href
                    ? html`<a
                          href=${this.href}
                          target="${this.target}"
                          tabindex="-1"
                          ?download=${this.download}
                      ></a>`
                    : ''}
                <qrcg-loader-h></qrcg-loader-h>
                <div class="content" part="content">
                    ${this.renderContent()}
                </div>
            </button>
        `
    }
}

QRCGButton.register()
