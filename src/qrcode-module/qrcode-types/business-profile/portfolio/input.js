import { ImageListInput } from '../../webpage-design-inputs/image-list-input/input'
import { QrcgBusinessProfilePortfolioModal } from './modal'

export class QrcgBusinessProfilePortfolioInput extends ImageListInput {
    static get properties() {
        return {
            ...super.properties,
        }
    }

    getItemName(item) {
        return item.caption
    }

    openItemModal(data) {
        return QrcgBusinessProfilePortfolioModal.open({
            data,
            qrcodeId: this.qrcodeId,
        })
    }
}

window.defineCustomElement(
    'qrcg-business-profile-portfolio-input',
    QrcgBusinessProfilePortfolioInput
)
