import { css, html } from 'lit'
import { defineCustomElement, url } from '../core/helpers'
import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'

export class QrcgLanguagePickerModal extends QrcgModal {
    static get tag() {
        return 'qrcg-language-picker-modal'
    }

    static get styles() {
        return [
            super.styles,
            css`
                .flag {
                    height: 1.5rem;
                    margin-right: 1rem;
                }

                qrcg-button {
                    margin-bottom: 1rem;
                    border: 1px solid var(--gray-1);
                    border-radius: 0.5rem;

                    width: fit-content;
                }
            `,
        ]
    }

    static get properties() {
        return {
            ...super.properties,
            translations: {
                type: Array,
            },
        }
    }

    renderTitle() {
        return t`Select Language`
    }

    renderActions() {}

    renderFlag(translation) {
        if (!translation.flag_url) return

        return html` <img class="flag" src=${translation.flag_url} /> `
    }

    renderTranslation(translation) {
        return html`
            <qrcg-button
                transparent
                href=${url('/language/' + translation.locale)}
            >
                ${this.renderFlag(translation)}

                <div class="display-name">${translation.display_name}</div>
            </qrcg-button>
        `
    }

    renderBody() {
        return html`
            <div class="languages-container">
                ${this.translations.map((translation) =>
                    this.renderTranslation(translation)
                )}
            </div>
        `
    }
}

defineCustomElement(QrcgLanguagePickerModal.tag, QrcgLanguagePickerModal)
