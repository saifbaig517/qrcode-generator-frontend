import { isEmpty } from '../core/helpers'
import { Config } from '../core/qrcg-config'

export class QrcgQRCodeListPageStore {
    data = {}

    /**
     * @type {QrcgQRCodeListPageStore}
     */
    static #instance = null

    static EVENT_AFTER_UPDATE = 'qrcg-qrcode-list-page-store::after-update'

    static MODE_MINIMAL = 'minimal'

    static MODE_DETAILED = 'detailed'

    get EVENT_AFTER_UPDATE() {
        return QrcgQRCodeListPageStore.EVENT_AFTER_UPDATE
    }

    static singleton() {
        if (!this.#instance) {
            this.#instance = new QrcgQRCodeListPageStore()
        }

        return this.#instance
    }

    get selectedQRCodeIds() {
        return this.qrcodes
            .filter((qrcode) => qrcode.is_selected)
            .map((q) => q.id)
    }

    get mode() {
        const mode = localStorage.qrcodeListPageStoreMode

        return isEmpty(mode) ? this.getDefaultMode() : mode
    }

    set mode(v) {
        console.log('setting mode')
        localStorage.qrcodeListPageStoreMode = v
    }

    constructor() {
        //
        this.isSelectionEnabled = false

        this.pageSize = 10

        this.showQRCodePreview = true

        /**
         * @type {QRCodeModel[]}
         */
        this.qrcodes = []

        return new Proxy(this, this)
    }

    getDefaultMode() {
        return (
            Config.get('dashboard.qrcode_list_mode') ??
            QrcgQRCodeListPageStore.MODE_DETAILED
        )
    }
    isMinimal() {
        return this.mode == QrcgQRCodeListPageStore.MODE_MINIMAL
    }

    isDetailed() {
        return this.mode == QrcgQRCodeListPageStore.MODE_DETAILED
    }

    get(target, prop) {
        return this[prop]
    }

    set(target, prop, value) {
        this[prop] = value
        this.notifyAfterUpdate()
        return true
    }

    clearSelectedQRCodeIds() {
        this.qrcodes.forEach((qrcode) => (qrcode.is_selected = false))
        this.notifyAfterUpdate()
    }

    selectAll() {
        this.qrcodes.forEach((qrcode) => (qrcode.is_selected = true))
        this.notifyAfterUpdate()
    }

    notifyAfterUpdate() {
        document.dispatchEvent(new CustomEvent(this.EVENT_AFTER_UPDATE))
    }

    addAfterUpdateEventListener(handler) {
        document.addEventListener(this.EVENT_AFTER_UPDATE, handler)
    }

    removeAfterUpdateEventListener(handler) {
        document.removeEventListener(this.EVENT_AFTER_UPDATE, handler)
    }
}
