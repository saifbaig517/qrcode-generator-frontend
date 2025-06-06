import { html, css } from 'lit'
import { get } from '../core/api'
import { isEmpty } from '../core/helpers'
import { DirectionAwareController } from '../core/direction-aware-controller'
import { ConfigHelper } from '../core/config-helper'
import { QrcgLanguagePickerModal } from './qrcg-language-picker-modal'
import { QRCGButton } from '../ui/qrcg-button'

export class QrcgLanguagePicker extends QRCGButton {
    #dir = new DirectionAwareController(this)

    static styles = [
        super.styles,
        css`
            :host {
                --button-color: black;
                --button-background-color: var(--gray-0);

                --button-color-hover: black;
                --button-background-color-hover: var(--gray-2);
            }
            .flag {
                height: 1.5rem;
                width: auto;
                display: block;
                border-radius: 0.25rem;
                margin-right: 0.5rem;
            }

            button {
                border: 1px solid var(--gray-1);
                background-color: var(--gray-1);
                min-width: 0;
                padding: 0.25rem;
            }

            button:hover {
                color: var(--dark);
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            translations: { type: Array },
        }
    }

    constructor() {
        super()
        this.translations = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchActiveTranslations()
    }

    async fetchActiveTranslations() {
        const { response } = await get('translations/active')

        const data = await response.json()

        this.translations = data.map((t) => {
            if (t.is_default) {
                return {
                    ...t,
                    name: 'English',
                }
            }

            return t
        })
    }

    onClick() {
        this.openTranslationsModal()
    }

    renderFlag(translation) {
        if (!translation?.flag_url) return

        return html`
            <img src=${translation.flag_url} class="flag" part="flag" />
        `
    }

    getCurrentTranslation() {
        if (isEmpty(this.translations)) return

        return this.translations.find(
            (t) => t.locale === this.getCurrentLocale()
        )
    }

    getCurrentLocale() {
        if (!ConfigHelper.isBuiltBundle()) {
            return 'en'
        }

        return window.QRCG_CURRENT_LOCALE
    }

    async openTranslationsModal() {
        QrcgLanguagePickerModal.open({
            translations: this.translations,
        })
    }

    shouldRenderSelf() {
        return this.translations.length >= 2
    }

    render() {
        if (!this.shouldRenderSelf()) return

        return super.render()
    }

    renderContent() {
        if (this.translations.length < 2) return

        const translation = this.getCurrentTranslation()

        return html`
            ${this.renderFlag(translation)}
            <div class="display-name" part="display-name">
                ${translation?.display_name}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-language-picker', QrcgLanguagePicker)
