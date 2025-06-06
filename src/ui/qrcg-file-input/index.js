import { LitElement, html, css } from 'lit'
import { repeat } from 'lit/directives/repeat.js'

import './row'
import './dropzone'
import { FileModel } from './model'
import { confirm } from '../qrcg-confirmation-modal'
import { isEmpty } from '../../core/helpers'
import { showToast } from '../qrcg-toast'
import { t } from '../../core/translate'
import { FormInputController } from '../../common/form-input-controller'

export class QrcgFileInput extends LitElement {
    inputController = new FormInputController(
        this,
        FormInputController.MODE_PLAIN
    )

    static styles = [
        css`
            :host {
                display: block;
                max-width: 30rem;
                position: relative;
            }

            :host([disabled]) {
                pointer-events: none;
            }

            :host([disabled]) qrcg-file-input-dropzone {
                opacity: 0.8 !important;
            }

            :host([hidden]) {
                display: none;
            }

            .title {
                font-size: 0.8rem;
                margin-bottom: 0.5rem;
                font-weight: bold;
                letter-spacing: 1px;
                user-select: none;
                -webkit-user-select: none;
                display: block;
            }

            .disabled-instructions {
                background-color: var(--warning-0);
                color: black;
                font-size: 0.8rem;
                margin-top: 0.5rem;
                padding: 0.5rem;
                animation: slide-in 0.3s 0.5s ease-in both;
            }

            .instructions::slotted(*) {
                font-size: 0.8rem;
                padding: 0.5rem;
                background-color: var(--gray-0);
                margin-bottom: 0.5rem;
            }

            .error {
                color: var(--danger);
                position: absolute;
                font-size: 0.8rem;
                font-weight: bold;
                bottom: 0rem;
                transform: translateY(100%);
                animation: fade-in ease 1s both;
                display: flex;
                justify-content: space-between;
                left: 0;
                right: 0;
            }

            .error-expand {
                display: block;
                font-weight: normal;
                color: var(--primary-0);
                margin-left: 1rem;
                text-decoration: underline;
                cursor: pointer;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

            @keyframes slide-in {
                from {
                    transform: translateY(-0.5rem);
                    opacity: 0;
                    max-height: 0;
                    margin-top: 0;
                    padding: 0;
                }

                to {
                    transform: translateY(0);
                    opacity: 1;
                    max-height: 2rem;
                    margin-top: 0.5rem;
                    padding: 0.5rem;
                }
            }
        `,
    ]

    static get properties() {
        return {
            /**
             * @type string|array|null File id or array of ids if multiple is true.
             */
            value: {},

            /**
             * @type string Input name when used inside form
             */
            name: {},

            /**
             * @type string Input name alias when name cannot be set.
             */
            _name: {},
            /**
             * @type bool
             */
            multiple: { type: Boolean },

            /**
             * @type string Upload type e.g. logo
             */
            type: {},

            /**
             * @type [FileModel] array of files
             */
            files: {},

            /**
             * @type string
             */
            uploadEndpoint: {
                attribute: 'upload-endpoint',
            },

            fetchEndpoint: {
                attribute: 'fetch-endpoint',
            },

            deleteEndpoint: {
                attribute: 'delete-endpoint',
            },

            /**
             * @type string comma separated list of extensions (with dots) e.g. .doc,.docx,.pdf
             */
            accept: {},

            disabled: { type: Boolean, reflect: true },

            disabledInstructions: { attribute: 'disabled-instructions' },

            readonly: { type: Boolean },

            errors: { type: Array },

            attachable_type: {},

            hidden: {
                type: Boolean,
                reflect: true,
            },
        }
    }

    constructor() {
        super()

        this.files = []

        this.multiple = false

        // this.disabled = false
    }

    firstUpdated() {
        super.firstUpdated()
        this.files = []
    }

    async onFilesChange(e) {
        const files = Array.from(e.detail.files)

        this.files = this.files.concat(
            files.map((file) => this.makeFile({ file }))
        )

        await new Promise((resolve) => setTimeout(resolve, 500))

        for (const file of this.files) {
            await file.upload()
        }

        this.fireOnInput()
    }

    makeFileParams(params = {}) {
        return {
            ...params,
            uploadEndpoint: this.uploadEndpoint,
            _name: this._name,
            name: this.name,
            fetchEndpoint: this.fetchEndpoint,
            attachable_type: this.attachable_type,
        }
    }

    makeFile(params = {}) {
        return new FileModel(this.makeFileParams(params))
    }

    updated(changed) {
        if (changed.has('value')) {
            this.makeFilesFromValue()
        }
    }

    async fireOnInput() {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const values = this.files.map((f) => f.id)

        const value =
            values.length === 0 ? null : values.length > 1 ? values : values[0]

        this.value = value

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    value,
                    name: this.name,
                    uploadEndpoint: this.uploadEndpoint,
                    _name: this._name,
                },
            })
        )
    }

    async makeFilesFromValue() {
        const value = this.value instanceof Array ? this.value : [this.value]

        if (isEmpty(value)) return

        if (this.name === 'logo') {
            console.log({ value })
        }

        if (!this.multiple) {
            this.files = [
                await FileModel.fromRemote(value[0], this.makeFileParams()),
            ]
            return
        }

        for (const id of value) {
            if (this.files.find((f) => f.id == id)) continue

            this.files = [
                ...this.files,

                await FileModel.fromRemote(id, this.makeFileParams()),
            ]
        }
    }

    async onRequestDelete(e) {
        try {
            await confirm({
                message: t('Are you sure you want to delete file?'),
            })

            await e.detail.model.delete(this.deleteEndpoint)

            this.files = this.files.filter(
                (f) => f.hash() !== e.detail.model.hash()
            )

            this.fireOnInput()
            // eslint-disable-next-line
        } catch (err) {}
    }

    dropZoneWillChange(e) {
        if (this.multiple) return

        const files = e.detail.files

        if (files.length > 1) {
            e.preventDefault()

            return showToast(t('Cannot upload more than one file'))
        }

        if (this.files.length) {
            e.preventDefault()

            return showToast(
                t('Please delete old file before uploading a new one')
            )
        }
    }

    shouldShowDropzone() {
        if (this.multiple) return true

        return this.files.length === 0
    }

    onAcceptValidationFails() {
        showToast('File type is not supported')
    }

    renderErrors() {
        if (isEmpty(this.errors)) return

        const hasManyErrors =
            this.errors.length > 1 || this.errors[0].length > 30

        if (hasManyErrors) {
            return html`
                <label class="error">
                    <span>${this.errors[0].substring(0, 30)} ...</span>
                    <span class="error-expand"> ${t`view details`} </span>
                </label>
            `
        }
        return html` <label class="error"> ${this.errors[0]}</label> `
    }

    render() {
        return html`
            <label class="title"><slot></slot></label>

            <slot name="instructions" class="instructions"></slot>

            <qrcg-file-input-dropzone
                .visible=${this.shouldShowDropzone()}
                multiple=${this.multiple}
                @on-change=${this.onFilesChange}
                @will-change=${this.dropZoneWillChange}
                accept=${this.accept}
                @on-accept-validation-fails=${this.onAcceptValidationFails}
                ?disabled=${this.disabled}
            ></qrcg-file-input-dropzone>

            ${repeat(
                this.files,
                (file) => file.hash(),
                (file) => html`
                    <qrcg-file-input-row
                        .model=${file}
                        @request-delete=${this.onRequestDelete}
                        ?readonly=${this.readonly}
                    ></qrcg-file-input-row>
                `
            )}
            ${this.disabled && this.disabledInstructions
                ? html`
                      <div class="disabled-instructions">
                          ${this.disabledInstructions}
                      </div>
                  `
                : ''}
            ${this.renderErrors()}
        `
    }
}

window.defineCustomElement('qrcg-file-input', QrcgFileInput)
