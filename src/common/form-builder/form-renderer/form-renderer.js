import { html } from 'lit'
import style from './form-renderer.scss?inline'
import { BaseComponent } from '../../../core/base-component/base-component'
import { FormBuilderModel } from '../form-builder-model'
import { get, post } from '../../../core/api'
import { isEmpty, parentMatches } from '../../../core/helpers'

import { FormFieldManager } from './fields/manager'

import './fields/list'
import { showToast } from '../../../ui/qrcg-toast'
import { t } from '../../../core/translate'
// eslint-disable-next-line
import { FormFieldModel } from '../form-field/form-field-model'

export class CustomFormRenderer extends BaseComponent {
    static tag = 'qrcg-custom-form-renderer'

    static styleSheets = [...super.styleSheets, style]

    static EVENT_ON_SUBMIT = `${this.tag}:on-submit`

    static EVENT_ON_MODEL_READY = `${this.tag}:on-model-ready`

    fields = new FormFieldManager()

    static get properties() {
        return {
            ...super.properties,

            formId: {
                attribute: 'form-id',
            },

            model: {},

            loading: {
                type: Boolean,
            },

            submitLoading: {
                type: Boolean,
                attribute: 'submit-loading',
            },
        }
    }

    constructor() {
        super()

        this.model = new FormBuilderModel()

        this.formId = null

        this.loading = true

        this.submitLoading = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        const target = e.composedPath()[0]

        const submitButton = parentMatches(target, '[slot="submit-button"]')

        if (submitButton) {
            this.submit()
        }
    }

    setSubmitLoading(loading) {
        const button = this.querySelector('[slot=submit-button]')

        button.loading = loading

        this.submitLoading = loading
    }

    isFormValid() {
        return this.model.getFields().reduce(
            /**
             *
             * @param {FormFieldModel} field
             */
            (isValid, field) => {
                if (field.isMandatory()) {
                    const input = this.$(`[name="${field.id}"]`)

                    if (isEmpty(input.value)) {
                        isValid = false

                        input.setAttribute('has-error', 'true')

                        input.errors = [t`The field is required`]
                    } else {
                        input.removeAttribute('has-error')

                        input.errors = []
                    }
                }

                return isValid
            },
            true
        )
    }

    async submit() {
        if (!this.isFormValid()) return

        this.setSubmitLoading(true)

        try {
            const fields = this.collectFormData()

            const { json } = await post(
                'custom-forms/' + this.formId + '/response',
                {
                    fields,
                }
            )

            showToast(t`Submitted successfully.`)

            this.fireSubmitEvent(json)
        } catch (ex) {
            //
            console.error(ex)

            throw ex
        } finally {
            this.setSubmitLoading(false)
        }
    }

    fireSubmitEvent(response) {
        this.dispatchEvent(
            new CustomEvent(CustomFormRenderer.EVENT_ON_SUBMIT, {
                bubbles: true,
                composed: true,
                detail: {
                    response,
                },
            })
        )
    }

    collectFormData() {
        return this.model.getFields().reduce(
            /**
             *
             * @param {Array} data
             * @param {FormFieldModel} field
             * @returns
             */
            (data, field) => {
                field.value = this.$(`[name="${field.id}"]`)?.value

                data.push(field)

                return data
            },
            []
        )
    }

    updated(changed) {
        if (changed.has('formId')) {
            if (!isEmpty(this.formId)) {
                this.fetch()
            }
        }
    }

    async fetch() {
        this.loading = true

        try {
            const { json } = await get('custom-forms/' + this.formId)

            this.model = FormBuilderModel.fromObject(json)

            this.requestUpdate()

            this.notifyModelReady()
        } catch (ex) {
            console.log(ex)
        }

        this.loading = false
    }

    notifyModelReady() {
        this.dispatchEvent(
            new CustomEvent(CustomFormRenderer.EVENT_ON_MODEL_READY, {
                bubbles: true,
                composed: true,
            })
        )
    }

    renderLoader() {
        return html`
            <div class="loading-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    /**
     *
     * @param {FormFieldModel} field
     */

    renderFormField(field) {
        return this.fields.forModel(field)?.withField(field).render()
    }

    renderFormFields() {
        return this.model.getFields().map((field) => {
            return this.renderFormField(field)
        })
    }

    renderSubmitButton() {
        return html`
            <div class="submit-button">
                <slot name="submit-button"></slot>
            </div>
        `
    }

    render() {
        if (this.loading) {
            return this.renderLoader()
        }

        return [this.renderFormFields(), this.renderSubmitButton()]
    }
}

CustomFormRenderer.register()
