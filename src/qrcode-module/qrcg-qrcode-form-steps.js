import { LitElement, html } from 'lit'
import { observeState } from 'lit-element-state'
import { classMap } from 'lit/directives/class-map.js'
import { state } from './state'
import { DirectionAwareController } from '../core/direction-aware-controller'

import style from './qrcg-qrcode-form-steps.scss?inline'

class QRCGQRCodeFormSteps extends observeState(LitElement) {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static get properties() {
        return {
            steps: {
                type: Array,
            },

            currentStep: {},
        }
    }

    constructor() {
        super()

        this.steps = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.injectStyles()
    }

    injectStyles() {
        const tag = document.createElement('style')

        tag.innerHTML = style

        this.shadowRoot.appendChild(tag)
    }

    _onStepClick(e) {
        const step = e.currentTarget.getAttribute('step')

        this.dispatchEvent(
            new CustomEvent('request-step-change', {
                detail: { step },
            })
        )
    }

    _isStepPassed(step) {
        if (typeof step === 'string') {
            step = this.steps.find((s) => s.value === step)
        }

        const currentStep = this.steps.find(
            (step) => step.value === this.currentStep
        )

        return this.steps.indexOf(step) < this.steps.indexOf(currentStep)
    }

    getCurrentStepIndex() {
        const currentStep = this.steps.find(
            (step) => step.value === this.currentStep
        )

        return this.steps.indexOf(currentStep)
    }

    isStepDisabled(step) {
        if (state.remoteRecord?.id) {
            return false
        }
        return !this._isStepPassed(step)
    }

    get currentStepName() {
        try {
            return this.steps.find((s) => s.value === this.currentStep).name
        } catch {
            console.log(
                'Cannot get current step of slug ' + this.currentStep,
                this.steps
            )
            return null
        }
    }

    render() {
        return html`
            <div class="steps">
                ${this.steps.map(
                    (step, i) => html`
                        <div
                            class="step ${classMap({
                                'not-current': step.value !== this.currentStep,
                                current: step.value === this.currentStep,
                                passed: this.getCurrentStepIndex() > i,
                            })}"
                            step=${step.value}
                            @click=${this._onStepClick}
                            ?disabled=${this.isStepDisabled(step)}
                        >
                            <span class="number">${i + 1}</span>
                            <span class="text"> ${step.name} </span>
                        </div>
                    `
                )}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-form-steps', QRCGQRCodeFormSteps)
