import { ValidationError, ApiError, save, get, destroy, post, put } from './api'
import { isEmpty, isFunction } from './helpers'

export class QRCGApiConsumer {
    host
    record
    loadableElementsSelector

    static instance({
        host,
        baseRoute,
        loadableElementsSelector,
        inputsSelector,
        disableableInputsSelector,
        bindEvents,
    }) {
        return new QRCGApiConsumer(
            host,
            baseRoute,
            loadableElementsSelector,
            inputsSelector,
            disableableInputsSelector,
            bindEvents
        )
    }

    constructor(
        host,
        baseRoute,
        loadableElementsSelector = `qrcg-button[type=submit]`,
        inputsSelector = `[name]`,
        disableableInputsSelector = `[name]`,
        bindEvents = false
    ) {
        this.host = host

        host.addController(this)

        this.baseRoute = baseRoute

        this.loadableElementsSelector = loadableElementsSelector

        this.beforeRequest = this.beforeRequest.bind(this)

        this.onValidationError = this.onValidationError.bind(this)

        this.afterRequest = this.afterRequest.bind(this)

        this.inputsSelector = inputsSelector

        this.disableableInputsSelector = disableableInputsSelector

        this.bindEvents = bindEvents
    }

    hostConnected() {
        this.host.addEventListener('api:before-request', this.beforeRequest)
        this.host.addEventListener(
            'api:validation-error',
            this.onValidationError
        )
        this.host.addEventListener('api:after-request', this.afterRequest)

        this.host.addEventListener('api:success', this.onApiSuccess)

        this.host.addEventListener('api:error', this.onApiError)
    }

    hostDisconnected() {
        this.host.removeEventListener('api:before-request', this.beforeRequest)

        this.host.removeEventListener(
            'api:validation-error',
            this.onValidationError
        )

        this.host.removeEventListener('api:after-request', this.afterRequest)

        this.host.removeEventListener('api:success', this.onApiSuccess)

        this.host.removeEventListener('api:error', this.onApiError)

        this.host = null
    }

    async call(func) {
        if (!this.host) return

        let beforeRequest = this.host.dispatchEvent(
            new CustomEvent('api:before-request', { cancelable: true })
        )

        if (!beforeRequest) return

        let jsonResponse

        let response

        let request

        try {
            const result = await func()

            response = result.response

            request = result.request

            jsonResponse = await response.clone().json()

            this.host?.dispatchEvent(
                new CustomEvent('api:success', {
                    detail: {
                        response: jsonResponse,
                        rawResponse: response,
                        request,
                    },
                })
            )
        } catch (e) {
            if (e instanceof ValidationError) {
                this.host?.dispatchEvent(
                    new CustomEvent('api:validation-error', {
                        detail: {
                            errors: e.errors(),
                            error: e,
                        },
                    })
                )
            }

            if (e instanceof ApiError) {
                this.host?.dispatchEvent(
                    new CustomEvent('api:error', {
                        detail: {
                            error: e,
                        },
                    })
                )
            }

            throw e
        } finally {
            this.host?.dispatchEvent(new CustomEvent('api:after-request'))
        }

        return jsonResponse
    }

    async post(route, data) {
        return this.call(() => post(route, data))
    }

    async put(route, data) {
        return this.call(() => put(route, data))
    }

    async save(data) {
        return this.resourceCall(() => save(this.baseRoute, data))
    }

    async get(id = '') {
        const slash = !isEmpty(id) ? '/' : ''

        return this.resourceCall(() => get(this.baseRoute + slash + id))
    }

    async getRoute(route) {
        return this.resourceCall(() => get(route))
    }

    async search(params = {}) {
        const searchParams = new URLSearchParams(params).toString()

        return this.resourceCall(() => get(`${this.baseRoute}?${searchParams}`))
    }

    async destroy(id) {
        return this.resourceCall(() => destroy(`${this.baseRoute}/${id}`))
    }

    async resourceCall(apiCall) {
        let result = (this.record = await this.call(apiCall))

        return result
    }

    beforeRequest() {
        this.resetInputErrors()
        this.disableInputs()
        this.setLoadableElementsLoading(true)

        if (isFunction(this.host.onBeforeRequest)) {
            this.host.onBeforeRequest()
        }
    }

    afterRequest() {
        this.releaseInputs()
        this.setLoadableElementsLoading(false)

        if (isFunction(this.host.onAfterRequest)) {
            this.host.onAfterRequest()
        }
    }

    onApiSuccess = (e) => {
        if (!this.bindEvents) return

        if (isFunction(this.host.onApiSuccess)) {
            this.host.onApiSuccess(e)
        }
    }

    onApiError = (e) => {
        if (!this.bindEvents) return

        if (isFunction(this.host.onApiError)) {
            this.host.onApiError(e)
        }
    }

    async setLoadableElementsLoading(loading) {
        // await new Promise((resolve) => setTimeout(resolve, 0))

        setTimeout(() => {
            this.host?.shadowRoot
                .querySelectorAll(this.loadableElementsSelector)
                .forEach((elem) => {
                    elem.loading = loading
                    if (loading) elem.setAttribute('loading', 'loading')
                    else elem.removeAttribute('loading')
                })
        }, 0)
    }

    disableInputs() {
        this.disableableInputs.forEach((elem) => (elem.disabled = true))
    }

    releaseInputs() {
        this.disableableInputs.forEach((elem) => (elem.disabled = false))
    }

    resetInputErrors() {
        this.inputs.forEach((elem) => (elem.errors = []))
    }

    get inputs() {
        return this.host.shadowRoot.querySelectorAll(this.inputsSelector)
    }

    get disableableInputs() {
        return this.host.shadowRoot.querySelectorAll(
            this.disableableInputsSelector
        )
    }

    onValidationError(e) {
        const errors = e.detail.errors

        Object.keys(errors).forEach((name) => {
            const elem = this.host.shadowRoot.querySelector(`[name="${name}"]`)

            if (!elem) return

            elem.errors = errors[name]
        })
    }
}
