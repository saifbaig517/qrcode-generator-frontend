import { html, css } from 'lit'
import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'
import { post } from '../core/api'
import { showToast } from '../ui/qrcg-toast'
import { QrcgSearchableUserRelationSelect } from '../common/qrcg-searchable-relation-select/qrcg-searchable-user-relation-select'

export class QrcgChangeUserModal extends QrcgModal {
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
        return t`Change Owner`
    }

    onUserIdInput(e) {
        this.userId = e.detail.value
    }

    async affiramtivePromise() {
        if (!this.userId) {
            showToast(t`You must select a user first`)

            throw 'canceled'
        }

        try {
            await post(`qrcodes/${this.qrcode.id}/change-user`, {
                user_id: this.userId,
            })
        } catch {
            //

            showToast(t`Error changing ownership`)

            throw new Error('error')
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
window.defineCustomElement('qrcg-change-user-modal', QrcgChangeUserModal)
