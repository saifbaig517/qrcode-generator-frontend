import { html, render } from 'lit'
import style from './dropdown.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { isFunction, remToPx } from '../../core/helpers'

export class QrcgDropdown extends BaseComponent {
    static tag = 'qrcg-dropdown'

    static styleSheets = [...super.styleSheets, style]

    /**
     * @type {HTMLElement}
     */
    target = null

    dropDownContent = null

    constructor() {
        super()
    }

    static get properties() {
        return {
            ...super.properties,
        }
    }

    static withTarget(target) {
        const instance = new this()

        instance.target = target

        return instance
    }

    withContent(content) {
        if (isFunction(content)) {
            content = content()
        }

        this.dropDownContent = content

        return this
    }

    async open() {
        document.body.appendChild(this)

        await this.updateComplete

        render(this.dropDownContent, this.$('.content'))

        this.syncTarget()

        return this
    }

    syncTarget() {
        const box = this.target.getBoundingClientRect()

        const top = box.bottom + remToPx(1)

        this.setCssVar('--top', top + 'px')

        this.setCssVar('--left', box.left + 'px')

        const width = remToPx(15)

        this.setCssVar('--width', width + 'px')
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
        this.remove()
    }

    setCssVar(name, value) {
        const style = document.createElement('style')

        style.classList.add('css-var')

        style.innerHTML = `:host { ${name}: ${value}; }`

        this.shadowRoot.appendChild(style)
    }

    render() {
        return html`
            <div class="container">
                <div class="content"></div>
            </div>
        `
    }
}

QrcgDropdown.register()
