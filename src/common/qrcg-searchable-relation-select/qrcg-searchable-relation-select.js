import { get } from '../../core/api'

import { QrcgSearchableSelect } from '../../ui/qrcg-searchable-select/qrcg-searchable-select'

export class QrcgSearchableRelationSelect extends QrcgSearchableSelect {
    static get tag() {
        return 'qrcg-searchable-relation-select'
    }

    static styles = [...super.styles]

    static get properties() {
        return {
            ...super.properties,
            apiEndpoint: {
                attribute: 'api-endpoint',
            },
        }
    }

    constructor() {
        super()

        this.loading = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetch()
    }

    async fetch() {
        this.loading = true

        try {
            const { response } = await get(this.apiEndpoint)

            const json = await response.json()

            let items = []

            if (json instanceof Array) {
                items = json
            } else if (json.data instanceof Array) {
                items = json.data
            }

            this.setItems(this.transformItems(items))
        } catch (ex) {
            //
        }

        this.loading = false
    }

    transformItems(items) {
        return items
    }
}

window.defineCustomElement(
    QrcgSearchableRelationSelect.tag,
    QrcgSearchableRelationSelect
)
