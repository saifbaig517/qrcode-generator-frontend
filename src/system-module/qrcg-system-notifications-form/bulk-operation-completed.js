import { css, html } from 'lit'
import { Droplet } from '../../core/droplet'
import { t } from '../../core/translate'
import { QrcgSystemNotificationsFormBase } from './base'

export class BulkOperationCompleted extends QrcgSystemNotificationsFormBase {
    droplet = new Droplet()

    static get styles() {
        return [
            super.styles,
            css`
                .not-supported {
                    text-align: center;
                    padding: 1rem;
                    line-height: 1.7;
                }
            `,
        ]
    }

    instructionsText() {
        return t`Sent to users when bulk operation is completed.`
    }

    formTitle() {
        return t`Bulk Operation Completed`
    }

    slug() {
        return 'bulk-operation-completed'
    }

    variables() {
        return {
            BULK_OPERATION_NAME: t`Name of the completed operation`,
            OPERATION_LINK: t`Direct link to the operation page`,
        }
    }

    dropletNotSupported() {
        return html`
            <div class="not-supported">
                ${t`This feature is available to ${window.atob(
                    'ZXh0ZW5kZWQ='
                )} license only.`}
            </div>
        `
    }

    renderEnabledField() {
        return
    }

    render() {
        if (!this.droplet.isLarge()) return this.dropletNotSupported()

        return super.render()
    }
}

window.defineCustomElement(
    'qrcg-system-notifications-form-bulk-operation-completed',
    BulkOperationCompleted
)
