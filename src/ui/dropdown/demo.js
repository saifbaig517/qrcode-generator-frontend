import { html } from 'lit'
import style from './demo.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import './dropdown'
import { QrcgDropdown } from './dropdown'
import { range } from '../../core/helpers'

export class QrcgDropdownDemo extends BaseComponent {
    static tag = 'qrcg-dropdown-demo'

    static styleSheets = [...super.styleSheets, style]

    open() {
        QrcgDropdown.withTarget(this.$('qrcg-button'))
            .withContent(this.renderDropdownContent)
            .open()
    }

    onItemClick = () => {
        alert('item is clicked')
    }

    renderDropdownContent = () => {
        return range(0, 10).map((i) => {
            return html`
                <div class="item" @click=${this.onItemClick}>Item ${i}</div>
            `
        })
    }

    render() {
        return html`<qrcg-button @click=${this.open}>Open</qrcg-button>`
    }
}

QrcgDropdownDemo.register()
