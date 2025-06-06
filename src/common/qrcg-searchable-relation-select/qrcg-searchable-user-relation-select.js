import { QrcgSearchableRelationSelect } from './qrcg-searchable-relation-select'

export class QrcgSearchableUserRelationSelect extends QrcgSearchableRelationSelect {
    constructor() {
        super()

        this.apiEndpoint = 'users?list_all=true'
    }

    transformItems(users) {
        return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
        }))
    }
}

window.defineCustomElement(
    'qrcg-searchable-user-relation-select',
    QrcgSearchableUserRelationSelect
)
