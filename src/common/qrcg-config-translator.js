import { LitElement, html, css } from 'lit'

import { QrcgConfigTranslatorModal } from './qrcg-config-translator-modal'

import { mdiTranslate } from '@mdi/js'

import { get } from '../core/api'

export class QrcgConfigTranslator extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                position: absolute;
                right: 0.2rem;
                bottom: 0.65rem;
            }

            qrcg-button::part(button) {
                min-width: initial;
                padding: 0.25rem;
            }

            qrcg-icon {
                width: 1.5rem;
                height: 1.5rem;
            }
        `,
    ]

    static get properties() {
        return {
            configKey: { attribute: 'config-key' },
            label: {},
            path: {},
            translations: { type: Array },
        }
    }

    constructor() {
        super()

        this.translations = []

        this.fetchActiveTranslations()
    }

    async fetchActiveTranslations() {
        const { response } = await get(
            'translations?is_active=true&paginate=false'
        )

        const allTranslations = await response.json()

        this.translations = allTranslations
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    onClick() {
        QrcgConfigTranslatorModal.open({
            configKey: this.configKey,
            label: this.label,
            path: this.path,
        })
    }

    render() {
        if (this.translations.length < 2) return null

        return html`
            <qrcg-button transparent>
                <qrcg-icon mdi-icon=${mdiTranslate}></qrcg-icon>
            </qrcg-button>
        `
    }
}

window.defineCustomElement('qrcg-config-translator', QrcgConfigTranslator)
