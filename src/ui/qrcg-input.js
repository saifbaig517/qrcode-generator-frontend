import { html } from 'lit'
import { BaseInput } from './base-input'

import { CustomStyleInjector } from '../core/custom-style-injector'
import { mdiEye, mdiEyeOff } from '@mdi/js'

import style from './qrcg-input.scss?inline'
import { isNotEmpty, mapEventDelegate, parentMatches } from '../core/helpers'
import { FormInputController } from '../common/form-input-controller'

class QRCGInput extends BaseInput {
    formInputController = new FormInputController(
        this,
        FormInputController.MODE_PLAIN
    )

    customStyleInjector = new CustomStyleInjector(this)

    static tag = 'qrcg-input'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            prefix: {
                reflect: true,
            },
            focused: {
                reflect: true,
                type: Boolean,
            },
            min: {},
            max: {},
            step: {},
        }
    }

    renderPrefix() {
        if (!this.input) return

        if (this.prefix)
            return html`
                <span class="prefix" style=${`top: ${this.input?.offsetTop}px`}>
                    ${this.prefix}
                </span>
            `
    }

    firstUpdated() {
        super.firstUpdated()

        this.bindFocus()

        this.requestUpdate()

        this.bindElegantInputClass()
    }

    bindElegantInputClass() {
        if (parentMatches(this, '.elegant-input')) {
            this.classList.add('elegant')
        }
    }

    updated(changed) {
        this.bindInputNodeAttributes(changed)

        if (isNotEmpty(this.value)) {
            this.classList.add('has-value')
        } else {
            this.classList.remove('has-value')
        }
    }

    bindInputNodeAttributes(changed) {
        if (!this.input) return

        const boundAttributes = ['min', 'max', 'step']

        boundAttributes.forEach((prop) => {
            if (changed.has(prop)) {
                this.input.setAttribute(prop, this[prop])
            }
        })
    }

    bindFocus() {
        this.input.addEventListener('focus', this.onFocus)
        this.input.addEventListener('blur', this.onBlur)
    }

    detachFocus() {
        this.input?.removeEventListener('focus', this.onFocus)
        this.input?.removeEventListener('blur', this.onBlur)
    }

    onBlur = () => {
        this.focused = false
    }

    onFocus = () => {
        this.focused = true
    }

    onBaseInputClick(e) {
        super.onBaseInputClick(e)

        mapEventDelegate(e, {
            '.password-toggle': this.onPasswordToggleClick,
        })
    }

    setInputType(type) {
        this.$('input').type = type
    }

    /**
     *
     * @param {Event} e
     * @param {HTMLElement} elem
     */
    onPasswordToggleClick = (e, elem) => {
        elem.classList.toggle('show')

        if (elem.classList.contains('show')) {
            this.setInputType('password')
        } else {
            this.setInputType('text')
        }
    }

    get input() {
        return this.shadowRoot.querySelector('input')
    }

    async focus() {
        await this.updateComplete
        this.input.focus()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.detachFocus()
    }

    renderPasswordToggle() {
        if (this.type != 'password') return

        return html`
            <div class="password-toggle show">
                <qrcg-icon mdi-icon=${mdiEye} class="show"></qrcg-icon>
                <qrcg-icon mdi-icon=${mdiEyeOff} class="hide"></qrcg-icon>
            </div>
        `
    }

    render() {
        return [
            super.render(),
            this.renderPrefix(),
            this.renderPasswordToggle(),
        ]
    }
}

QRCGInput.register()
