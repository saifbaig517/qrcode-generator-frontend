import { LitElement } from 'lit'

import { html } from 'lit/static-html.js'

import '../core/qrcg-protected-route'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-qrcode-type-selector'

import { state, defaultState } from './state'

import { observeState } from 'lit-element-state'

import '../ui/qrcg-button'

import './qrcg-qrcode-form-steps'

import './qrcg-qrcode-designer'

import './qrcg-download-qrcode'

import {
    capitalize,
    equals,
    isEmpty,
    isFunction,
    only,
    titleCase,
} from '../core/helpers'

import { push } from '../core/qrcg-router'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import { QRCGRouteParamsController } from '../core/qrcg-route-params-controller'

import { QrcgDashboardBreadcrumbs } from '../dashboard/qrcg-dashboard-breadcrumbs'

import { t } from '../core/translate'

import { confirm } from '../ui/qrcg-confirmation-modal'

import { showToast } from '../ui/qrcg-toast'

import '../qrcode-link/qrcg-qrcode-link'
import { QRCodeTypeManager } from './qrcode-types/manager'

import './qrcg-qrcode-stats-link'
import { Config } from '../core/qrcg-config'
import { FolderModel } from '../models/folder'
import { BillingMode } from '../subscription-plan-module/billing-mode'
import { AccountCreditManager } from '../subscription-plan-module/account-credit-manager'
import { Droplet } from '../core/droplet'
import { QrcgQrCodeTemplateModal } from '../qrcode-templates/qrcg-qrcode-template-modal'
import { StepsManager } from './qrcg-steps-manager'
import { QrcgChangeQrCodeTypeModal } from './qrcg-change-qrcode-type-modal'
import { PluginManager } from '../../plugins/plugin-manager'
import {
    FILTER_QRCODE_FORM_CHANGE_TYPE_BUTTON,
    FILTER_QRCODE_FORM_SHOULD_RENDER_SAVE_AS_TEMPLATE_BUTTON,
} from '../../plugins/plugin-filters'

import style from './qrcg-qrcode-form.scss?inline'
import {
    mdiArrowLeft,
    mdiArrowRight,
    mdiCog,
    mdiDownload,
    mdiDrawing,
    mdiFileEdit,
} from '@mdi/js'
import { UseTemplateModal } from '../qrcode-templates/use-template-modal/use-template-modal'
import { permitted } from '../core/auth'

class QRCGQRCodeForm extends observeState(LitElement) {
    static EVENT_REQUEST_REFRESH = 'qrcg-qrcode-form:request-refresh'

    api = new QRCGApiConsumer(this, 'qrcodes', 'qrcg-button')

    titleController = new QRCGTitleController(this)

    routeParams = new QRCGRouteParamsController(this)

    billing = new BillingMode()

    accountCredit = new AccountCreditManager()

    droplet = new Droplet()

    stepsManager = new StepsManager()

    static get properties() {
        return {
            steps: { type: Array },
            loaders: { state: true },
        }
    }

    constructor() {
        super()

        this.updatePageTitle = this.updatePageTitle.bind(this)

        this.save = this.save.bind(this)

        this.steps = this.stepsManager.getSteps()
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('before-step-change', this._onBeforeStepChange)

        this.addEventListener('after-step-change', this._onAfterStepChange)

        this.addEventListener('api:success', this._onApiSuccess)

        this.addEventListener('api:before-request', this._onBeforeRequest)

        this.addEventListener('api:after-request', this._onAfterRequest)

        this.addEventListener('qrcg-download-qrcode:name-change', this.save)

        this.addEventListener('on-input', this.onInput)

        this.addEventListener(
            'qrcg-img-selector:disabled-option-click',
            this.onImgSelectorDisabledOptionClick
        )

        this.addEventListener('qrcg-qrcode-link:change', this.refresh)

        document.addEventListener(
            QRCGQRCodeForm.EVENT_REQUEST_REFRESH,
            this.onRefreshRequested
        )

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        document.addEventListener(
            'qrcg-qrcode-form:request-save',
            this.onSaveRequested
        )

        window.addEventListener('scroll', this.onWindowScroll)

        const id = this.routeParams.get('id')

        this.fetch(id)

        this.updatePageTitle()

        this.resetState()

        this.updateBreadcrumbs()

        this.resetSteps()

        this.injectStyles()
    }

    disconnectedCallback() {
        this.removeEventListener('before-step-change', this._onBeforeStepChange)

        this.removeEventListener('after-step-change', this._onAfterStepChange)

        this.removeEventListener('api:success', this._onApiSuccess)

        this.removeEventListener('api:before-request', this._onBeforeRequest)

        this.removeEventListener('api:after-request', this._onAfterRequest)

        this.removeEventListener('qrcg-download-qrcode:name-change', this.save)

        this.removeEventListener('on-input', this.onInput)

        this.removeEventListener('qrcg-qrcode-link:change', this.refresh)

        document.removeEventListener(
            'qrcg-qrcode-form:request-save',
            this.onSaveRequested
        )

        document.removeEventListener(
            QRCGQRCodeForm.EVENT_REQUEST_REFRESH,
            this.onRefreshRequested
        )

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        window.removeEventListener('scroll', this.onWindowScroll)

        this.removeEventListener(
            'qrcg-img-selector:disabled-option-click',
            this.onImgSelectorDisabledOptionClick
        )
    }

    injectStyles() {
        const tag = document.createElement('style')

        tag.innerHTML = style

        this.shadowRoot.appendChild(tag)
    }

    onImgSelectorDisabledOptionClick(e) {
        if (e.detail.name === 'shape' || e.detail.name === 'advancedShape') {
            confirm({
                title: 'Upgrade Required',
                message: t`You need to upgrade your subscription to use this feature.`,
                affirmativeText: t`OK`,
                negativeText: null,
            })
        }
    }

    onLocationChanged = () => {
        this.updatePageTitle()
        this.updateBreadcrumbs()
    }

    onWindowScroll = () => {
        const navigator = this.shadowRoot.querySelector(
            '.step-navigator.bottom'
        )

        if (window.scrollY > 80) {
            navigator.classList.add('visible')
        } else {
            navigator.classList.remove('visible')
        }
    }

    async resetSteps() {
        this.steps = this.stepsManager.getSteps()

        state.currentStep = this.stepsManager.getFirstStepSlug()
    }

    async syncFormData() {
        await this.updateComplete

        if (this.form()) this.form().data = state.data
    }

    onInput = async (e) => {
        const element = e.composedPath()[0]

        if (element.tagName === 'QRCG-FILE-INPUT' && element._name) {
            // Actually we just need to get the related file model,
            // So cache local record, reload and then re apply cached local record.

            const localRecord = {
                ...this.localRecord,
            }

            await this.fetch(state.id)

            this.localRecord = localRecord
        }

        if (e.detail.name === 'qrcg-qrcode-designer') {
            state.design = e.detail.value
        }
    }

    async onUseTemplateClick() {
        UseTemplateModal.open({
            qrcode: this.localRecord,
        })
    }

    updateBreadcrumbs() {
        const pathLinks =
            QrcgDashboardBreadcrumbs.buildBreadcrumbFromCurrentPath((part) => {
                if (part.match(/qrcodes/)) return 'QR Codes'

                return titleCase(part)
            })

        if (pathLinks.length === 0) return

        if (pathLinks[pathLinks.length - 1].href.match(/\d+/)) {
            pathLinks.splice(pathLinks.length - 1)
        }

        const lastLink = pathLinks[pathLinks.length - 1]

        pathLinks[pathLinks.length - 1] = {
            ...lastLink,
            text: this.titleController.pageTitle,
        }

        QrcgDashboardBreadcrumbs.setLinks(pathLinks)
    }

    async fetch(id) {
        if (!id) return

        const recordId = id ? id : state.id

        if (!isEmpty(recordId)) await this.api.get(recordId)
    }

    onRefreshRequested = () => {
        this.refresh()
    }

    refresh() {
        this.fetch(this.localRecord.id)
    }

    isNewQRCode() {
        return window.location.pathname.match(/new/)
    }

    resetState() {
        if (!this.isNewQRCode()) return

        Object.keys(defaultState).forEach((key) => {
            state[key] = defaultState[key]
        })
    }

    updatePageTitle() {
        if (window.location.pathname.match('edit')) {
            this.titleController.pageTitle = t('Edit QR Code')
        } else {
            this.titleController.pageTitle = t('Create QR Code')
        }
    }

    get loading() {
        return this.loaders > 0
    }

    set loading(loading) {
        this.loaders = loading ? this.loaders - 1 : this.loaders + 1
    }

    get localRecord() {
        return {
            id: state.id,
            data: state.data,
            type: state.type,
            design: state.design,
            name: state.name,
        }
    }

    set localRecord(record) {
        state.id = record.id
        state.data = record.data
        state.type = record.type
        state.name = record.name

        if (!isEmpty(record.design)) state.design = record.design
    }

    _onBeforeRequest = () => {
        state.loading = true
    }

    _onAfterRequest = () => {
        state.loading = true
    }

    async _onTypeSelected(e) {
        try {
            await this.validateCanCreateQRCodeWhenAccountCreditIsEnabled(
                e.detail.type
            )
        } catch {
            return
        }

        state.type = e.detail.type

        this.changeCurrentStep('data')
    }

    async validateCanCreateQRCodeWhenAccountCreditIsEnabled(type) {
        if (!state.id && this.billing.isAccountCredit()) {
            try {
                await this.accountCredit.canCreateQRCode(type)
            } catch {
                this.accountCredit.showAddToCartModal(type)

                throw new Error('cannot create QR code')
            }
        }
    }

    _onStepChangeRequested = (e) => {
        this.changeCurrentStep(e.detail.step)
    }

    _onBeforeStepChange = async (e) => {
        if (e.detail.currentStep === 'data') {
            state.data = this.form().data
        }

        if (e.detail.currentStep !== 'type') {
            this.beforeStepChangePromise = this.save()
        }
    }

    _onAfterStepChange = async () => {
        await new Promise((resolve) => setTimeout(resolve, 0))

        this.refreshAccountBalance()

        this.syncFormData()
    }

    onHeaderToggleClick() {
        this.headerIsVisible = !this.headerIsVisible
        this.requestUpdate()
    }

    refreshAccountBalance() {
        document.dispatchEvent(
            new CustomEvent('account-balance:request-refresh')
        )
    }

    _onApiSuccess = async (e) => {
        const localId = this.localRecord.id

        this.localRecord = e.detail.response

        state.remoteRecord = e.detail.response

        const redirect = `/dashboard/qrcodes/edit/${this.localRecord.id}`

        if (isEmpty(localId) && window.location.pathname !== redirect) {
            push(redirect)
        }

        await this.updateComplete

        this.syncFormData()
    }

    onSaveRequested = () => {
        this.save()
    }

    async save() {
        await this.api.save({
            id: state.id,
            data: state.data,
            type: state.type,
            design: state.design,
            name: state.name,
        })

        FolderModel.fireOnChange()

        document.dispatchEvent(
            new CustomEvent('qrcg-qrcode-form:save-completed')
        )
    }

    /** @deprecated */
    shouldSave() {
        const remoteRecord = only(
            this.api.record,
            Object.keys(this.localRecord)
        )

        if (equals(remoteRecord, this.localRecord)) return false

        if (isEmpty(this.localRecord.data)) {
            return false
        }

        return true
    }

    clearValidationErrors() {
        this.form()?.dispatchEvent(
            new CustomEvent('validation-errors', {
                detail: {
                    errors: {},
                },
            })
        )
    }

    handleValidationErrors(errors) {
        this.form()?.dispatchEvent(
            new CustomEvent('validation-errors', {
                detail: {
                    errors,
                },
            })
        )
    }

    async changeCurrentStep(nextStep) {
        this.dispatchEvent(
            new CustomEvent('before-step-change', {
                cancelable: true,
                detail: {
                    currentStep: state.currentStep,
                    nextStep,
                },
            })
        )

        let hasError = false

        if (this.beforeStepChangePromise) {
            this.__beforeStepChangeToastTimeout = setTimeout(() => {
                showToast(t`Saving QR code details. Please wait ...`)
            }, 1500)

            try {
                this.clearValidationErrors()
                await this.beforeStepChangePromise
            } catch (error) {
                // Show validation errors
                // Stop this function execution on error
                hasError = true

                if (isFunction(error.errors)) {
                    this.handleValidationErrors(error.errors())
                }
            } finally {
                clearTimeout(this.__beforeStepChangeToastTimeout)
            }
        }

        if (hasError) return

        const prevStep = state.currentStep

        state.currentStep = nextStep

        this.dispatchEvent(
            new CustomEvent('after-step-change', {
                detail: {
                    prevStep,
                    currentStep: state.currentStep,
                },
            })
        )
    }

    form() {
        return this.renderRoot.querySelector(`[role=form]`)
    }

    get downloadStep() {
        return this.renderRoot.querySelector('qrcg-download-qrcode')
    }

    navigateNext() {
        this.navigate(1)
    }

    navigateBack() {
        this.navigate(-1)
    }

    navigate(offset) {
        const currentIndex = this.steps.indexOf(
            this.steps.find((s) => s.value === state.currentStep)
        )

        const nextIndex = currentIndex + offset

        if (nextIndex === this.steps.length) {
            return this.onClose()
        }

        this.changeCurrentStep(this.steps[nextIndex].value)
    }

    onClose() {
        push('/dashboard/qrcodes')
    }

    renderStepType() {
        return html`
            <qrcg-qrcode-type-selector
                value=${state.type}
                @qrcode-type-selected=${this._onTypeSelected}
            ></qrcg-qrcode-type-selector>
        `
    }

    renderStepData() {
        return new QRCodeTypeManager(state.type).resolve().renderForm()
    }

    renderStepDesign() {
        return new QRCodeTypeManager(state.type).resolve().renderDesigner()
    }

    renderStepDownload() {
        return html`<qrcg-download-qrcode></qrcg-download-qrcode>`
    }

    renderCurrentStep() {
        const rendererName = `renderStep${capitalize(state.currentStep)}`

        return this[rendererName]()
    }

    renderNavigation(position) {
        return html`
            <div
                class="step-navigator ${position}"
                .hidden=${state.currentStep === 'type'}
            >
                <qrcg-button @click=${this.navigateBack} class="elegant">
                    <qrcg-icon mdi-icon=${mdiArrowLeft}></qrcg-icon>
                    ${t`Back`}
                </qrcg-button>

                <qrcg-button @click=${this.navigateNext} class="elegant">
                    ${this.nextText()}
                    <!--  -->
                    ${this.renderNextStepIcon()}
                </qrcg-button>
            </div>
        `
    }

    nextText() {
        if (state.currentStep === 'download') return t('Close')

        return t('Next')
    }

    renderNextStepIcon() {
        let icon = null

        if (state.currentStep === 'download') {
            icon = null
        } else {
            icon = mdiArrowRight
        }

        return html` <qrcg-icon mdi-icon=${icon}></qrcg-icon> `
    }

    async onSaveAsTemplateClick() {
        try {
            await QrcgQrCodeTemplateModal.open({
                qrcode: this.localRecord,
            })
        } catch {
            //
        }
    }

    renderSaveAsTemplateButton() {
        if (this.droplet.isSmall()) return

        if (!this.localRecord?.id) return

        const shouldRender = PluginManager.applyFilters(
            FILTER_QRCODE_FORM_SHOULD_RENDER_SAVE_AS_TEMPLATE_BUTTON,
            true
        )

        if (!shouldRender) return

        return html`
            <qrcg-button
                class="save-as-template-button elegant"
                @click=${this.onSaveAsTemplateClick}
            >
                <qrcg-icon mdi-icon=${mdiDrawing}></qrcg-icon>
                ${t`Save as Template`}
            </qrcg-button>
        `
    }

    renderQrcodeStatsLink() {
        const config = Config.get(
            'dashboard.view_stats_link_in_edit_qrcode_page'
        )

        if (config === 'disabled') return null

        return html`
            <qrcg-qrcode-stats-link
                qrcode-id=${this.localRecord?.id}
            ></qrcg-qrcode-stats-link>
        `
    }

    onChangeTypeClick() {
        QrcgChangeQrCodeTypeModal.open({
            selectedType: this.localRecord.type,
            qrcode: this.localRecord,
        })
    }

    renderChangeTypeButton() {
        if (this.stepsManager.isStepAvailable('type')) return

        const shouldRenderChangeTypeButton = PluginManager.applyFilters(
            FILTER_QRCODE_FORM_CHANGE_TYPE_BUTTON,
            true
        )

        if (!shouldRenderChangeTypeButton) return

        return html`
            <qrcg-button
                class="change-type elegant"
                @click=${this.onChangeTypeClick}
            >
                <qrcg-icon mdi-icon=${mdiFileEdit}></qrcg-icon>
                ${t`Change Type`}
            </qrcg-button>
        `
    }

    shouldRenderUseTemplateButton() {
        if (this.droplet.isSmall()) return false

        if (permitted('qrcode.list-all')) {
            return true
        }

        const configValue = Config.get('dashboard.use_template_button')

        return configValue !== 'disabled'
    }

    renderUseTemplateButton() {
        if (!this.shouldRenderUseTemplateButton()) {
            return
        }

        return html`
            <qrcg-button class="elegant" @click=${this.onUseTemplateClick}>
                <qrcg-icon mdi-icon=${mdiDownload}></qrcg-icon>
                ${t`Use Template`}
            </qrcg-button>
        `
    }

    renderHeader() {
        if (!this.headerIsVisible) return

        return html`
            <header>
                <qrcg-qrcode-link
                    qrcode-id=${this.localRecord?.id}
                ></qrcg-qrcode-link>

                <div class="actions">
                    ${this.renderQrcodeStatsLink()}
                    ${this.renderUseTemplateButton()}
                    ${this.renderChangeTypeButton()}
                    ${this.renderSaveAsTemplateButton()}
                </div>
            </header>
        `
    }

    renderHeaderToggle() {
        if (!this.localRecord?.id) return

        return html`
            <qrcg-icon
                mdi-icon=${mdiCog}
                @click=${this.onHeaderToggleClick}
                class="header-toggle"
            ></qrcg-icon>
        `
    }

    render() {
        return html`
            <div class="steps-container">
                <div class="start">
                    <qrcg-qrcode-form-steps
                        @request-step-change=${this._onStepChangeRequested}
                        currentStep=${state.currentStep}
                        .steps=${this.steps}
                    ></qrcg-qrcode-form-steps>

                    ${this.renderHeaderToggle()}
                </div>

                ${this.renderNavigation('top')}
            </div>
            ${this.renderHeader()}
            <!--  -->
            ${this.renderCurrentStep()}

            <!--  -->
            ${this.renderNavigation('bottom')}
        `
    }
}

window.defineCustomElement('qrcg-qrcode-form', QRCGQRCodeForm)
