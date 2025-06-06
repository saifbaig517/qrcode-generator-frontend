import { html } from 'lit'
import { BaseComponent } from '../../core/base-component/base-component'
import style from './form-builder.scss?inline'

import './form-field/form-field'
import { mdiCloseThick, mdiCog, mdiPlusBox } from '@mdi/js'
import { t } from '../../core/translate'
import { FormBuilderModel } from './form-builder-model'
import { get, post, put } from '../../core/api'
import { isEmpty, isNotEmpty, parentMatches } from '../../core/helpers'
import { confirm } from '../../ui/qrcg-confirmation-modal'
import { FormSettings } from './form-settings/form-settings'

export class FormBuilder extends BaseComponent {
    static tag = 'qrcg-form-builder'

    static styleSheets = [...super.styleSheets, style]

    model = new FormBuilderModel()

    static RENDER_MODE_FORM_SECTION = 'form-section'
    static RENDER_MODE_PLAIN = 'plain'

    static get properties() {
        return {
            ...super.properties,
            name: {},
            value: {},
            fetchLoading: {
                type: Boolean,
                reflect: true,
                attribute: 'fetch-loading',
            },
            renderMode: {
                type: String,
                attribute: 'render-mode',
            },

            showFormNameInput: {
                type: Boolean,
                attribute: 'show-form-name-input',
            },

            settings: {
                type: Array,
            },

            type: {
                type: String,
            },

            relatedModel: {
                attribute: 'related-model',
            },

            relatedModelId: {
                attribute: 'related-model-id',
            },
        }
    }

    /**
     *
     * @returns {FormBuilder}
     */
    static findSelf(container) {
        return super.findSelf(container)
    }

    constructor() {
        super()

        this.renderMode = FormBuilder.RENDER_MODE_FORM_SECTION

        this.showFormNameInput = false

        this.settings = []

        this.type = null

        this.relatedModel = null

        this.relatedModelId = null
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)

        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        const target = e.composedPath()[0]

        const deleteContainer = parentMatches(target, '.delete')

        if (deleteContainer) {
            const formField = parentMatches(
                deleteContainer,
                '[name="form_field"]'
            )

            const field = formField.model

            this.onDeleteFormField(field)
        }
    }

    /**
     *
     * @param {FormBuilderModel} field
     */
    async onDeleteFormField(field) {
        try {
            await confirm({
                message: t`Are you sure you want to delete` + ` ${field.name}?`,
            })

            this.model.deleteField(field)

            this.requestUpdate()

            this.save()
        } catch (ex) {
            //
            console.error(ex)
        }
    }

    updated(changed) {
        if (changed.has('value')) {
            this.fetchIfNeeded()
        }
    }

    fetchIfNeeded() {
        if (isEmpty(this.value)) return

        if (this.value == this.model.id) {
            return
        }

        this.model.id = this.value

        this.fetch()
    }

    async fetch() {
        this.fetchLoading = true

        try {
            const { json } = await get(this.getEndpoint())

            this.model = FormBuilderModel.fromObject(json, this.model)

            this.syncInputs()

            this.requestUpdate()
        } catch (ex) {
            console.error(ex)
        }

        this.fetchLoading = false
    }

    syncInputs() {
        // Form fields are synced automatically, we just need to sync
        // other inputs
        this.$$('[name]:not(qrcg-form-builder-field)').forEach((input) => {
            const value = this.model[input.name]

            if (isNotEmpty(value)) {
                input.value = value
            }
        })
    }

    onInput(e) {
        const target = e.composedPath()[0]

        if (target === this) return

        this.save()

        e.preventDefault()
        e.stopImmediatePropagation()
    }

    getEndpoint() {
        const id = this.model.id != 0 ? this.model.id : ''

        let endpoint = 'custom-forms/' + id

        endpoint = endpoint.replace(/\/$/, '')

        return endpoint
    }

    extractSectionTitle() {
        const nodes = Array.from(
            this.$('.section-title slot').assignedNodes({
                flatten: true,
            })
        )

        const title = nodes
            .reduce((text, node) => {
                return text + node.textContent.trim()
            }, '')
            .trim()

        return title
    }

    extractTitle() {
        if (this.renderMode == FormBuilder.RENDER_MODE_FORM_SECTION) {
            return this.extractSectionTitle()
        }

        return this.innerText.trim()
    }

    getFormName() {
        let formName = null

        if (this.showFormNameInput) {
            formName = this.$('[name="name"]').value
        }

        if (isNotEmpty(formName)) {
            return formName
        }

        return this.extractTitle()
    }

    async doSave() {
        const save = this.value ? put : post

        this.model.name = this.getFormName()

        this.model.type = this.type

        this.model.related_model = this.relatedModel ?? ''

        this.model.related_model_id = this.relatedModelId ?? ''

        const { json } = await save(this.getEndpoint(), this.model)

        this.model.id = json.id

        this.setValue(json.id)
    }

    save() {
        clearTimeout(this.__saveTimeout)

        this.__saveTimeout = setTimeout(() => {
            this.doSave()
        }, 500)
    }

    dispatchOnInput() {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: this.value,
                },
            })
        )
    }

    setValue(value) {
        this.value = value

        this.dispatchOnInput()
    }

    onAddFieldClick() {
        this.model.addNewField()

        this.requestUpdate()
    }

    async showSettingsModal() {
        try {
            this.model = await FormSettings.open({
                fields: this.settings,
                formModel: this.model,
            })

            this.dispatchOnInput()
            //
        } catch {
            //
        }
    }

    renderFormFields() {
        return this.model.getFields().map(
            (field) => html`
                <qrcg-form-builder-field name="form_field" .model=${field}>
                    <div class="delete">
                        <qrcg-icon mdi-icon=${mdiCloseThick}></qrcg-icon>
                    </div>
                </qrcg-form-builder-field>
            `
        )
    }

    renderFormNameInput() {
        if (!this.showFormNameInput) return

        return html`
            <qrcg-input name="name" placeholder=${t`Enter form name`}>
                ${t`Form Name`}
            </qrcg-input>
        `
    }

    renderToolbar() {
        if (isEmpty(this.settings)) return

        return html`
            <div class="toolbar">
                <div class="summary">
                    ${t`Showing`} ${this.model.getFields().length}
                    ${t`field(s)`}
                </div>

                <div class="actions">
                    <slot name="actions"> </slot>
                    <qrcg-button
                        class="settings"
                        @click=${this.showSettingsModal}
                    >
                        <qrcg-icon mdi-icon=${mdiCog}></qrcg-icon>
                        ${t`Form Settings`}
                    </qrcg-button>
                </div>
            </div>
        `
    }

    renderContent() {
        return html`
            <div class="instructions">
                <slot name="instructions"></slot>
            </div>

            ${this.renderToolbar()}

            <!--  -->
            ${this.renderFormNameInput()}

            <!--  -->
            ${this.renderFormFields()}

            <div class="add" @click=${this.onAddFieldClick}>
                <qrcg-icon mdi-icon=${mdiPlusBox}></qrcg-icon>
                ${t`Add Field`}
            </div>
        `
    }

    renderFormSectionMode() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">
                    <slot></slot>
                </h2>

                ${this.renderContent()}
            </qrcg-form-section>
        `
    }

    render() {
        if (this.renderMode == FormBuilder.RENDER_MODE_FORM_SECTION) {
            return this.renderFormSectionMode()
        }

        return this.renderContent()
    }
}

FormBuilder.register()
