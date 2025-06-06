import { LitElement, html } from 'lit'

class SelectorHost extends LitElement {
    static get properties() {
        return {
            selectedItem: {
                attribute: 'selected-item',
            },
        }
    }

    willUpdate() {
        this._updateSelection()
    }

    _updateSelection() {
        const slot = this.renderRoot.querySelector('slot')

        const selectors = slot
            ?.assignedElements({ flatten: true })
            ?.filter((el) => el.matches('qrcg-selector'))

        selectors?.forEach((item) => {
            item.selected = item.name === this.selectedItem
        })
    }

    connectedCallback() {
        super.connectedCallback()

        setTimeout(() => {
            this._updateSelection()
        }, 0)
    }

    render() {
        return html`<slot></slot>`
    }
}

window.defineCustomElement('qrcg-selector-host', SelectorHost)
