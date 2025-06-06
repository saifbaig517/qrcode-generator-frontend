import { html, css } from 'lit'
import { ImageListModal } from '../../webpage-design-inputs/image-list-input/modal'
import { t } from '../../../../core/translate'

export class QrcgBusinessProfilePortfolioModal extends ImageListModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderInputs() {
        return html`
            <qrcg-input name="caption" placeholder="${t`Project name`}">
                ${t`Caption (Optional)`}
            </qrcg-input>

            <qrcg-textarea
                name="description"
                placeholder="${t`Project description`}"
            >
                ${t`Description`}
            </qrcg-textarea>

            <qrcg-input name="url" placeholder=${t`https://...`}>
                ${t`URL (optional)`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-business-profile-portfolio-modal',
    QrcgBusinessProfilePortfolioModal
)
