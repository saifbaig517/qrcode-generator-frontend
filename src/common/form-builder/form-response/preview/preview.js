import { html } from 'lit'
import { BaseComponent } from '../../../../core/base-component/base-component'

import style from './preview.scss?inline'
// eslint-disable-next-line
import { FormBuilderModel } from '../../form-builder-model'
import { t } from '../../../../core/translate'
import {
    isEmpty,
    mapEventDelegate,
    parentMatches,
} from '../../../../core/helpers'
import { destroy, get } from '../../../../core/api'
import { confirm } from '../../../../ui/qrcg-confirmation-modal'
import { showToast } from '../../../../ui/qrcg-toast'

export class FormResponsePreview extends BaseComponent {
    static tag = 'qrcg-custom-form-response-preview'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            response: {},
            responseId: {
                attribute: 'response-id',
            },
            loading: {
                type: Boolean,
            },
        }
    }

    static EVENT_CHANGE_REQUESTED = `${this.tag}:change-requested`

    static EVENT_AFTER_DELETE = `${this.tag}::after-delete`

    constructor() {
        super()

        /**
         * @type {FormBuilderModel}
         */
        this.response = null
    }

    updated(changed) {
        if (changed.has('responseId')) {
            this.fetchResponse()
        }
    }

    async fetchResponse() {
        if (isEmpty(this.responseId)) {
            return
        }

        this.loading = true

        const { json } = await get('custom-forms/response/' + this.responseId)

        this.response = json

        this.loading = false
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

        if (parentMatches(target, '.action.change')) {
            this.dispatchChangeRequestedEvent()
        }

        mapEventDelegate(e, {
            '.action.change': this.dispatchChangeRequestedEvent,
            '.action.delete': this.onDeleteClick,
        })
    }

    onDeleteClick = async () => {
        await confirm({
            message: t`Are you sure you want to delete form response?`,
        })

        try {
            await destroy('custom-forms/response/' + this.response.id)

            showToast(t`Resopnse delete successfully`)

            this.dispatchEvent(
                new CustomEvent(FormResponsePreview.EVENT_AFTER_DELETE, {
                    composed: true,
                    bubbles: true,
                })
            )
        } catch (ex) {
            console.error(ex)

            showToast(t`Error while deleting form response.`)
        }
    }

    getDate() {
        const date = new Date(this.response.created_at)

        return date.toLocaleString()
    }

    dispatchChangeRequestedEvent = () => {
        this.dispatchEvent(
            new CustomEvent(FormResponsePreview.EVENT_CHANGE_REQUESTED, {
                bubbles: true,
                composed: true,
                detail: {
                    response: this.response,
                },
            })
        )
    }

    renderField(field) {
        return html`
            <div class="field">
                <div class="field-name">${field.name}</div>
                <div class="field-value">${field.value}</div>
            </div>
        `
    }

    renderLoader() {
        if (this.loading) {
            return html`
                <div class="loading-container">
                    <qrcg-loader></qrcg-loader>
                </div>
            `
        }
    }

    renderFormName() {
        const name = this.response?.custom_form?.name

        if (isEmpty(name)) {
            return
        }

        return html`
            <div class="form-name">
                <!--  -->
                ${name}
            </div>
        `
    }

    renderFields() {
        if (isEmpty(this.response) || this.loading) return

        return html`
            <div class="container">
                <div class="fields">
                    ${this.response?.fields.map((field) =>
                        this.renderField(field)
                    )}
                </div>

                <div class="date" part="date">${this.getDate()}</div>

                <div class="actions" part="actions">
                    <div class="action change" part="action-change">
                        ${t`Change`}
                    </div>

                    <div class="action delete" part="action-delete">
                        ${t`Delete`}
                    </div>
                </div>
            </div>
        `
    }

    renderEmptyMessage() {
        if (!isEmpty(this.response)) return

        if (this.loading) return

        return html`
            <div class="empty-message">${t`No result could be found.`}</div>
        `
    }

    render() {
        return html`
            ${this.renderLoader()}
            <!--  -->
            ${this.renderFormName()}
            <!--  -->
            ${this.renderFields()}
            <!--  -->
            ${this.renderEmptyMessage()}
        `
    }
}

FormResponsePreview.register()
