import { html } from 'lit'

import './qrcg-box'

import './qrcg-icon'

import { mdiCloseCircle } from '@mdi/js'

import { parentMatches } from '../core/helpers'

import { t } from '../core/translate'

import { DirectionAwareController } from '../core/direction-aware-controller'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-modal.scss?inline'

export class QrcgModal extends BaseComponent {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            title: {},
            modalRootId: {},
            closing: { type: Boolean, reflect: true },
            opened: { type: Boolean, reflect: true },
            dismissable: { type: Boolean },
        }
    }

    static open(data = {}) {
        const modal = new this()

        document.body.appendChild(modal)

        for (const key of Object.keys(data)) {
            modal[key] = data[key]
        }

        return modal.open()
    }

    constructor() {
        super()

        this.close = this.close.bind(this)
        this.onAnimationEnd = this.onAnimationEnd.bind(this)
        this.onNeutralClose = this.onNeutralClose.bind(this)

        this.onKeyup = this.onKeyup.bind(this)
        this.onModalClick = this.onModalClick.bind(this)

        this.dismissable = false
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener('keyup', this.onKeyup)

        this.addEventListener('click', this.onModalClick)

        this.addEventListener('animationend', this.onAnimationEnd)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener('keyup', this.onKeyup)

        this.removeEventListener('click', this.onModalClick)

        this.removeEventListener('animationend', this.onAnimationEnd)
    }

    initPromise() {
        this.openPromise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })

        return this.openPromise
    }

    async open() {
        this.opened = true

        return this.initPromise()
    }

    /**
     * Close the modal when overlay is clicked
     */
    onOverlayClick() {
        if (this.dismissable) this.onNeutralClose()
    }

    close() {
        this.closing = true
    }

    onAnimationEnd() {
        if (this.closing) {
            this.opened = false

            this.closing = false

            this.remove()
        }
    }

    onKeyup(e) {
        if (e.key === 'Escape') {
            this.close()
        }
    }

    onModalClick(e) {
        let node = e.composedPath()[0]

        if (parentMatches(node, '[modal-affirmative')) {
            this.onAffirmativeClick()
        }

        if (parentMatches(node, '[modal-negative]')) {
            this.onNegativeClick()
        }

        if (parentMatches(node, '.close')) {
            this.onNeutralClose()
        }

        if (parentMatches(node, '.overlay')) {
            this.onOverlayClick()
        }
    }

    onNeutralClose() {
        this.reject()

        this.close()
    }

    affiramtivePromise() {}

    async onAffirmativeClick() {
        try {
            this.setLoading(true)

            await this.affiramtivePromise()

            this.resolve(this.resolvedData())

            this.close()
        } catch {
            //
        }

        this.setLoading(false)
    }

    resolvedData() {}

    setLoading(loading) {
        this.getLoadableElements().forEach((e) => (e.loading = loading))

        this.getElementsToDisableWhenLoading().forEach(
            (e) => (e.disabled = loading)
        )
    }

    getLoadableElements() {
        return Array.from(
            this.shadowRoot.querySelectorAll('qrcg-button[modal-affirmative]')
        )
    }

    getElementsToDisableWhenLoading() {
        return Array.from(
            this.shadowRoot.querySelectorAll(
                'qrcg-button[modal-negative], qrcg-input, qrcg-textarea, qrcg-balloon-selector'
            )
        )
    }

    onNegativeClick() {
        this.reject()

        this.close()
    }

    getAffirmativeText() {
        return t`OK`
    }

    getNegativeText() {
        return t`Cancel`
    }

    renderNegativeAction() {
        return html`
            <qrcg-button transparent modal-negative>
                ${this.getNegativeText()}
            </qrcg-button>
        `
    }

    renderActions() {
        return html`
            ${this.renderNegativeAction()}
            <!--  -->
            ${this.renderAffirmativeAction()}
        `
    }

    renderAffirmativeAction() {
        if (!this.getAffirmativeText()) return

        return html`
            <qrcg-button modal-affirmative>
                ${this.getAffirmativeText()}
            </qrcg-button>
        `
    }

    renderTitle() {}

    renderBody() {}

    renderInstructions() {}

    renderBodyLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    mRenderInstructions() {
        if (!this.renderInstructions()) return

        return html`
            <div class="instructions">${this.renderInstructions()}</div>
        `
    }

    bodyClasses() {
        if (this.shouldRestrictBodyHeight()) {
            return 'restrict-height'
        }
    }

    shouldRestrictBodyHeight() {
        return false
    }

    renderModalActions() {
        return html` <div class="actions">${this.renderActions()}</div> `
    }

    getCloseIcon() {
        return mdiCloseCircle
    }

    renderCloseIcon() {
        return html`
            <qrcg-icon
                mdi-icon=${this.getCloseIcon()}
                class="close"
            ></qrcg-icon>
        `
    }

    renderModalToolbar() {
        return html`
            <div class="toolbar">
                <h3>${this.renderTitle()}</h3>
                ${this.renderCloseIcon()}
            </div>
        `
    }

    render() {
        return html`
            <div class="overlay"></div>

            <div class="container">
                ${this.renderModalToolbar()}

                <div class="body ${this.bodyClasses()}">
                    ${this.mRenderInstructions()}
                    <!-- -->
                    ${this.renderBody()}
                </div>

                ${this.renderModalActions()}
            </div>
        `
    }
}
