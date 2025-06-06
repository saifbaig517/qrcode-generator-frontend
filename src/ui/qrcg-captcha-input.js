import { LitElement, html, css } from 'lit'

import { classMap } from 'lit/directives/class-map.js'

import { get } from '../core/api'

import { get as _get } from '../core/helpers'

import { mdiRefresh } from '@mdi/js'

import { isEmpty } from '../core/helpers'

export class QrcgCaptchaInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                border: 2px solid var(--gray-1);
                padding: 1rem;
                border-radius: 0.5rem;
                position: relative;
            }

            .empty-image,
            img {
                width: 193px;
                height: 84px;

                background-color: white;
                display: block;
                border: 2px solid var(--gray-1);
            }

            .empty-image {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            qrcg-loader {
                transform: scale(0.5);
            }

            label {
                font-weight: bold;
                display: block;
                margin-bottom: 0.5rem;
            }

            .image-row {
                display: flex;
                align-items: center;
            }

            .refresh {
                margin-left: 1rem;
                display: flex;
                align-items: center;
                font-size: 0.8rem;
                user-select: none;
                -webkit-user-select: none;
                transition: opacity 0.2s ease;
                cursor: pointer;
            }

            .refresh.disabled {
                pointer-events: none;
                opacity: 0.3;
            }
            .refresh:hover {
                text-decoration: underline;
            }

            .refresh .icon {
                margin-right: 0.5rem;
            }

            .refresh:hover .icon {
                /* transition: none; */
                animation: rotate 1s linear both infinite;
            }

            @keyframes rotate {
                from {
                    transform: rotate(0);
                }

                to {
                    transform: rotate(360deg);
                }
            }

            .error {
                color: var(--danger);
                position: absolute;
                font-size: 0.8rem;
                font-weight: bold;
                transform: translateY(100%);
                animation: fade-in ease 1s both;
                bottom: 1.3rem;
            }

            .text {
                font-size: 0.7rem;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }
        `,
    ]

    static get properties() {
        return {
            image: {},
            name: {},
            value: {},
            code: {},
            session_key: {},
            errors: { type: Array },
            label: {},
            differentImageText: {
                attribute: 'different-image-text',
            },
            placeholder: {},
        }
    }

    constructor() {
        super()
        this.errors = []
        this.differentImageText = 'Different image'
        this.placeholder = 'Enter the code you see above'
        this.label = 'Human Verification'
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetch()
    }

    willUpdate(changed) {
        if (changed.has('value')) {
            this.code = _get(this.value, 'code') || ''
            this.session_key = _get(this.value, 'session_key') || ''
        }
    }

    fetch = async () => {
        this.image = null

        const { response } = await get('captcha')

        const data = await response.json()

        this.image = data.image

        const session_key = data.session_key

        this.fireOnInput({
            session_key,
            code: this.code,
        })
    }

    onInput(e) {
        e.stopImmediatePropagation()

        const code = e.detail.value

        this.fireOnInput({
            code,
            session_key: this.session_key,
        })
    }

    refresh = async () => {
        await this.fetch()

        await new Promise((resolve) => setTimeout(resolve, 10))

        this.fireOnInput({
            code: '',
            session_key: this.session_key,
        })
    }

    fireOnInput(value) {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                composed: true,
                bubbles: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    render() {
        return html`
            <label>${this.label}</label>
            <div class="image-row">
                ${this.image
                    ? html`<img src=${this.image} />`
                    : html`<div class="empty-image">
                          <qrcg-loader></qrcg-loader>
                      </div>`}

                <div
                    class=${classMap({
                        refresh: true,
                        disabled: !this.image,
                    })}
                    @click=${this.fetch}
                >
                    <qrcg-icon class="icon" mdi-icon=${mdiRefresh}></qrcg-icon>
                    <span class="text"> ${this.differentImageText} </span>
                </div>
            </div>

            <qrcg-input
                @on-input=${this.onInput}
                name="code"
                placeholder=${this.placeholder}
                .value=${this.code}
            ></qrcg-input>

            ${isEmpty(this.errors)
                ? ''
                : html`<div class="error">${this.errors[0]}</div>`}
        `
    }
}
window.defineCustomElement('qrcg-captcha-input', QrcgCaptchaInput)
