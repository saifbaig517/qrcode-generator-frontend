import { LitElement, html, css } from 'lit'

import { QrcgSearchableSelect } from './qrcg-searchable-select'

export class QrcgSearchableSelectItem extends LitElement {
    static styles = [
        css`
            :host {
                font-size: 0.8rem;
                display: flex;
                flex-direction: column;
                padding: 0.5rem;
                border-bottom: 1px solid var(--gray-1);
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
            }

            :host(.selected) {
                font-weight: bold;
                background-color: var(--gray-0);
            }

            :host(:hover),
            :host(:focus) {
                background-color: var(--gray-1);
                outline: 0;
            }

            .main-row {
                position: relative;
                display: flex;
                justify-content: space-between;
            }

            .id {
                color: var(--gray-2);
            }

            .attribute {
                font-size: 0.8rem;
                display: flex;
                margin-top: 0.5rem;
                color: var(--gray-2);
            }

            .attribute .value {
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .name {
                max-width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `,
    ]

    static get properties() {
        return {
            item: {},
            renderItemId: {
                type: Boolean,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)

        this.addEventListener('keyup', this.onKeyUp)

        this.setAttribute('tabindex', '0')
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onClick)

        this.removeEventListener('keyup', this.onKeyUp)
    }

    onKeyUp(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.stopImmediatePropagation()
            this.fireOptionClickedEvent()
        }
    }

    onClick() {
        this.fireOptionClickedEvent()
    }

    fireOptionClickedEvent() {
        this.dispatchEvent(
            new CustomEvent(QrcgSearchableSelect.EVENT_NAME_OPTION_CLICKED, {
                detail: { item: this.item },
                composed: true,
                bubbles: true,
            })
        )
    }

    renderName() {
        return html`<div class="name">${this.item.name}</div>`
    }

    renderId() {
        if (!this.item.id) return

        if (!this.renderItemId) return

        return html`<div class="id">${this.item.id}</div>`
    }

    renderAttributes() {
        const ignoredKeys = ['name', 'id']

        let keys = Object.keys(this.item).filter(
            (k) => ignoredKeys.indexOf(k) === -1
        )

        return html`
            <div class="attributes">
                ${keys.map((key) => {
                    return html`
                        <div class="attribute">
                            <div class="value">${this.item[key]}</div>
                        </div>
                    `
                })}
            </div>
        `
    }

    render() {
        return html`
            <div class="main-row">
                ${this.renderName()}
                <!-- -->
                ${this.renderId()}
            </div>

            ${this.renderAttributes()}
        `
    }
}

window.defineCustomElement('qrcg-select-item', QrcgSearchableSelectItem)
