import { LitElement, html, css } from 'lit'
import { get, isEmpty } from '../../../core/helpers'
import { post } from '../../../core/api'

import { t } from '../../../core/translate'
import { FormInputController } from '../../../common/form-input-controller'

export class QrcgGooglePlaceInput extends LitElement {
    inputController = new FormInputController(
        this,
        FormInputController.MODE_BASE64
    )

    static styles = [
        css`
            :host {
                display: block;
            }

            qrcg-loader {
                position: absolute;
                right: -1rem;
                bottom: -0.65rem;
                transform: scale(0.3);
            }
        `,
    ]

    static get properties() {
        return {
            errors: { type: Array },
            name: {},
            value: {},
            loadingMapsLibrary: { type: Boolean },
            apiKeyError: { type: Boolean },
        }
    }

    get onMapsLoadedGlobalCallbackName() {
        return 'qrcgGooglePlaceInputOnMapsLoaded'
    }

    constructor() {
        super()
        this.errors = []
        this.loadingMapsLibrary = true
    }

    connectedCallback() {
        super.connectedCallback()

        window[this.onMapsLoadedGlobalCallbackName] = this.onMapsScriptLoaded

        if (!this.googlePlacesApiIsLoaded()) this.loadMapsLibrary()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this.autocomplete) {
            this.autocomplete.unbindAll()
        }
    }

    firstUpdated() {
        setTimeout(() => {
            this.initMapsLibrary()
        })
    }

    updated(changed) {
        if (changed.has('value')) {
            this.bindLocalInputValueIfNeeded()
        }
    }

    bindLocalInputValueIfNeeded() {
        if (isEmpty(this.value)) return

        if (!isEmpty(this.inputElement.value)) return

        this.inputElement.value = this.value.place_name
    }

    googlePlacesApiIsLoaded() {
        return !!get(window, 'google.maps.places')
    }

    async getGoogleApiKey() {
        try {
            const { response } = await post('qrcode-types/google-review', {
                method: 'getGoogleMapsApiKey',
            })

            const { api_key } = await response.json()

            if (isEmpty(api_key)) {
                throw new Error(t`Google Api Key not provided`)
            }

            return api_key
        } catch {
            this.errors.push([t`Google API Key not provided`])

            this.apiKeyError = true

            return null
        }
    }

    initMapsLibrary() {
        this.requestUpdate()

        if (!this.googlePlacesApiIsLoaded()) {
            return
        }

        if (!this.inputElement) {
            return
        }

        this.autocomplete = new window.google.maps.places.Autocomplete(
            this.inputElement
        )

        this.autocomplete.addListener('place_changed', this.onPlaceChanged)

        this.loadingMapsLibrary = false
    }

    onMapsScriptLoaded = () => {
        setTimeout(() => {
            this.initMapsLibrary()
        }, 10)
    }

    get inputElement() {
        const input = this.shadowRoot.querySelector('qrcg-input')

        const target = input.shadowRoot.querySelector('input')

        return target
    }

    onPlaceChanged = () => {
        try {
            const { place_id } = this.autocomplete.getPlace()

            const place_name = this.inputElement.value

            this.fireOnInput({
                place_id,
                place_name,
            })

            console.log({ place_id, place_name })
        } catch (ex) {
            console.error(ex)
            //
        }
    }

    fireOnInput(place) {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: place,
                },
            })
        )
    }

    async loadMapsLibrary() {
        let apiKey = null

        try {
            apiKey = await this.getGoogleApiKey()
        } catch {
            return
            //
        }

        const script = document.createElement('script')

        script.async = true

        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${this.onMapsLoadedGlobalCallbackName}&loading=async`

        document.body.appendChild(script)
    }

    preventDefaultOnInput(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        this.inputElement.dispatchEvent(new Event('click'))
    }

    renderLoader() {
        if (this.googlePlacesApiIsLoaded()) return

        return html` <qrcg-loader></qrcg-loader> `
    }

    render() {
        const placeholder = this.loadingMapsLibrary
            ? t`Loading ...`
            : t`Start typing ...`

        return html`
            <qrcg-input
                placeholder="${placeholder}"
                @on-input=${this.preventDefaultOnInput}
                .errors=${this.errors}
                ?disabled=${this.loadingMapsLibrary || this.apiKeyError}
            >
                ${t`Select Your Business`}
                <div slot="input-actions">${this.renderLoader()}</div>
            </qrcg-input>
        `
    }
}
window.defineCustomElement('qrcg-google-place-input', QrcgGooglePlaceInput)
