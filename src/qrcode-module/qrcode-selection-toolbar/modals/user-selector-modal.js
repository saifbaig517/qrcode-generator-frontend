import { html, css } from 'lit'
import { QrcgModal } from '../../../ui/qrcg-modal'
import { showToast } from '../../../ui/qrcg-toast'
import { t } from '../../../core/translate'
import { QrcgSearchableUserRelationSelect } from '../../../common/qrcg-searchable-relation-select/qrcg-searchable-user-relation-select'

export class UserSelectorModal extends QrcgModal {
    static tag = 'qrcg-user-selector-modal'

    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            qrcg-searchable-user-relation-select {
                line-height: 1;
            }
        `,
    ]

    static get properties() {
        return {
            userId: {},
        }
    }

    renderTitle() {
        return t`Select User`
    }

    onUserIdInput(e) {
        this.userId = e.detail.value
    }

    resolvedData() {
        return this.userId
    }

    async affiramtivePromise() {
        if (!this.userId) {
            showToast(t`You must select a user first`)

            throw 'canceled'
        }
    }

    renderBody() {
        return html`
            <qrcg-searchable-user-relation-select
                name="user_id"
                api-endpoint="users?list_all=true"
                @on-input=${this.onUserIdInput}
                position-mode=${QrcgSearchableUserRelationSelect.POSITION_MODE_RELATIVE}
            >
                ${t`User`}
            </qrcg-searchable-user-relation-select>
        `
    }
}

UserSelectorModal.register()
