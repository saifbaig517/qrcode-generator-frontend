import { LitElement, html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSearchableSelect } from './qrcg-searchable-select'

export class QrcgSearchableSelectSearch extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            qrcg-input::part(label) {
                display: none;
            }

            qrcg-input::part(input) {
                border: 0;
                padding-top: 1rem;
                margin-bottom: 0;
                padding-bottom: 0.5rem;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('keyup', this.onKeyUp)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('keyup', this.onKeyUp)
    }

    onKeyUp = (e) => {
        if (e.key === 'ArrowDown') {
            this.dispatchEvent(
                new CustomEvent(
                    QrcgSearchableSelect.EVENT_NAME_REQUEST_FOCUS_FIRST_ITEM,
                    {
                        bubbles: true,
                        composed: true,
                    }
                )
            )
        }
    }

    focus() {
        this.shadowRoot.querySelector('qrcg-input')?.focus()
    }

    onInput(e) {
        const value = e.detail.value

        e.preventDefault()

        e.stopImmediatePropagation()

        this.dispatchEvent(
            new CustomEvent(QrcgSearchableSelect.EVENT_NAME_ON_SEARCH, {
                bubbles: true,
                composed: true,
                detail: {
                    name: 'keyword',
                    value,
                },
            })
        )
    }

    render() {
        return html`
            <qrcg-input
                @on-input=${this.onInput}
                placeholder=${t`Search...`}
            ></qrcg-input>
        `
    }
}

window.defineCustomElement('qrcg-select-search', QrcgSearchableSelectSearch)
