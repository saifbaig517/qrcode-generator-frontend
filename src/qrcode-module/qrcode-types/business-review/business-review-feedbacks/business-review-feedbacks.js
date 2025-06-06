import { html } from 'lit'
import style from './business-review-feedbacks.scss?inline'
import { BaseComponent } from '../../../../core/base-component/base-component'
import { get } from '../../../../core/api'
import { t } from '../../../../core/translate'
import { isNotEmpty } from '../../../../core/helpers'

export class BusinessReviewFeedbacks extends BaseComponent {
    static tag = 'qrcg-business-review-feedbacks'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            qrcodeId: {
                attribute: 'qrcode-id',
            },
            loading: {
                type: Boolean,
            },
            feedbacks: {
                type: Array,
            },
        }
    }

    constructor() {
        super()

        this.qrcodeId = null
        this.loading = true
        this.feedbacks = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchData()
    }

    async fetchData() {
        this.loading = true

        try {
            const { json } = await get(
                'qrcodes/' + this.qrcodeId + '/business-review-feedbacks'
            )

            this.feedbacks = json
            //
        } catch {
            //
        }

        this.loading = false
    }

    renderLoader() {
        if (!this.loading) {
            return
        }

        return html`
            <!--  -->
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderFeedbacks() {
        return this.feedbacks.map((feedback) => {
            return html`
                <div class="feedback">
                    <div class="key">${t`Stars`}</div>
                    <div class="value">${feedback.stars ?? '---'}</div>

                    <div class="key">${t`Name`}</div>
                    <div class="value">${feedback.name ?? '---'}</div>

                    <div class="key">${t`Email`}</div>
                    <div class="value">${feedback.email ?? '---'}</div>

                    <div class="key">${t`Mobile`}</div>
                    <div class="value">${feedback.mobile ?? '---'}</div>

                    <div class="key">${t`Feedback`}</div>
                    <div class="value">${feedback.feedback ?? '---'}</div>
                </div>
            `
        })
    }

    renderEmptyMessage() {
        if (this.loading) {
            return
        }

        if (isNotEmpty(this.feedbacks)) {
            return
        }

        return html`
            <div class="empty-message">${t`No feedbacks could be found.`}</div>
        `
    }

    render() {
        return [
            this.renderEmptyMessage(),
            this.renderLoader(),
            this.renderFeedbacks(),
        ]
    }
}

BusinessReviewFeedbacks.register()
