import { html } from 'lit'

import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-form-section.scss?inline'

import { mdiUnfoldMoreHorizontal } from '@mdi/js'
import { sleep } from '../core/helpers'

export class QrcgFormSection extends BaseComponent {
    static tag = 'qrcg-form-section'

    static styleSheets = [...super.styleSheets, style]

    static EVENT_REQUEST_SET_EXPANDED =
        'qrcg-form-section::request-set-expanded'

    static EVENT_REQUEST_HEIGHT_RECALCULATE =
        'qrcg-form-section::request-height-recalculate'

    static get properties() {
        return {
            ...super.properties,

            expanded: {
                type: Boolean,
                reflect: true,
            },

            nonExpandable: {
                type: Boolean,
                reflect: true,
                attribute: 'non-expandable',
            },
        }
    }

    static recalculateHeights() {
        document.dispatchEvent(
            new CustomEvent(this.EVENT_REQUEST_HEIGHT_RECALCULATE)
        )
    }

    constructor() {
        super()

        this.expanded = true
        this.isExpandReady = false
        this.nonExpandable = false

        this.minimized = false
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            QrcgFormSection.EVENT_REQUEST_SET_EXPANDED,
            this.onSetExpandedRequested
        )

        document.addEventListener(
            QrcgFormSection.EVENT_REQUEST_HEIGHT_RECALCULATE,
            this.onHeightRecalculateRequested
        )

        this.addEventListener('on-input', this.onChildInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            QrcgFormSection.EVENT_REQUEST_SET_EXPANDED,
            this.onSetExpandedRequested
        )

        document.removeEventListener(
            QrcgFormSection.EVENT_REQUEST_HEIGHT_RECALCULATE,
            this.onHeightRecalculateRequested
        )

        this.removeEventListener('on-input', this.onChildInput)
    }

    firstUpdated() {
        setTimeout(() => {
            this.calculateCssVariables()
        }, 100)

        setTimeout(() => {
            this.calculateCssVariables()
        }, 500)

        setTimeout(() => {
            this.calculateCssVariables()
            this.isExpandReady = true

            setInterval(() => {
                this.calculateCssVariables()
            }, 1000)
        }, 2000)
    }

    onHeightRecalculateRequested = () => {
        this.recalculateHeight()
    }

    async setExpanded(value) {
        if (!this.isExpandReady) {
            return
        }

        this.classList.add('animating')

        this.expanded = value

        await this.waitForTransition(this)

        this.classList.remove('animating')
    }

    onSetExpandedRequested = (e) => {
        this.setExpanded(e.detail.expanded)
    }

    onChildInput = async () => {
        this.recalculateHeight()
    }

    recalculateHeight = async () => {
        await sleep(0)

        this.resetCssVariables()

        await sleep(0)

        this.calculateCssVariables()
    }

    resetCssVariables() {
        this.style = ''
    }

    calculateCssVariables() {
        if (this.nonExpandable) return

        if (!this.expanded) return

        this.style = ''

        const title = this.querySelector('.section-title')

        const { height } = title.getBoundingClientRect()

        this.style.setProperty('--title-height', `${height}px`)

        const { height: thisHeight } = this.getBoundingClientRect()

        this.style.setProperty('--actual-height', `${thisHeight}px`)
    }

    onExpandToggleClick() {
        this.setExpanded(!this.expanded)
    }

    renderExpandIcon() {
        if (this.nonExpandable) return

        return html`
            <qrcg-icon
                mdi-icon=${mdiUnfoldMoreHorizontal}
                @click=${this.onExpandToggleClick}
            ></qrcg-icon>
        `
    }

    render() {
        return [this.renderExpandIcon(), html` <slot></slot> `]
    }
}

QrcgFormSection.register()
