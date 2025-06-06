import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../common/qrcg-business-hours-input'

export class QRCGBioLinksForm extends BaseTypeForm {
    static styles = [
        super.styles,
        css`
            qrcg-form-section {
                margin-top: 1rem;
            }

            qrcg-balloon-selector:first-child {
                margin-top: 1rem;
            }

            qrcg-input:first-child {
                margin-top: 1rem;
            }
        `,
    ]

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Create your bio links with ease.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-form-section>
                    <h2 class="section-title">${t`Basic Details`}</h2>

                    <qrcg-input name="name" placeholder=${t`Enter your name`}>
                        ${t`Name`}
                    </qrcg-input>

                    <qrcg-input
                        name="email"
                        placeholder="${t`Enter your email`}"
                        type="email"
                    >
                        ${t`Email`}
                    </qrcg-input>
                </qrcg-form-section>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-biolinks-form', QRCGBioLinksForm)
