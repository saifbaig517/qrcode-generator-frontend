import { LitElement, css } from 'lit'
import { isEmpty, sleep } from './helpers'

export class QrcgBodyResolver extends LitElement {
    static EVENT_DASHBOARD_BUNDLE_READY =
        'qrcg-body-resolver::dashboard-bundle-ready'

    static #waitFor = []

    static waitUntil(promise) {
        this.#waitFor.push(promise)
    }

    static styles = [
        css`
            :host {
                display: none;
            }
        `,
    ]

    static unresolve() {
        document.body.classList.remove('resolved')
    }

    static async boot() {
        await sleep(0)

        while (!document.body) {
            await sleep(10)
        }

        if (isEmpty(this.#waitFor)) {
            await Promise.all(this.#waitFor)
        }

        const elem = document.createElement('qrcg-body-resolver')

        document.body.appendChild(elem)
    }

    connectedCallback() {
        super.connectedCallback()

        document.body.classList.add('resolved')

        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent(QrcgBodyResolver.EVENT_DASHBOARD_BUNDLE_READY)
            )
        })

        this.remove()
    }
}

window.defineCustomElement('qrcg-body-resolver', QrcgBodyResolver)

QrcgBodyResolver.boot()
