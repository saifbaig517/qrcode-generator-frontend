import { html } from 'lit'

import { push } from '../core/qrcg-router'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-tab.scss?inline'

export class QrcgTab extends BaseComponent {
    static tag = 'qrcg-tab'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            tabId: {
                attribute: 'tab-id',
            },
            active: {
                type: Boolean,
                reflect: true,
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

    firstUpdated() {
        if (this.active && !this.getQueryParam()) {
            this.fireActivate()
        } else {
            this.loadQueryParam()
        }
    }

    getQueryParam() {
        return new URLSearchParams(location.search).get('tab-id')
    }

    loadQueryParam() {
        if (this.getQueryParam() == this.tabId) {
            this.fireActivate()
        }
    }

    onActivate = (e) => {
        if (e.detail.tabId === this.tabId) {
            this.active = true
        } else {
            this.active = false
        }

        this.syncQueryParam()
    }

    onLabelClick() {
        this.fireActivate()
    }

    fireActivate() {
        document.dispatchEvent(
            new CustomEvent('qrcg-tab:activate', {
                detail: {
                    tabId: this.tabId,
                },
            })
        )
    }

    syncQueryParam() {
        const s = new URLSearchParams(location.search)

        const tabId = s.get('tab-id')

        if (!this.firstRender && this.active && tabId !== this.tabId) {
            s.set('tab-id', this.tabId)

            s.toString()

            const newLocation = `${location.pathname}?${s.toString()}`

            push(newLocation)
        }

        this.firstRender = false
    }

    render() {
        return html`
            <qrcg-button no-shadow @click=${this.onLabelClick}>
                <slot></slot>
            </qrcg-button>
        `
    }
}

QrcgTab.register()
