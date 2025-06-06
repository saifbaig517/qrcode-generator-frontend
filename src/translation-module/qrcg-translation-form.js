import { css, html } from 'lit'
import { get } from '../core/api'

import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import { FileModel } from '../ui/qrcg-file-input/model'

export class QrcgTranslationForm extends QrcgDashboardForm {
    static defaultDisableableInputsSelector = `[name]:not(qrcg-file-input)`

    constructor() {
        super({
            apiBaseRoute: 'translations',
            disableableInputsSelector:
                QrcgTranslationForm.defaultDisableableInputsSelector,
        })
    }

    static get styles() {
        return [
            super.styles,
            css`
                a {
                    color: var(--primary-0);
                    text-decoration: none;
                }
            `,
        ]
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchDefaultTranslation()
    }

    static get properties() {
        return {
            ...super.properties,
            defaultTranslationFile: {},
        }
    }

    updated(changed) {
        super.updated(changed)

        if (changed.has('data')) {
            if (this.data.is_default) {
                this.api.disableableInputsSelector = '.no-elements'
            } else {
                this.api.disableableInputsSelector =
                    this.constructor.defaultDisableableInputsSelector
            }
        }
    }

    async fetchDefaultTranslation() {
        const { response } = await get(this.api.baseRoute + '?paginate=false')

        const translations = await response.json()

        const defaultTranslation = translations.find((t) => t.is_default)

        this.defaultTranslationFile = new FileModel({
            remote: defaultTranslation.file,
        })
    }

    renderFormFields() {
        return html`
            ${this.defaultTranslationFile
                ? html`
                      <qrcg-form-comment label=${t`Help`}>
                          Download the
                          <a
                              href="${this.defaultTranslationFile.directLink() ??
                              ''}"
                              download="${this.defaultTranslationFile.getName()}"
                              >default translation file</a
                          >, modify it as needed and then upload it below.
                      </qrcg-form-comment>

                      <qrcg-form-comment label=${t`Hint`}>
                          Do not forget to translate the website content found
                          in
                          <a href="/dashboard/blog-posts">blog</a> and
                          <a href="/dashboard/content-blocks">content blocks</a
                          >.
                      </qrcg-form-comment>
                  `
                : ''}

            <qrcg-input name="name" ?disabled=${this.data?.is_default}
                >${t`Name`}</qrcg-input
            >

            <qrcg-input name="display_name" ?disabled=${this.data?.is_default}>
                <div slot="instructions">
                    ${t`Used in the language picker component. Can be in any language.`}
                </div>
                ${t`Display Name`}
            </qrcg-input>

            <qrcg-input name="locale" ?disabled=${this.data?.is_default}>
                ${t`Locale`}
            </qrcg-input>

            <qrcg-balloon-selector
                name="direction"
                .options=${[
                    {
                        value: 'rtl',
                        name: t`Right to Left`,
                    },
                    {
                        value: 'ltr',
                        name: t`Left to Right`,
                    },
                ]}
            >
                ${t`Direction`}
            </qrcg-balloon-selector>

            <qrcg-file-input
                name="flag_file_id"
                upload-endpoint="files"
                attachable_type="Translation"
            >
                ${t`Flag Image`}
            </qrcg-file-input>

            <qrcg-file-input
                ?readonly=${this.data?.is_default}
                ?disabled=${!this.id}
                name="translation_file_id"
                upload-endpoint="translations/${this.id}/upload"
                accept=".json"
                disabled-instructions=${t`Save the translation record before uploading a translation file`}
            >
                ${t`Translation file`}
            </qrcg-file-input>
        `
    }
}
window.defineCustomElement('qrcg-translation-form', QrcgTranslationForm)
