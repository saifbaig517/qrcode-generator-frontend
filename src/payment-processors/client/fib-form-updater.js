import { html } from 'lit'
import { BaseComponent } from '../../core/base-component/base-component'

import style from './fib-form-updater.scss?inline'
import { t } from '../../core/translate'
import { showToast } from '../../ui/qrcg-toast'
import { queryParam, sleep } from '../../core/helpers'
import { push } from '../../core/qrcg-router'
import { post } from '../../core/api'

export class FibFormUpdater extends BaseComponent {
    static tag = 'qrcg-fib-form-updater'

    static styleSheets = [...super.styleSheets, style]

    connectedCallback() {
        super.connectedCallback()

        this.waitForPayment()
    }

    waitForPayment() {
        setInterval(() => {
            this.checkForPayment()
        }, 3000)
    }

    async checkForPayment() {
        const { json } = await post(
            'payment-processors/fib/forward/isSubscriptionActive',
            {
                subscription_id: queryParam('subscription_id'),
            }
        )

        if (json?.result) {
            showToast(t`Payment received successfully!`)

            await sleep(4000)

            showToast(t`Rediredting you to the dashboard area...`)

            await sleep(2000)

            window.location = '/dashboard/qrcodes'
        }
    }

    render() {
        return html`
            <div class="message">${t`Waitnig For Payment`}</div>

            <qrcg-loader></qrcg-loader>
        `
    }
}

FibFormUpdater.register()
