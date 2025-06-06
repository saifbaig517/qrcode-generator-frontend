import { QrcgModal } from '../../../../ui/qrcg-modal'
import { BusinessReviewFeedbacks } from './business-review-feedbacks'
import { t } from '../../../../core/translate'

export class BusinessReviewFeedbacksModal extends QrcgModal {
    static tag = 'qrcg-business-review-feedbacks-modal'

    static get properties() {
        return {
            ...super.properties,
            qrcodeId: {},
        }
    }

    constructor() {
        super()

        this.qrcodeId = null
    }

    renderTitle() {
        return t`Feedback List`
    }

    getNegativeText() {}

    renderBody() {
        return BusinessReviewFeedbacks.renderSelf({
            'qrcode-id': this.qrcodeId,
        })
    }
}

BusinessReviewFeedbacksModal.register()
