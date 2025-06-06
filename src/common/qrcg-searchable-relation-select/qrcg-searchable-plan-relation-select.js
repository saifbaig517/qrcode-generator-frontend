import { QrcgSearchableRelationSelect } from './qrcg-searchable-relation-select'

export class QrcgSearchablePlanRelationSelect extends QrcgSearchableRelationSelect {
    constructor() {
        super()

        this.apiEndpoint = 'subscription-plans?list_all=true'
    }

    transformItems(plans) {
        return plans.map((p) => ({
            id: p.id,
            name: p.name,
            frequency: p.frequency,
        }))
    }
}

window.defineCustomElement(
    'qrcg-searchable-plan-relation-select',
    QrcgSearchablePlanRelationSelect
)
