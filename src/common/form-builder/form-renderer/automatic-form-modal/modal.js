import { html } from 'lit'
import { CustomFormRendererModal } from '../form-renderer-modal'
import style from './modal.scss?inline'
import { t } from '../../../../core/translate'
import { isEmpty } from '../../../../core/helpers'

export class AutomaticFormModal extends CustomFormRendererModal {
    static tag = 'qrcg-automatic-form-modal'

    static styleSheets = [...super.styleSheets, style]

    /**
     * @type {HTMLElement}
     */
    target = null

    firstUpdated() {
        super.firstUpdated()

        this.bindTargetPosition()
    }

    getAffirmativeText() {
        return html`
            ${this.renderSendIcon()}
            <!--  -->
            ${super.getAffirmativeText()}
            <!--  -->
        `
    }

    bindTargetPosition() {
        const { width } = this.target.getBoundingClientRect()

        this.style.setProperty('--target-width', width + 'px')
    }

    renderCloseIcon() {
        return html``
    }

    renderSendIcon() {
        return html`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    fill="currentColor"
                    d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                ></path>
            </svg>
        `
    }

    renderImage() {
        if (isEmpty(this.header_image)) return

        return html`
            <div class="header-image-container">
                <img src=${this.header_image} class="header-image" />
                <div class="icon">${this.renderSendIcon()}</div>
            </div>
        `
    }

    renderActions() {
        return html`
            <!--  -->
            ${this.renderAffirmativeAction()}

            <div class="no-sell">${t`We don't sell your contact details`}</div>
        `
    }

    renderModalToolbar() {
        return html`
            <header>
                <div class="close">${t('Skip')}</div>

                <!--  -->

                <div class="title-container">
                    ${this.renderImage()}
                    <!--  -->
                    <div class="text">${this.renderTitle()}</div>
                </div>
            </header>
        `
    }

    renderNegativeAction() {}
}

AutomaticFormModal.register()

window.AutomaticFormModal = AutomaticFormModal
