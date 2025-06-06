import { html } from 'lit'
import { slugify } from '../core/helpers'
import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import '../ui/qrcg-code-input'

import '../ui/qrcg-input'

import { Config } from '../core/qrcg-config'

export class QrcgPageForm extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: 'pages',
        })
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
    }

    onInput = (e) => {
        if (e.detail.name === 'title') {
            this.data.slug = slugify(e.detail.value)
        }
    }

    renderSlugComment() {
        const slugInput = this.shadowRoot.querySelector('[name="slug"]')

        if (!slugInput) return

        slugInput.setHasInstructions()

        const slug = this.data.slug

        if (!slug) return html`<div slot="instructions"></div>`

        return html`
            <div slot="instructions" class="slug-instructions">
                ${t`Page URL:`}
                <a href="${Config.get('app.url')}/${slug}" target="_blank">
                    /${slug}
                </a>
                ${`Please click on save to be able to view the page.`}
            </div>
        `
    }

    renderFormFields() {
        return html`
            <qrcg-input name="title" placeholder=${t`Page title`}>
                ${t`Title`}
            </qrcg-input>
            <qrcg-input name="slug" placeholder=${t`Page slug (url)`}>
                ${t`Slug`} ${this.renderSlugComment()}
            </qrcg-input>
            <qrcg-code-input name="html_content" language="html">
                <span slot="label"> ${t`HTML Content`} </span>
            </qrcg-code-input>
            <qrcg-textarea
                name="meta_description"
                maxlength="160"
                placeholder=${t`Your meta description here.`}
            >
                ${t`Meta description`}
            </qrcg-textarea>
            <qrcg-checkbox name="published">${t`Published?`}</qrcg-checkbox>
        `
    }
}
window.defineCustomElement('qrcg-page-form', QrcgPageForm)
