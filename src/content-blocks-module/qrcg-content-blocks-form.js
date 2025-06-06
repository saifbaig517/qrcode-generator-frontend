import { css, html } from 'lit'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import '../ui/qrcg-input'

import '../ui/qrcg-select'

import '../ui/qrcg-balloon-selector'

import '../ui/qrcg-markdown-input'
import { Config } from '../core/qrcg-config'
import { t } from '../core/translate'

export class QrcgContentBlocksForm extends QrcgDashboardForm {
    static get styles() {
        return [
            super.styles,
            css`
                .section-title {
                    font-weight: normal;
                    border-bottom: 2px solid var(--gray-1);
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                }

                .input-title {
                    display: inline-block;
                    width: 150px;
                }

                qrcg-balloon-selector {
                    /* flex-direction: column; */
                }
            `,
        ]
    }
    constructor() {
        super({
            apiBaseRoute: 'content-blocks',
        })
    }

    renderFormFields() {
        return html`
            <qrcg-input name="title" placeholder="${t`Block title`}"
                >${t`Title`}</qrcg-input
            >

            <qrcg-select name="position">
                <span slot="label">${t`Position`}</span>

                ${Config.get('content-manager.positions').map((position) => {
                    return html`<option value=${position}>${position}</option>`
                })}
            </qrcg-select>

            <qrcg-input name="sort_order" placeholder="${t`Default is 0`}">
                ${t`Sort order`}
                <span slot="instructions">
                    ${t`Controls the order of each block in the selected position.
                    E.g block with sort order set to 1 will be
                    rendered before block with sort order set to
                    2.`}
                </span>
            </qrcg-input>

            <qrcg-markdown-input name="content">
                ${t`Content`}
            </qrcg-markdown-input>

            <qrcg-relation-select
                name="translation_id"
                api-endpoint="translations?is_active=true&pagination=false"
            >
                ${t`Language`}
            </qrcg-relation-select>
        `
    }
}
window.defineCustomElement('qrcg-content-blocks-form', QrcgContentBlocksForm)
