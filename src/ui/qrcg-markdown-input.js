import { LitElement, css } from 'lit'

import { html } from 'lit/static-html.js'

import { post } from '../core/api'

import { debounce, isEmpty } from '../core/helpers'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import './qrcg-textarea'

export class QrcgMarkdownInput extends LitElement {
    api = new QRCGApiConsumer(this)

    static styles = [
        css`
            :host {
                display: grid;
                grid-gap: 1rem;
            }

            @media (min-width: 900px) {
                :host {
                    grid-template-columns: minmax(40%, 1fr) minmax(50%, 1fr);
                }
            }

            #preview {
                /* margin-top: 1.4rem; */
                line-height: 1.5;
                border: 4px solid var(--gray-0);
                margin-bottom: 1rem;
                overflow: hidden;
            }

            qrcg-textarea::part(textarea) {
                margin-bottom: 0;
            }

            @media (min-width: 900px) {
                #preview {
                    margin-top: 1.4rem;
                }
                qrcg-textarea::part(textarea) {
                    margin-bottom: 1rem;
                }
            }

            .preview-body {
                padding: 1rem;
                overflow: scroll;
                max-height: 30rem;
                width: 100%;
                box-sizing: border-box;
            }

            .preview-title {
                margin: 0;
                font-size: 0.8rem;
                padding: 0.5rem;
                line-height: 1;
                text-align: center;
                text-transform: uppercase;
                color: var(--primary-0);
                background-color: var(--gray-0);
                letter-spacing: 1px;
            }

            .empty {
                color: var(--gray-2);
                text-align: center;
                font-style: italic;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {},
            placeholder: {},
            errors: {},
        }
    }

    constructor() {
        super()
        this.requestPreview = debounce(this.requestPreview, 1000)
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.requestPreview)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.requestPreview)
    }

    firstUpdated() {
        this.renderPreview()
        this.requestPreview()
    }

    requestPreview = async () => {
        const { response } = await post('markdown', {
            markdown: this.value,
        })

        this.renderPreview((await response.json()).html)
    }

    renderPreview(content) {
        let result = content

        if (isEmpty(content)) {
            result = `<div class="empty">
                Start typing to see results here ...
            </div>`
        }

        this.shadowRoot.querySelector('.preview-body').innerHTML = result
    }
    render() {
        return html`
            <qrcg-textarea
                name=${this.name}
                value=${this.value}
                rows="20"
                placeholder=${this.placeholder}
                .errors=${this.errors}
            >
                <slot></slot>
                <slot slot="instructions" name="instructions">
                    <div>
                        Post content in markdown format, check
                        <a
                            href="https://www.markdownguide.org/basic-syntax/"
                            target="_blank"
                            style="color: var(--primary-0); text-decoration: none;"
                            >this guide</a
                        >.
                    </div>
                </slot>
            </qrcg-textarea>

            <div id="preview">
                <h3 class="preview-title">Preview</h3>
                <div class="preview-body"></div>
            </div>
        `
    }
}
window.defineCustomElement('qrcg-markdown-input', QrcgMarkdownInput)
