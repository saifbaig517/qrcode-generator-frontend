import { LitElement, html, css } from 'lit'

class QRCGForm extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                box-sizing: border-box;
            }
        `
    }

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('keypress', this._onKeypress)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('keypress', this._onKeypress)
    }

    _onKeypress = (e) => {
        if (e.composedPath()[0].tagName === 'TEXTAREA') return

        if (e.key === 'Enter') {
            this.submit()
        }
    }

    submit() {
        this.renderRoot.querySelector('form').dispatchEvent(
            new Event('submit', {
                cancelable: true,
            })
        )
    }

    _onSubmit(e) {
        e.preventDefault()

        this.dispatchEvent(
            new CustomEvent('on-submit', {
                bubbles: true,
                composed: true,
            })
        )
    }

    render() {
        return html`
            <form part="form" @submit=${this._onSubmit}>
                <slot></slot>
            </form>
        `
    }
}

window.defineCustomElement('qrcg-form', QRCGForm)
