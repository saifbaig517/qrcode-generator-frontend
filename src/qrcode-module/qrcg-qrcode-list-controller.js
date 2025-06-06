import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import { post } from '../core/api'

export class QRCGQRCodeListController extends QRCGApiConsumer {
    constructor(host) {
        super(host, 'qrcodes')
    }

    async archive(id, shouldArchive) {
        return this.resourceCall(() =>
            post(`${this.baseRoute}/archive/${id}`, {
                archived: shouldArchive,
            })
        )
    }
}
