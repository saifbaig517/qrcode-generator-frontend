import { LitElement, css } from 'lit'
import { unsafeStatic, html } from 'lit/static-html.js'
import { FileModel } from './qrcg-file-input/model'

export class QrcgFileImage extends LitElement {
    static PLACEHOLDER = `<svg viewBox="0 0 490.00201 489.99771" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><g id="g828" transform="translate(-105,-35.002094)"><path id="path826" d="m 465.85,333.09 c -3.1445,-3.1562 -7.3711,-4.9961 -11.82,-5.1484 -4.4531,-0.14844 -8.793,1.4062 -12.141,4.3438 l -45.184,39.691 40.512,34.738 c 3.7266,2.9531 6.0898,7.2969 6.5469,12.031 0.4571,4.7341 -1.0352,9.4492 -4.1289,13.062 -3.0937,3.6128 -7.5234,5.8086 -12.27,6.0859 -4.75,0.27734 -9.4023,-1.3906 -12.898,-4.6172 l -138.74,-119 c -3.3516,-2.8672 -7.6602,-4.3633 -12.066,-4.1914 -4.4058,0.1719 -8.582,2 -11.699,5.1211 l -146.96,147.04 v 10.254 c 0,13.926 5.5312,27.277 15.375,37.125 9.8477,9.8438 23.199,15.375 37.125,15.375 h 385 c 13.926,0 27.277,-5.5312 37.125,-15.375 9.8438,-9.8477 15.375,-23.199 15.375,-37.125 v -11.023 z M 227.2,290.5 c 9.3789,-9.3086 21.91,-14.754 35.113,-15.262 13.203,-0.51172 26.113,3.957 36.18,12.516 l 71.363,61.164 49,-42.98 0.004,-0.004 c 10.031,-8.7656 23.016,-13.402 36.332,-12.969 13.316,0.42969 25.973,5.8984 35.418,15.297 L 595,412.122 V 87.502094 c 0,-13.926 -5.5312,-27.277 -15.375,-37.125 -9.8477,-9.8438 -23.199,-15.375 -37.125,-15.375 h -385 c -13.926,0 -27.277,5.5312 -37.125,15.375 -9.8438,9.8477 -15.375,23.199 -15.375,37.125 V 412.75209 Z M 385,105 c 18.566,0 36.371,7.375 49.496,20.504 C 447.625,138.629 455,156.434 455,175 c 0,18.566 -7.375,36.371 -20.504,49.496 C 421.371,237.625 403.566,245 385,245 366.434,245 348.629,237.625 335.504,224.496 322.375,211.371 315,193.566 315,175 c 0,-18.566 7.375,-36.371 20.504,-49.496 C 348.629,112.375 366.434,105 385,105 Z"/></g></svg>`

    static styles = [
        css`
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                color: var(--gray-1);
            }

            :host([loading]) {
                background-color: var(--gray-1);
                border-radius: 0.25rem;
            }

            img {
                max-width: 100%;
                max-height: 100%;
            }

            svg path {
                fill: currentColor;
            }

            qrcg-loader {
                transform: translate(-50%, -50%) scale(0.4);
                position: absolute;
                top: 50%;
                left: 50%;
                color: var(--dark);
            }

            @media (min-width: 3000px) {
                qrcg-loader {
                    transform: translate(-50%, -50%) scale(1.5);
                }
            }
        `,
    ]

    static get properties() {
        return {
            fileId: { attribute: 'file-id' },
            fileSrc: {},
            fetchEndpoint: {
                attribute: 'fetch-endpoint',
            },
            loading: {
                type: Boolean,
                reflect: true,
            },
        }
    }

    constructor() {
        super()

        this.loading = true

        this.fetchEndpoint = 'files'
    }

    firstUpdated() {
        if (!this.fileId) {
            this.loading = false
        }
    }

    updated(changed) {
        if (changed.has('fileId')) this.fetchFile()
    }

    async fetchFile() {
        if (!this.fileId) return

        this.loading = true

        try {
            const model = await FileModel.fromRemote(this.fileId, {
                fetchEndpoint: this.fetchEndpoint,
            })

            const fileSrc = model.directLink('inline')

            await this.loadImage(fileSrc)

            this.fileSrc = fileSrc
        } catch (ex) {
            //
        }

        this.loading = false
    }

    loadImage(src) {
        const img = document.createElement('img')

        return new Promise((resolve) => {
            img.onload = () => {
                img.onload = null
                img.remove()
                resolve()
            }

            img.src = src
        })
    }

    render() {
        if (this.loading) {
            return html`
                <div part="loader">
                    <qrcg-loader></qrcg-loader>
                </div>
            `
        }

        if (!this.fileSrc && !this.loading) {
            return html`${unsafeStatic(this.constructor.PLACEHOLDER)}`
        }

        return html`<img src=${this.fileSrc ?? ''} />`
    }
}
window.defineCustomElement('qrcg-file-image', QrcgFileImage)
