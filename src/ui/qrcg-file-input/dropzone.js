import { LitElement, html, css } from 'lit'

import '../qrcg-button'

import { mdiUpload } from '@mdi/js'

import { isEmpty } from '../../core/helpers'

import './row'

import { FileModel } from './model'

import { t } from '../../core/translate'

export class QrcgFileInputDropZone extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                overflow: hidden;
                animation: in-animation 0.5s ease both;
                user-select: none;
                -webkit-user-select: none;
            }

            :host(:not([visible])) {
                animation: out-animation 0.5s ease both;
            }

            .dropzone {
                padding: 1rem;
                border-radius: 0.5rem;

                overflow: hidden;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                background-color: white;
                border-radius: 1.5rem;
            }

            .border {
                position: absolute;
                left: -0.8rem;
                top: -0.8rem;
                right: -0.8rem;
                bottom: -0.8rem;
                border: 1rem dashed var(--gray-1);
                border-radius: 1rem;
                box-sizing: border-box;
                pointer-events: none;
                border-radius: 1.5rem;
            }

            :host([drag-over]) .border {
                border-color: black;
            }

            :host([drag-over]) .upload-icon {
                transform: translateY(2rem) scale(1.5);
            }

            :host([drag-over]) .dropzone {
                background-color: var(--primary-0);
            }

            qrcg-button {
                width: fit-content;
                margin-top: 1rem;
                transition: all 0.3s ease;
            }

            :host([drag-over]) qrcg-button {
                opacity: 0;
                transform: translateY(2rem);
            }

            label {
                color: var(--gray-2);
                transition: all 0.3s ease;
            }

            :host([drag-over]) label {
                color: white;
                transform: translateY(2rem);
            }

            .upload-icon {
                color: var(--gray-1);
                width: 3rem;
                height: 3rem;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
            }

            :host([drag-over]) .upload-icon {
                color: white;
            }

            .or {
                margin-top: 1rem;
                position: relative;
                color: var(--gray-1);
                transition: all ease 0.2s;
            }

            :host([drag-over]) .or {
                color: white;
                opacity: 0;
                transform: translateY(2rem);
            }

            .or::before,
            .or::after {
                content: '';
                position: absolute;
                background-color: currentColor;
                display: block;
                height: 2px;
                width: 4rem;
                top: calc(50% - 1px);
            }

            .or::before {
                right: 1.5rem;
            }

            .or::after {
                left: 1.5rem;
            }

            input[type='file'] {
                opacity: 0;
                position: absolute;
                overflow: hidden;
                width: 0;
                height: 0;
            }

            qrcg-file-row {
                margin-top: 1rem;
            }

            @keyframes out-animation {
                from {
                    max-height: 20rem;
                    opacity: 1;
                    transform: translateY(0);
                }

                to {
                    max-height: 0;
                    opacity: 0;
                    transform: translateY(-2rem);
                }
            }

            @keyframes in-animation {
                from {
                    max-height: 0;
                    opacity: 0;
                    transform: translateY(-2rem);
                }

                to {
                    max-height: 20rem;
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `,
    ]

    constructor() {
        super()

        this.ondrop = this.dropHandler.bind(this)

        this.ondragleave = this.dragLeaveHandler.bind(this)

        this.ondragover = this.dragOverHandler.bind(this)

        this.ondragend = this.dragEndHandler.bind(this)

        this.dragOver = false

        this.visible = true
    }

    firstUpdated() {
        this.fileInput.addEventListener('change', this.uploadHandler.bind(this))
    }

    static get properties() {
        return {
            dragOver: { type: Boolean, reflect: true, attribute: 'drag-over' },
            multiple: { type: Boolean },
            visible: { type: Boolean, reflect: true },
            accept: { type: String },
            disabled: { type: Boolean },
        }
    }

    dropHandler(e) {
        this.uploadHandler(e)
    }

    buildFileRows(files) {
        this.fileRows = Array.from(files).map((file) => ({
            file,
            loading: true,
        }))
    }

    async uploadHandler(e) {
        e.stopPropagation()
        e.preventDefault()

        this.dragOver = false

        let files, _files

        if (e.target.tagName.toLowerCase() === 'input') {
            files = e.target.files
        } else {
            files = e.dataTransfer.files
        }

        _files = files

        files = this.acceptFiles(files)

        if (files.length !== _files.length) {
            this.dispatchEvent(new CustomEvent('on-accept-validation-fails'))
            return
        }

        const will = this.dispatchEvent(
            new CustomEvent('will-change', {
                cancelable: true,
                detail: { files },
            })
        )

        if (!will) return

        this.dispatchEvent(
            new CustomEvent('on-change', {
                detail: { files },
            })
        )
    }

    get fileInput() {
        return this.renderRoot.querySelector('input[type="file"]')
    }

    acceptFiles(files) {
        return Array.from(files).filter((file) => {
            if (isEmpty(this.accept)) return true

            const extenstions = this.accept
                .split(',')
                .map((ex) => ex.replace('.', ''))

            const extension = FileModel.fileExtension(file.name)

            return extenstions.indexOf(extension) >= 0
        })
    }

    dragOverHandler(e) {
        e.stopPropagation()
        e.preventDefault()
        if (!this.dragOver) this.dragOver = true
    }

    dragEndHandler(e) {
        e.stopPropagation()
        e.preventDefault()
        this.dragOver = false
    }

    dragLeaveHandler() {
        this.dragOver = false
    }

    openFileSelectionDialog() {
        this.fileInput.click()
    }

    renderFiles() {
        if (isEmpty(this.fileRows)) return

        return this.fileRows.map(
            (row) =>
                html`<qrcg-file-row
                    .file=${row.file}
                    .loading=${row.loading}
                    .badge=${row.badge}
                ></qrcg-file-row>`
        )
    }

    render() {
        return html`
            <div class="dropzone">
                <input
                    type="file"
                    .multiple=${this.multiple}
                    accept=${this.accept}
                    tabindex="-1"
                />

                <qrcg-icon
                    class="upload-icon"
                    mdi-icon=${mdiUpload}
                    width="nan"
                    height="nan"
                ></qrcg-icon>

                <div class="border"></div>

                <label>${t`Drop your files here`}</label>

                <div class="or">${t`or`}</div>

                <qrcg-button
                    ?disabled=${this.disabled}
                    @click=${this.openFileSelectionDialog}
                    >${t`Browse`}</qrcg-button
                >
            </div>
        `
    }
}

window.defineCustomElement('qrcg-file-input-dropzone', QrcgFileInputDropZone)
