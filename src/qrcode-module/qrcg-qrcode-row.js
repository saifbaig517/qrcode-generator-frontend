import { html } from 'lit'
import { destroy, post } from '../core/api'
import { isSuperAdmin, permitted } from '../core/auth'
import { featureAllowed } from '../core/subscription/logic'
import { t } from '../core/translate'

import { confirm } from '../ui/qrcg-confirmation-modal'
import { showToast } from '../ui/qrcg-toast'
import { QRCGDownloadQRCode } from './qrcg-download-qrcode'

import './qrcg-qrcode-image'
import { openPreviewModal } from './qrcg-qrcode-preview-modal'

import './qrcg-select-folder-link'

import './qrcg-change-user-link'

import './qrcg-pincode-link'
import { QRCodeModel } from '../models/qrcode-model'
import { mdiOpenInNew } from '@mdi/js'
import { DirectionAwareController } from '../core/direction-aware-controller'

import './qrcg-qrcode-share-link'
import { QRCodeCopyModal } from './qrcg-qrcode-copy-modal'
import { PluginManager } from '../../plugins/plugin-manager'
import { ACTION_QRCODE_ROW_ACTIONS } from '../../plugins/plugin-actions'
import { Config } from '../core/qrcg-config'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-qrcode-row.scss?inline'
import { QrcgQRCodeListPageStore } from './qrcg-qrcode-list-page-store'
import { isMobile } from '../core/helpers'
import {
    FILTER_QRCODE_ROW_ARCHIVE,
    FILTER_QRCODE_ROW_COPY,
} from '../../plugins/plugin-filters'

export class QRCGQRCodeRow extends BaseComponent {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    listStore = QrcgQRCodeListPageStore.singleton()

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            qrcode: { type: Object },
            isDynamic: { type: Boolean, reflect: true, attribute: 'dynamic' },
        }
    }

    constructor() {
        super()

        this.qrcode = new QRCodeModel()
    }

    connectedCallback() {
        super.connectedCallback()

        this.isDynamic = this.qrcode.isDynamic()

        this.downloadQrCode = new QRCGDownloadQRCode()

        this.listStore.addAfterUpdateEventListener(this.onListStoreChanged)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.listStore.removeAfterUpdateEventListener(this.onListStoreChanged)
    }

    willUpdate(changed) {
        if (changed.has('qrcode')) {
            this.isDynamic = this.qrcode.isDynamic()
        }
    }

    onListStoreChanged = () => {
        this.requestUpdate()
    }

    toggleArchive() {
        const shouldToggle = this.dispatchEvent(
            new CustomEvent('qrcg-qrcode-row:will-toggle-archive', {
                detail: { qrcode: this.qrcode },
                cancelable: true,
                composed: true,
                bubbles: true,
            })
        )

        if (!shouldToggle) return

        this.dispatchEvent(
            new CustomEvent('on-toggle-archive', {
                detail: { qrcode: this.qrcode },
            })
        )
    }

    async onCopy() {
        if (!featureAllowed('qrcode.copy')) {
            return await confirm({
                title: t`Upgrade Required`,
                message: t`This feature is not available on your current plan.`,
                affirmativeText: t`OK`,
                negativeText: null,
            })
        }

        const count = await QRCodeCopyModal.open({})

        const message = html`${t`Are you sure you want to copy`}
            [<strong>${this.qrcode.name}</strong>]
            <strong style="color: var(--danger)">${count}</strong>
            ${t`times`}?`

        if (count > 1)
            await confirm({
                message,
            })

        this.fire('qrcg-qrcode-row:before-copy')

        const toastPromise = showToast(
            t`Copying QR code, please wait ...`,
            2000
        )

        try {
            await post(`qrcodes/${this.qrcode.id}/copy`, {
                count,
            })

            await toastPromise

            await new Promise((resolve) => setTimeout(resolve, 100))

            showToast(t`QR code copied successfully ...`)
        } catch (ex) {
            await toastPromise

            try {
                const data = await ex.json()

                if (data.message) {
                    showToast(data.message)
                }
            } catch {
                showToast(t`Error copying QR code`)
            }
        }

        this.fire('qrcg-qrcode-row:after-copy')
    }

    async onDelete() {
        try {
            await confirm({
                message:
                    t`Are you sure you want to delete: ` +
                    this.qrcode.name +
                    '?',
            })

            await destroy(`qrcodes/${this.qrcode.id}`)

            showToast(t`QR code deleted successfully.`)

            this.fire('qrcg-qrcode-row:after-delete')
        } catch {
            //
        }
    }

    onDownloadPngClick() {
        this.downloadQrCode.downloadPng(this.qrcode)
    }

    onDownloadSvgClick() {
        QRCGDownloadQRCode.downloadSVG(this.qrcode)
    }

    onPinCodeChange() {
        const previewImage = this.shadowRoot.querySelector('qrcg-qrcode-image')

        const a = document.createElement('a')

        a.href = previewImage.url

        const search = new URLSearchParams(a.search)

        search.set('v1', new Date().getTime())

        a.search = search.toString()

        previewImage.url = a.href
    }

    async onStatusChange(e) {
        const switchElem = e.composedPath()[0]

        switchElem.disabled = true

        clearTimeout(this.__changeStatusTimeout)

        this.__changeStatusTimeout = setTimeout(async () => {
            const status = e.detail.value

            await post(`qrcodes/${this.qrcode.id}/change-status`, {
                status,
            })

            showToast(t`Updated successfully.`)

            switchElem.disabled = false
        }, 200)
    }

    openPreviewModal() {
        try {
            openPreviewModal({
                qrcode: this.qrcode,
            })
        } catch {
            //
        }
    }

    fire(eventName, detail = {}) {
        this.dispatchEvent(
            new CustomEvent(eventName, {
                composed: true,
                bubbles: true,
                detail: {
                    ...detail,
                    qrcode: this.qrcode,
                },
            })
        )
    }

    getDates() {
        const created = this.qrcode.createdAt()

        const updated = this.qrcode.updatedAt()

        const blackValue = (date) =>
            html`<span class="black-value">${date}</span>`

        return html`${t`Created:`}
        ${blackValue(created)}${updated !== created
            ? html` ${t`updated: `} ${blackValue(updated)}`
            : ''}`
    }

    async setQRCodeSelected(value) {
        this.qrcode.is_selected = value

        this.listStore.notifyAfterUpdate()
    }

    isQRCodeSelected() {
        return this.qrcode.is_selected
    }

    async onSelectCheckboxInput(e) {
        const value = e.detail.value

        this.setQRCodeSelected(value)
    }

    renderUser() {
        return html`
            <div class="user">
                ${t`Created by:`}
                <span class="black-value">${this.qrcode.user?.name}</span>
            </div>
        `
    }

    renderDeleteAction() {
        if (!this.qrcode.archived) return

        const value = Config.get('users_can_delete_qrcodes')

        const disabled = value === 'disabled'

        if (disabled && !isSuperAdmin()) {
            return
        }

        return html`
            <span class="sep"></span>

            <a class="action" @click=${this.onDelete}> ${t`Delete`} </a>
        `
    }

    renderArchiveAction() {
        if (!permitted('qrcode.archive')) return

        const shouldRender = PluginManager.applyFilters(
            FILTER_QRCODE_ROW_ARCHIVE,
            true
        )

        if (!shouldRender) return

        return html`
            <span class="sep"></span>

            <a class="action" @click=${this.toggleArchive}>
                ${this.qrcode.archived ? t('Restore') : t('Archive')}
            </a>
        `
    }

    renderPreviewLink() {
        if (!this.qrcode.isDynamic()) return

        const dest = this.qrcode.getRedirectDestination()

        if (!dest) return

        return html`
            <a href="${dest}" target="_blank" class="open-preview">
                <qrcg-icon mdi-icon=${mdiOpenInNew}></qrcg-icon>
            </a>
        `
    }

    renderScansNumber() {
        if (!this.qrcode.isDynamic()) {
            return
        }

        if (!this.qrcode.scans_count) {
            return t`No scans yet`
        }

        const scans_word = this.qrcode.scans_count > 1 ? t`Scans` : t`Scan`

        return html`
            <span class="black-value">${this.qrcode.scans_count}</span>

            ${scans_word}
        `
    }

    renderCopyAction() {
        const shouldRender = PluginManager.applyFilters(
            FILTER_QRCODE_ROW_COPY,
            true
        )

        if (!shouldRender) return
        return html`
            <span class="sep"></span>

            <a class="action" @click=${this.onCopy}> ${t`Copy`} </a>
        `
    }

    renderDynamicBadge() {
        if (!this.qrcode.isDynamic()) return

        return html`<div class="dynamic-badge">${t`Dynamic`}</div>`
    }

    renderQRCodeSelectionCheckbox() {
        if (!this.listStore.isSelectionEnabled) return

        return html`
            <div class="selection-container">
                <qrcg-checkbox
                    @on-input=${this.onSelectCheckboxInput}
                    .value=${this.isQRCodeSelected()}
                ></qrcg-checkbox>
            </div>
        `
    }

    shouldShowPreviewImage() {
        if (this.listStore.showQRCodePreview === 'no') {
            return false
        }

        if (isMobile() && this.listStore.pageSize > 5) {
            return false
        }

        if (this.listStore.pageSize > 25) {
            return false
        }

        return true
    }

    renderPreviewImage() {
        if (!this.shouldShowPreviewImage()) return

        return html`
            <qrcg-qrcode-image
                @click=${this.openPreviewModal}
                url=${this.qrcode.getFileUrl('svg')}
                convert-to-png
            ></qrcg-qrcode-image>
        `
    }

    render() {
        return html`
            ${this.renderDynamicBadge()}
            <!--  -->
            ${this.renderQRCodeSelectionCheckbox()}

            <div class="qrcode-details">
                <div class="name-actions">
                    <div class="name-and-scans">
                        <h3 class="name">
                            <span>${this.qrcode.getName()}</span>
                            ${this.renderPreviewLink()}
                        </h3>

                        <div class="numbers">${this.renderScansNumber()}</div>

                        <qrcg-switch
                            name="status"
                            checked-value="enabled"
                            unchecked-value="disabled"
                            .value=${this.qrcode?.status}
                            @on-input=${this.onStatusChange}
                        ></qrcg-switch>
                    </div>

                    <div class="numbers dates">${this.getDates()}</div>

                    <div class="type-container">
                        <div class="type">${t(this.qrcode.type)}</div>

                        ${this.renderUser()}
                    </div>
                    <div class="actions">
                        <a class="action" href=${this.qrcode.getEditLink()}>
                            ${t`Edit`}
                        </a>
                        <span class="sep"></span>

                        <a
                            class="action stats"
                            href=${this.qrcode.getStatsLink()}
                        >
                            ${t`Stats`}
                        </a>

                        ${this.renderArchiveAction()}
                        <!--  -->
                        ${this.renderCopyAction()}
                        <!--  -->
                        ${this.renderDeleteAction()}

                        <span class="sep"></span>

                        <a class="action" @click=${this.onDownloadSvgClick}>
                            ${t`SVG`}
                        </a>

                        <span class="sep"></span>

                        <a class="action" @click=${this.onDownloadPngClick}>
                            ${t`PNG`}
                        </a>

                        <qrcg-pincode-link
                            .qrcode=${this.qrcode}
                            @on-change=${this.onPinCodeChange}
                            class="action custom-action"
                        >
                            <span class="sep" slot="before-link"></span>
                        </qrcg-pincode-link>

                        <qrcg-select-folder-link
                            .qrcode=${this.qrcode}
                            class="action custom-action"
                        >
                            <span class="sep" slot="before-link"></span>
                        </qrcg-select-folder-link>

                        <qrcg-change-user-link
                            class="action custom-action"
                            .qrcode=${this.qrcode}
                        >
                            <span class="sep" slot="before-link"></span>
                        </qrcg-change-user-link>

                        <qrcg-qrcode-share-link
                            class="action custom-action"
                            .qrcode=${this.qrcode}
                        >
                            <span class="sep" slot="before-link"></span>
                        </qrcg-qrcode-share-link>

                        ${PluginManager.doActions(
                            ACTION_QRCODE_ROW_ACTIONS,
                            this.qrcode
                        )}
                    </div>
                </div>

                ${this.renderPreviewImage()}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-row', QRCGQRCodeRow)
