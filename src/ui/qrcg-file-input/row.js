import { LitElement, css } from 'lit'
import { unsafeStatic, html } from 'lit/static-html.js'

import '../qrcg-box'

import '../qrcg-icon'

import {
    mdiImage,
    mdiClose,
    mdiFile,
    mdiFileDocument,
    mdiFileCode,
    mdiFileExcel,
} from '@mdi/js'

import '../qrcg-loader'
import { isEmpty } from '../../core/helpers'
import { confirm } from '../qrcg-confirmation-modal'
import { t } from '../../core/translate'
import { DirectionAwareController } from '../../core/direction-aware-controller'

export class QrcgFileInputRow extends LitElement {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static styles = [
        css`
            :host {
                display: block;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                margin-top: 1rem;
                position: relative;
            }

            :host(.deleting) {
                overflow: hidden;
                animation: fade-out ease-out 0.5s both;
            }

            qrcg-box::part(container) {
                overflow: visible;
            }

            .container {
                display: flex;
                position: relative;
                align-items: center;
                padding: 1rem 2rem;
                box-shadow: var(--qrcg-input-box-shadow);
                border-radius: 0.5rem;
            }

            qrcg-icon {
                width: 1.5rem;
                height: 1.5rem;
            }

            .file-type {
                margin-right: 1rem;
                color: var(--gray-2);
            }

            :host(.dir-rtl) .file-type {
                margin-right: 0;
                margin-left: 1rem;
            }

            .actions {
                margin-left: auto;
                display: flex;
                align-items: center;
                position: relative;
            }

            .delete {
                width: 1rem;
                cursor: pointer;
            }

            :host([readonly]) .delete {
                pointer-events: none;
                opacity: 0.2;
            }

            qrcg-loader {
                position: absolute;
                transform: translateY(-50%) translateX(-50%) scale(0.3);
                left: -1.5rem;
                top: 50%;
                background-color: white;
            }

            @media (min-width: 800px) {
                qrcg-loader {
                    transform: translateY(-50%) translateX(-50%) scale(0.4);
                }
            }

            .name {
                display: flex;
                overflow: hidden;
                position: relative;
                flex: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            @media (max-width: 900px) {
                .name {
                    max-width: 10rem;
                }
            }

            .name .inner {
                display: inline-block;
                min-width: 7rem;
                font-size: 0.8rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: black;
                flex: 1;
            }

            @media (min-width: 900px) {
                .name .inner {
                    min-width: 12rem;
                }
            }

            .badge {
                font-size: 0.5rem;
                text-transform: uppercase;
                background-color: var(--gray-1);
                padding: 3px 5px;
                border-radius: 5px;
                margin-left: 1rem;
                margin-right: 0.5rem;
                animation: fade-in 0.2s ease-in both;
            }

            .badge.success {
                background-color: var(--success-0);
                color: white;
            }

            .badge.danger {
                background-color: var(--danger);
                color: white;
            }

            .error-message {
                position: absolute;
                color: var(--danger);
                font-size: 0.6rem;
                left: 4.5rem;
                bottom: 0.4rem;
            }

            .clickable {
                cursor: pointer;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                    transform: translateY(4px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fade-out {
                from {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 5rem;
                    margin-top: 1rem;
                }

                to {
                    opacity: 0;
                    transform: translateY(4px);
                    max-height: 0;
                    margin-top: 0;
                }
            }
        `,
    ]

    constructor() {
        super()
    }

    static get properties() {
        return {
            model: {},
            readonly: { type: Boolean, reflect: true },
        }
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.model.disconnect()
    }

    updated() {
        // Disconnect old model after render and connect the model to this row
        if (!this.model.isConnected) {
            this.connectModel()
        }
    }

    connectModel() {
        this.model.connect(this)

        this.model.bind(this.model.events.beforeDelete, this.onBeforeDeleteFile)

        this.model.bind(
            this.model.events.remoteFileDeleted,
            this.onRemoteFileDelete
        )

        this.model.bind(this.model.events.afterDelete, this.onAfterDeleteFile)

        this.model.subscribe(this.onFileModelChanged)
    }

    disconnectModel() {
        this.model.detach(
            this.model.events.beforeDelete,
            this.onBeforeDeleteFile
        )

        this.model.detach(this.model.events.afterDelete, this.onAfterDeleteFile)

        this.model.detach(
            this.model.events.remoteFileDeleted,
            this.onRemoteFileDelete
        )

        this.model.unsubscribe(this.onFileModelChanged)

        this.model.disconnect()
    }

    // eslint-disable-next-line
    onFileModelChanged = (e) => {
        this.requestUpdate()
    }

    renderType() {
        const icon = this.mapFileIcon()

        return html`<qrcg-icon class="file-type" mdi-icon=${icon}></qrcg-icon>`
    }

    mapFileIcon() {
        const definitions = [
            {
                pattern: /png|jpe?g|bmp|svg|psd/,
                icon: mdiImage,
            },
            {
                pattern: /doc|pdf|rtf|txt/,
                icon: mdiFileDocument,
            },
            {
                pattern: /numbers|xlsx/,
                icon: mdiFileExcel,
            },
            {
                pattern: /sh|php|cpp|cs|js|css|sass|scss/,
                icon: mdiFileCode,
            },
            {
                // catch all
                pattern: /.*/,
                icon: mdiFile,
            },
        ]

        return definitions.find((d) => {
            return this.model.extension.match(d.pattern)
        })?.icon
    }

    renderBadge() {
        if (this.model.loading) return

        if (!this.model.badge) return

        return html`<div class="badge ${this.model.badge.type}">
            ${this.model.badge.label}
        </div>`
    }

    onBeforeDeleteFile() {}

    onAfterDeleteFile() {
        this.classList.remove('deleting')
        this.disconnectModel()
    }

    onRemoteFileDelete() {
        this.classList.add('deleting')
    }

    onDelete() {
        this.dispatchEvent(
            new CustomEvent('request-delete', {
                detail: {
                    model: this.model,
                },
            })
        )
    }

    get animationPromise() {
        let _resolve

        const p = new Promise((resolve) => {
            _resolve = resolve
            this.addEventListener('animationend', _resolve)
        })

        p.then(() => {
            this.removeEventListener('animationend', _resolve)
        })

        return p
    }

    renderLink() {
        return this.model.directLink()
            ? html`<a
                  href="${this.model.directLink()}"
                  target="_blank"
                  class="inner"
                  title="Preview"
                  ?download=${this.model.extension.match(/json/)}
                  >${this.model.getName()}</a
              >`
            : html`<span class="inner">${this.model.getName()}</span>`
    }

    renderErrorMessage() {
        const message = this.model.errors[0]

        if (isEmpty(message)) return

        if (message.length < 45)
            return html`
                <div class="error-message">${this.model.errors[0]}</div>
            `
        else {
            return html`
                <div
                    class="error-message clickable"
                    @click=${this.showErrorModal}
                >
                    ${t`Click here for error details.`}
                </div>
            `
        }
    }

    showErrorModal() {
        let message = this.model.errors[0].replace(/\n/g, '<br>')

        message = html`${unsafeStatic(message)}`

        confirm({
            message,
            title: t`Error details`,
            affirmativeText: t`OK`,
            negativeText: null,
        })
    }

    render() {
        return html`
            <div class="container">
                ${this.renderType()}

                <div class="name">
                    ${this.renderLink()}

                    <!-- -->
                </div>
                ${this.renderErrorMessage()}

                <div class="actions">
                    ${this.model.loading
                        ? html`<qrcg-loader></qrcg-loader>`
                        : ''}
                    ${this.renderBadge()}
                    <qrcg-icon
                        class="delete"
                        mdi-icon=${mdiClose}
                        width="nan"
                        height="nan"
                        @click=${this.onDelete}
                        .disabled=${this.model.loading}
                        title="Delete"
                    ></qrcg-icon>
                </div>
            </div>
        `
    }
}
window.defineCustomElement('qrcg-file-input-row', QrcgFileInputRow)
