import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'

import '../ui/qrcg-loader-h'

export class QrcgRelationSelect extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                flex-direction: column;
            }

            qrcg-select {
                display: block;
            }

            .loading-container {
                position: relative;
            }

            .loading-container qrcg-select {
                opacity: 0.5;
                pointer-events: none;
            }

            qrcg-loader-h {
                position: absolute;
                color: black;
                --qrcg-loader-h-color: black;
                transform: translateX(-50%) scale(0.5);
                top: 0;
                left: 50%;
            }
        `,
    ]

    static get properties() {
        return {
            /** @deprecated use api-endpoint attribute instead */
            endpoint: {},
            /** The endpoint of where the data should be fetched from */
            apiEndpoint: {
                attribute: 'api-endpoint',
            },
            data: {},
            name: {},
            value: {},
            errors: { type: Array },
            itemNameKeys: { type: Array },
            loading: { type: Boolean },
        }
    }

    constructor() {
        super()

        this.itemNameKeys = []
        this.loading = true
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetch()
    }

    async fetch() {
        this.loading = true

        let apiEndpoint = this.apiEndpoint

        if (isEmpty(apiEndpoint)) {
            apiEndpoint = `${this.endpoint}?list_all=true`
        }

        try {
            const { response } = await get(apiEndpoint)

            const json = await response.json()

            if (json instanceof Array) {
                this.data = json
            } else if (json.data instanceof Array) {
                this.data = json.data
            }
        } catch {
            //
        }

        this.loading = false
    }

    onSelectInput(e) {
        this.value = e.detail.value
    }

    renderLoader() {
        return html`
            <div class="loading-container">
                <qrcg-select part="select">
                    <label slot="label"><slot></slot></label>
                </qrcg-select>
                <qrcg-loader-h></qrcg-loader-h>
            </div>
        `
    }

    renderItem(item) {
        if (typeof item === 'object') {
            const keys = isEmpty(this.itemNameKeys)
                ? ['name']
                : this.itemNameKeys

            const name = keys
                .map((key) => {
                    return item[key]
                })
                .join(' - ')

            return html`<option value=${item.id}>${name}</option>`
        }

        return html`<option value=${item}>${t(item)}</option>`
    }

    render() {
        if (this.loading) {
            return this.renderLoader()
        }

        return html`
            <qrcg-select
                name=${this.name}
                value=${this.value}
                @on-input=${this.onSelectInput}
                .errors=${this.errors}
                part="select"
            >
                <label slot="label"><slot></slot></label>
                ${this.data.map((item) => this.renderItem(item))}
            </qrcg-select>
        `
    }
}
window.defineCustomElement('qrcg-relation-select', QrcgRelationSelect)
