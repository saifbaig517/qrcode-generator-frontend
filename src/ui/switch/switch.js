import { html } from 'lit'
import style from './switch.scss?inline'

import { BaseInput } from '../base-input'

export class Switch extends BaseInput {
    static tag = 'qrcg-switch'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            checkedValue: {
                attribute: 'checked-value',
            },

            uncheckedValue: {
                attribute: 'unchecked-value',
            },
        }
    }

    constructor() {
        super()

        this.checkedValue = null

        this.uncheckedValue = null
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onClick)
    }

    isChecked() {
        return this.hasAttribute('checked')
    }

    getCheckedValue() {
        if (this.checkedValue) {
            return this.checkedValue
        }

        return true
    }

    getUncheckedValue() {
        if (this.uncheckedValue) {
            return this.uncheckedValue
        }

        return false
    }

    syncValue() {
        if (this.value == this.getCheckedValue()) {
            this.setAttribute('checked', '')
        } else {
            this.removeAttribute('checked')
        }
    }

    setChecked(value) {
        if (value) {
            this.setAttribute('checked', '')
        } else {
            this.removeAttribute('checked')
        }

        if (value) {
            this.setValue(this.getCheckedValue())
        } else {
            this.setValue(this.getUncheckedValue())
        }

        this._fireOnInput()
    }

    toggleChecked() {
        this.setChecked(!this.isChecked())
    }

    onClick() {
        this.toggleChecked()
    }

    render() {
        return html` <div class="circle"></div> `
    }
}

Switch.register()
