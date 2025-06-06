import { html } from 'lit'
import style from './qrcode-selection-toolbar.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { t } from '../../core/translate'
import { confirm } from '../../ui/qrcg-confirmation-modal'
import { destroy, get, post, put } from '../../core/api'
import { QRCodeList } from '../qrcg-qrcode-list'
import { showToast } from '../../ui/qrcg-toast'
import { queryParam } from '../../core/helpers'
import { QrcgQRCodeListPageStore } from '../qrcg-qrcode-list-page-store'
import { UserSelectorModal } from './modals/user-selector-modal'
import { isSuperAdmin, loadUser } from '../../core/auth'
import { QrcgSelectFolderModal } from '../qrcg-select-folder-modal'
import { FolderModel } from '../../models/folder'

export class QrcodeSelectionToolbar extends BaseComponent {
    static tag = 'qrcg-qrcode-selection-toolbar'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,

            loading: {
                type: Boolean,
                reflect: true,
            },

            processedCount: {},
        }
    }

    constructor() {
        super()

        this.loading = false

        this.processedCount = 0

        this.store = QrcgQRCodeListPageStore.singleton()
    }

    get selectedQRCodeIds() {
        return this.store.selectedQRCodeIds
    }

    set selectedQRCodeIds(v) {
        this.store.selectedQRCodeIds = v
    }

    connectedCallback() {
        super.connectedCallback()

        this.store.addAfterUpdateEventListener(this.onAfterStoreUpdate)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.store.removeAfterUpdateEventListener(this.onAfterStoreUpdate)
    }

    onAfterStoreUpdate = () => {
        this.requestUpdate()
    }

    doArchive() {
        this.changeArchive(true)
    }

    doRestore() {
        this.changeArchive(false)
    }

    async executeAction(handler) {
        this.loading = true

        for (let i = 0; i < this.selectedQRCodeIds.length; i++) {
            const id = this.selectedQRCodeIds[i]

            try {
                this.processedCount++

                await handler(id)
            } catch (e) {
                //
                console.warn(
                    'Error while changing user for QR Code [' + id + ']',
                    e
                )
            }
        }

        this.processedCount = 0

        this.store.clearSelectedQRCodeIds()

        this.store.isSelectionEnabled = false

        showToast(t`Completed successfully`)

        this.requestListRefresh()

        this.loading = false
    }

    async doChangeOwner() {
        try {
            const userId = await UserSelectorModal.open({})

            this.executeAction((id) => {
                return post(`qrcodes/${id}/change-user`, {
                    user_id: userId,
                })
            })
        } catch {
            //
        }
    }

    async changeArchive(archived) {
        try {
            await confirm({
                message:
                    t`Are you sure you want to ` +
                    (archived ? t`archive` : t`restore`) +
                    ' ' +
                    this.store.selectedQRCodeIds.length +
                    ' ' +
                    t`QR Codes` +
                    '?',
            })

            this.executeAction((id) => {
                return post(`qrcodes/archive/${id}`, {
                    archived,
                })
            })
        } catch {
            //
        }
    }

    async doDelete() {
        try {
            await confirm({
                message:
                    t`Are you sure you want to delete` +
                    ' ' +
                    this.selectedQRCodeIds.length +
                    ' ' +
                    t`QR Codes` +
                    '? ' +
                    t`This cannot be undone.`,
            })

            this.executeAction((id) => {
                return destroy(`qrcodes/${id}`)
            })
        } catch {
            //
        }
    }

    async doMoveToFolder() {
        try {
            const [folderId] = await QrcgSelectFolderModal.open({
                value: [],
                multi: false,
                userId: loadUser().id,
            })

            this.executeAction(async (qrcodeId) => {
                const { json: qrcode } = await get('qrcodes/' + qrcodeId)

                if (!folderId) {
                    qrcode.folder_id = null
                } else {
                    qrcode.folder_id = folderId
                }

                return put(`qrcodes/${qrcodeId}`, qrcode)
            })
        } catch (ex) {
            //
            console.error(ex)
        }

        FolderModel.fireOnChange()
    }

    requestListRefresh() {
        document.dispatchEvent(
            new CustomEvent(QRCodeList.EVENT_REQUEST_REFRESH)
        )
    }

    shouldRender() {
        return this.selectedQRCodeIds.length > 1
    }

    renderLoader() {
        if (!this.loading) return

        return html`
            <div class="loading-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderStats() {
        if (this.processedCount > 0) {
            return `${this.processedCount} ${t`out of`} ${
                this.selectedQRCodeIds.length
            }`
        }

        return html`${this.selectedQRCodeIds.length} ${t`selected.`}`
    }

    renderDeleteAction() {
        if (!queryParam('archived')) {
            return
        }

        return html`
            <div class="action" @click=${this.doDelete}>${t`Delete`}</div>
        `
    }

    renderArchiveOrRestoreAction() {
        if (queryParam('archived')) {
            return html`
                <div class="action" @click=${this.doRestore}>${t`Restore`}</div>
            `
        }

        return html`
            <div class="action" @click=${this.doArchive}>${t`Archive`}</div>
        `
    }

    renderOtherActions() {
        return html`
            <div class="action" @click=${this.downloadPng}>
                ${t`Download PNG`}
            </div>
            <div class="action" @click=${this.downloadSvg}>
                ${t`Download SVG`}
            </div>
        `
    }

    renderChangeOwnerAction() {
        if (!isSuperAdmin()) return

        return html`
            <div class="action" @click=${this.doChangeOwner}>
                ${t`Change Owner`}
            </div>
        `
    }

    render() {
        if (!this.shouldRender()) return

        return html`
            <div class="main-container">
                ${this.renderLoader()}

                <div class="text">${this.renderStats()}</div>

                <div class="text no-italic">${t`Do with selection: `}</div>

                <div class="actions">
                    ${this.renderArchiveOrRestoreAction()}
                    <!--  -->

                    ${this.renderDeleteAction()}
                    <!--  -->
                    ${this.renderChangeOwnerAction()}

                    <div class="action" @click=${this.doMoveToFolder}>
                        ${t`Move To Folder`}
                    </div>
                </div>
            </div>
        `
    }
}

QrcodeSelectionToolbar.register()
