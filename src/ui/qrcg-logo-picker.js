import { LitElement, html, css } from 'lit'

import { isEmpty, parentMatches, titleCase, url } from '../core/helpers'

export class QrcgLogoPicker extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            * {
                box-sizing: border-box;
                touch-action: manipulation;
            }

            .outer {
                overflow: hidden;
                padding: 0.5rem 0;
                font-size: 0;
                line-height: 0;
            }

            .container {
                display: flex;
                flex-wrap: wrap;
                margin: 0 -0.5rem 0 0;
                font-size: 0;
                line-height: 0;
            }

            .img-btn {
                -webkit-appearance: none;
                appearance: none;
                background-color: var(--gray-0);
                outline: 0;
                border: 0;
                padding: 1rem;
                margin: 0.15rem 0.5rem 0.5rem 0.15rem;

                cursor: pointer;

                user-select: none;
                -webkit-user-select: none;

                touch-action: manipulation;
            }

            .img-btn:focus,
            .img-btn.active {
                outline: solid 0.15rem var(--primary-0);
            }

            .img-btn.active {
                background-color: var(--gray-1);
            }

            .logo,
            .btn-text {
                display: block;
                width: 2rem;
                height: 2rem;
                font-size: 0.7rem;
                display: flex;
                align-items: center;
                color: black;
            }

            .logo.none {
                display: none;
            }
        `,
    ]

    get files() {
        return [
            '',
            'address-book.png',
            'badoo.png',
            'dribbble.png',
            'dropbox.png',
            'facebook.png',
            'google-calendar.png',
            'google-forms.png',
            'google-maps.png',
            'google-meet.png',
            'google-sheets.png',
            'google-slides.png',
            'instagram.png',
            'linkedin.png',
            'paypal.png',
            'pinterest.png',
            'skype.png',
            'snapchat.png',
            'soundcloud.png',
            'spotify.png',
            'swarm.png',
            'telegram.png',
            'twitter.png',
            'viber.png',
            'vimeo.png',
            'vine.png',
            'whatsapp.png',
            'youtube.png',
            'zoom-meeting.png',
            'buymeacoffee.png',
            'patreon.png',
        ]
    }

    static get properties() {
        return {
            name: {},
            value: {},
            noneText: {
                attribute: 'none-text',
            },
        }
    }

    constructor() {
        super()
        this.noneText = 'None'
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
        const elem = parentMatches(e.composedPath()[0], '.img-btn')

        if (elem) {
            this.onImgButtonClick(elem)
        }
    }

    onImgButtonClick(elem) {
        const img = elem.querySelector('.logo')

        // If src is empty it will fallback to current origin
        const value =
            img.src.replace(/\/$/, '') === location.origin ? '' : img.src

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    getFileName(url) {
        if (isEmpty(url)) return ''

        const a = document.createElement('a')

        a.href = url

        const path = a.pathname

        return path.substring(path.lastIndexOf('/')).replace('/', '')
    }

    renderLogos() {
        return this.files.map((f) => {
            const title = f ? titleCase(f.replace('.png', '')) : this.noneText

            let imgClass = `logo ${!f ? 'none' : ''}`.trim()

            const base = url('assets/images/png-logos/')

            const src = f ? base + f : ''

            const btnClass = `img-btn ${
                f === this.getFileName(this.value) ? 'active' : ''
            }`.trim()

            return html`
                <button class="${btnClass}" title=${title}>
                    ${!f
                        ? html`<span class="btn-text">${this.noneText}</span>`
                        : ''}
                    <img class=${imgClass} src=${src} />
                </button>
            `
        })
    }

    render() {
        return html`
            <div class="outer">
                <div class="container">${this.renderLogos()}</div>
            </div>
        `
    }
}
window.defineCustomElement('qrcg-logo-picker', QrcgLogoPicker)
