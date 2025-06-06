import { html } from 'lit'

import { getScrollbarWidth, isEmpty, remToPx } from '../core/helpers'

import { QRCodePreviewUrlBuilder } from './qrcg-qrcode-preview-url-builder'

import '../ui/qrcg-color-picker'

import '../ui/qrcg-select'

import '../ui/qrcg-balloon-selector'

import '../ui/qrcg-file-input/index'

import '../ui/qrcg-range-input'

import '../ui/qrcg-logo-picker'

import '../ui/qrcg-img-selector'

import { t } from '../core/translate'

import '../common/qrcg-font-picker'

import '../ui/qrcg-gradient-input/qrcg-gradient-input'

import { QRCGDashboardLayout } from '../dashboard/qrcg-dashboard-layout'

import { QRCGDashboardHeader } from '../dashboard/qrcg-dashboard-header'

import '../common/qrcg-sticker-text-input'

import { CanvasTextRenderer } from '../common/canvas-text-renderer'
import { Base64TextRenderer } from './svg-processors/base64-text-renderer'

import { CustomStyleInjector } from '../core/custom-style-injector'
import { ConfigHelper } from '../core/config-helper'

import './qrcg-color-customization-disabled-message'

import { FillTypeFields } from './qrcg-qrcode-designer/fill-type-fields'
import { BackgroundFields } from './qrcg-qrcode-designer/background-fields'
import { ModuleFields } from './qrcg-qrcode-designer/module-fields'
import { OutlinedShapesFields } from './qrcg-qrcode-designer/outlined-shapes-fields'
import { LogoFields } from './qrcg-qrcode-designer/logo-fields'
import { AdvancedShapeFields } from './qrcg-qrcode-designer/advanced-shapes-fields'
import { AiFields } from './qrcg-qrcode-designer/ai-fields'
import { Droplet } from '../core/droplet'
import { DesignerToggler } from './qrcode-types/designer-toggler'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-qrcode-designer.scss?inline'

export class QRCGQRCodeDesigner extends BaseComponent {
    urlBuilder = new QRCodePreviewUrlBuilder(this)
    canvasTextRenderer = new CanvasTextRenderer()
    base64TextRenderer = new Base64TextRenderer(this)
    _customStyleInjector = new CustomStyleInjector(this)

    fillTypeFields = new FillTypeFields(this)
    backgroundFields = new BackgroundFields(this)
    moduleFields = new ModuleFields(this)
    outlinedShapesFields = new OutlinedShapesFields(this)
    logoFields = new LogoFields(this)
    advancedShapes = new AdvancedShapeFields(this)
    aiFields = new AiFields(this)

    droplet = new Droplet()

    static styleSheets = [...super.styleSheets, style]

    static validateShapeWith(fnValidator) {
        this.shapeValidator = fnValidator
    }

    static validateAdvancedShapeWith(fnValidator) {
        this.advancedShapeValidator = fnValidator
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this._onInput)

        this.updatePreview()

        window.addEventListener('scroll', this.onScroll)

        window.addEventListener('resize', this.onResize)

        window.scrollTo({ top: 0, behavior: 'auto' })

        document.addEventListener(
            'qrcg-qrcode-link:change',
            this.onQrCodeLinkChange
        )

        this.addEventListener('on-batch-input', this._onBatchInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this._onInput)

        window.removeEventListener('scroll', this.onScroll)
        window.removeEventListener('resize', this.onResize)

        document.removeEventListener(
            'qrcg-qrcode-link:change',
            this.onQrCodeLinkChange
        )

        this.removeEventListener('on-batch-input', this._onBatchInput)
    }

    static get properties() {
        return {
            previewUrl: { type: String },
            data: {},
            type: {},
            design: {},
            remoteRecord: {},
            stickTopRem: { attribute: 'stick-top-rem' },
            enableLargePreview: {
                type: Boolean,
                attribute: 'enable-large-preview',
            },
            mode: {},
        }
    }

    constructor() {
        super()

        this.stickTopRem = 5
    }

    onQrCodeLinkChange = () => {
        this.updatePreview()
    }

    getQrCodeData() {
        return this.data
    }

    getQrCodeType() {
        return this.type
    }

    getQrCodeColor() {
        return this.design.codeColor
    }

    getQrCodeDesign() {
        return this.design
    }

    getQrCodeRemoteRecord() {
        return this.remoteRecord
    }

    onResize = () => {
        this.adjustPreviewImage()
    }

    adjustPreviewImage() {
        const image = this.shadowRoot.querySelector('.preview-image')

        const media = matchMedia('(min-width: 70rem)')

        if (!this.previewImageRect) {
            this.previewImageRect = image.getBoundingClientRect()
        }

        const topMargin = remToPx(this.stickTopRem)

        const offsetTop = this.previewImageRect.top - topMargin

        if (
            window.scrollY > offsetTop &&
            media.matches &&
            this.scrollingInsideDesigner()
        ) {
            image.style.position = 'absolute'
            image.style.zIndex = '100000'
            image.style.transition = 'top ease .1s'

            image.style.top = `${
                window.scrollY - this.previewImageRect.top + topMargin
            }px`

            if (ConfigHelper.isRtl()) {
                image.style.left = '0px'
            } else {
                image.style.right = '0px'
            }

            image.style.backgroundColor = 'white'
            image.style.width = this.imageWidth + 'px'
        } else {
            image.style = ''
            this.imageWidth = image.clientWidth
        }

        if (!media.matches) {
            this.adjustPreviewImageOnMobile()
        }
    }

    adjustPreviewImageOnMobile() {
        const image = this.shadowRoot.querySelector('.preview-image')

        if (!this.previewImageRect) {
            this.previewImageRect = image.getBoundingClientRect()
        }

        const headerHeight = QRCGDashboardHeader.isRendered
            ? remToPx(
                  getComputedStyle(this)
                      .getPropertyValue('--dashboard-header-height')
                      .replace('rem', '')
              )
            : 0

        const offsetTop = this.previewImageRect.top - remToPx(1) - headerHeight

        if (
            window.scrollY > offsetTop &&
            this.scrollingInsideDesignerMobile()
        ) {
            image.style.position = 'fixed'

            image.style.zIndex = 100000

            image.style.paddingTop = '1rem'

            image.style.top = `${headerHeight}px`

            image.style.left = '2rem'

            if (!QRCGDashboardLayout.sidebarClosed) {
                image.style.left = '17rem'
            }

            image.style.right = '2rem'

            image.style.margin = ''

            image.style.width = 'initial'

            image.style.backgroundColor = 'white'

            this.setImagePlaceholderVisible(true)
        } else {
            this.setImagePlaceholderVisible(false)
        }
    }

    scrollbarWidth() {
        const scrollbarIsVisible =
            getComputedStyle(document.body, ':-webkit-scrollbar')?.display !==
            'none'

        if (scrollbarIsVisible) {
            return getScrollbarWidth()
        }

        return 0
    }

    scrollingInsideDesignerMobile() {
        const image = this.shadowRoot.querySelector('.preview-image')

        let imageHeight = image.getBoundingClientRect().height

        const isInside = this.getBoundingClientRect().bottom > imageHeight * 2

        return isInside
    }

    scrollingInsideDesigner() {
        const image = this.shadowRoot.querySelector('.preview-image')

        let imageHeight = image.getBoundingClientRect().height

        const isInside = this.getBoundingClientRect().bottom > imageHeight

        return isInside
    }

    setImagePlaceholderVisible(visible) {
        const image = this.shadowRoot.querySelector('.preview-image')

        if (!this.imagePlaceholder) {
            const style = getComputedStyle(image)

            this.imagePlaceholder = document.createElement('div')

            this.imagePlaceholder.style.height = style.height

            this.imagePlaceholder.style.margin = style.margin

            this.imagePlaceholder.style.padding = style.padding

            image.parentNode.insertBefore(this.imagePlaceholder, image)
        }

        if (visible) {
            this.imagePlaceholder.style.display = 'block'
        } else {
            this.imagePlaceholder.style.display = 'none'
        }
    }

    onScroll = () => {
        this.adjustPreviewImage()
    }

    updated() {
        this.renderRoot
            .querySelectorAll(`[name]`)
            .forEach((input) => (input.value = this.design[input.name]))
    }

    /**
     * Update all changed design fields at once.
     */

    _onBatchInput = (e) => {
        const newDesign = {
            ...this.design,
            ...e.detail.value,
        }

        this.updateDesignObject(newDesign)

        setTimeout(() => {
            this.updatePreview()
        }, 10)
    }

    _onInput = (e) => {
        if (
            !isEmpty(e.detail.name) &&
            e.detail.name !== 'qrcg-qrcode-designer'
        ) {
            const newDesign = {
                ...this.design,
                [e.detail.name]: e.detail.value,
            }

            this.updateDesignObject(newDesign)

            if (e.detail.name === 'advancedShape') {
                this.dispatchEvent(
                    new CustomEvent('advancedShapeChanged', {
                        detail: { originalEvent: e },
                    })
                )
            }
        }

        setTimeout(() => {
            this.updatePreview()
        }, 10)
    }

    updateDesignObject(newDesign) {
        this.canvasTextRenderer.render({
            text: newDesign.text,
            fontFamily: newDesign.fontFamily,
            fontVariant: newDesign.fontVariant,
            color: newDesign.textColor,
        })

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: 'qrcg-qrcode-designer',
                    value: newDesign,
                },
            })
        )
    }

    updatePreview() {
        const doUpdate = () => {
            if (this.urlBuilder.canBuildURL()) {
                this.previewUrl = this.urlBuilder.buildURL()
            } else {
                this.previewUrl = null
            }
        }

        if (this.previewIsRendered) {
            clearTimeout(this.previewUpdateHandle)

            this.previewUpdateHandle = setTimeout(doUpdate, 800)
        } else {
            this.previewIsRendered = true

            doUpdate()
        }
    }

    isAiDesign() {
        return this.design.is_ai
    }

    renderSizeWarning() {
        const hasLogo =
            (this.design.logoType === 'preset' && this.design.logoUrl) ||
            (this.design.logoType === 'custom' && this.remoteRecord?.logo)

        const sizeIsLarge =
            (this.design.logoScale > 0.3 && this.design.shape === 'none') ||
            (this.design.logoScale > 0.5 && this.design.shape !== 'none')

        const shouldWarn = hasLogo && sizeIsLarge

        return shouldWarn
            ? html` <div class="warning">
                  ${t`QR Code may not be scannable due to large logo size, test it before you proceed.`}
              </div>`
            : ''
    }

    renderShapeWraning() {
        const connectedModules = 'square,triangle-end,roundness'.split(',')

        const hasDisconnectedModule =
            connectedModules.indexOf(this.design.module) == -1

        const hasCustomFinder =
            this.design.finder != 'default' ||
            this.design.finderDot != 'default'

        const shouldWarn = hasDisconnectedModule && hasCustomFinder

        return shouldWarn
            ? html` <div class="warning">
                  ${t`QR Code may not be scannable due to complex shapes, test it before you proceed.`}
              </div>`
            : ''
    }

    getPreviewDblClickUrl() {
        const url = document.createElement('a')

        url.href = this.previewUrl

        const search = new URLSearchParams(url.search)

        search.delete('renderText')

        return `${url.href.split('?')[0]}?${search.toString()}`
    }

    renderTogglerIfNeeded() {
        if (!this.hasAttribute('show-designer-toggler')) {
            return
        }

        return html`
            <div class="designer-toggler-container">
                <div>${t`Preview`}</div>
                ${DesignerToggler.renderSelf()}
            </div>
        `
    }

    render() {
        return html`
            <div class="container">
                <qrcg-color-customization-disabled-message></qrcg-color-customization-disabled-message>

                <div class="row">
                    <div class="input-grid">
                        ${this.aiFields.render()}
                        ${this.fillTypeFields.render()}
                        ${this.backgroundFields.render()}
                        ${this.moduleFields.render()}
                        ${this.outlinedShapesFields.render()}
                        ${this.logoFields.render()}
                        ${this.advancedShapes.render()}
                    </div>

                    <div class="preview-image">
                        ${this.renderTogglerIfNeeded()}

                        <qrcg-qrcode-image
                            .url=${this.previewUrl}
                            ?preview-on-dbl-click=${this.enableLargePreview}
                            dbl-click-url=${this.getPreviewDblClickUrl()}
                            render-svg-tag
                        ></qrcg-qrcode-image>

                        ${this.renderSizeWarning()}

                        <!-- -->
                        ${this.renderShapeWraning()}

                        <!-- -->
                        ${this.aiFields.renderWidgetOpener()}

                        <slot name="below-preview-image"></slot>
                    </div>
                </div>
            </div>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-designer', QRCGQRCodeDesigner)
