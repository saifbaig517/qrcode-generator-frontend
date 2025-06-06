import { html } from 'lit'

import '../ui/qrcg-form'

import '../ui/qrcg-input'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import { QRCGFormController } from '../core/qrcg-form-controller'

import { isEmpty, titleCase } from '../core/helpers'

import { push } from '../core/qrcg-router'

import { QRCGRouteParamsController } from '../core/qrcg-route-params-controller'

import { showToast } from '../ui/qrcg-toast'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import { QrcgDashboardBreadcrumbs } from './qrcg-dashboard-breadcrumbs'

import { t } from '../core/translate'

import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-dashboard-form.scss?inline'

function singularize(str) {
    return str
        .split(/[^\w]/g)
        .map((word) => word.replace(/(\w+)s$/g, (_, singular) => singular))
        .join(' ')
}

export class QrcgDashboardForm extends BaseComponent {
    formController = new QRCGFormController(this)

    routeParams = new QRCGRouteParamsController(this)

    titleController = new QRCGTitleController(this)

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            data: {},
            id: {},
        }
    }

    constructor({
        apiBaseRoute,
        editFormLink = '',
        listUrl = '',
        singularName = '',
        loadableElementsSelector,
        inputsSelector,
        disableableInputsSelector,
    }) {
        super()

        this.data = {}

        this.apiBaseRoute = apiBaseRoute

        this.onApiSuccess = this.onApiSuccess.bind(this)

        this.api = this.createApiConsumer(
            apiBaseRoute,
            loadableElementsSelector,
            inputsSelector,
            disableableInputsSelector
        )

        this.editFormLink = editFormLink

        if (isEmpty(this.editFormLink)) {
            this.editFormLink = `/dashboard/${apiBaseRoute}/edit/`
        }

        this.listUrl = listUrl

        if (isEmpty(this.listUrl)) {
            this.listUrl = `/dashboard/${apiBaseRoute}`
        }

        this.singularName = t(singularName)

        if (isEmpty(this.singularName)) {
            this.singularName = t(singularize(this.apiBaseRoute))
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('api:success', this.onApiSuccess)

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        this.updateTitle()

        this.updateBreadcumbs()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('api:success', this.onApiSuccess)

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )
    }

    createApiConsumer(
        apiBaseRoute,
        loadableElementsSelector,
        inputsSelector,
        disableableInputsSelector
    ) {
        return new QRCGApiConsumer(
            this,
            apiBaseRoute,
            loadableElementsSelector,
            inputsSelector,
            disableableInputsSelector
        )
    }

    updateTitle() {
        const match = window.location.pathname.match(/edit|new|view/)

        if (match) {
            this.titleController.pageTitle = t(
                titleCase(`${match[0]} ${this.singularName}`)
            )
        }
    }

    updateBreadcumbs() {
        QrcgDashboardBreadcrumbs.setLinks(this.breadcrumbs())
    }

    onLocationChanged = async () => {
        this.updateTitle()
        this.updateBreadcumbs()
    }

    firstUpdated() {
        this.id = this.routeParams.get('id')
    }

    updated(changed) {
        if (changed.has('id')) {
            if (!isEmpty(this.id)) {
                this.fetchRecord()
            }
        }
    }

    fetchRecord() {
        this.api.get(this.id)
    }

    onRouteParamChange(params) {
        this.id = params.id
    }

    submitForm = async () => {
        return this.api.save(this.data)
    }

    onApiSuccess(e) {
        const data = e.detail.response

        if (isEmpty(data)) return

        this.data = data

        const id = this.data.id

        if (isEmpty(id)) return

        const editLink = `${this.editFormLink}${this.data.id}`

        if (window.location.pathname !== editLink) {
            push(editLink)
        }

        if (e.detail.request.method === 'GET') {
            return
        }

        showToast(t('Record saved successfully'))
    }

    renderFormFields() {
        return html``
    }

    renderExtraButtons() {}

    renderCloseButton() {
        return html`
            <qrcg-button transparent href="${this.listUrl}">
                ${t`Close`}
            </qrcg-button>
        `
    }

    renderSaveButton() {
        return html` <qrcg-button type="submit">${t`Save`}</qrcg-button>`
    }

    renderButtons() {
        return html`
            <div class="buttons">
                ${this.renderExtraButtons()}
                <!--  -->
                ${this.renderCloseButton()}
                <!--  -->
                ${this.renderSaveButton()}
            </div>
        `
    }

    breadcrumbs() {
        const pathLinks =
            QrcgDashboardBreadcrumbs.buildBreadcrumbFromCurrentPath()

        if (pathLinks[pathLinks.length - 1].href.match(/\d+/)) {
            pathLinks.splice(pathLinks.length - 1)
        }

        const lastLink = pathLinks[pathLinks.length - 1]

        pathLinks[pathLinks.length - 1] = {
            ...lastLink,
            text: this.titleController.pageTitle,
        }

        return pathLinks
    }

    render() {
        return html`
            <qrcg-form>
                ${this.renderFormFields()}
                <!-- new line -->
                ${this.renderButtons()}
            </qrcg-form>
        `
    }
}
