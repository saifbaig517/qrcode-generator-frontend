import { mdiFolder } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { get, put } from '../core/api'
import { isSuperAdmin, loadUser, permitted } from '../core/auth'
import { Droplet } from '../core/droplet'
import { t } from '../core/translate'
import { FolderModel } from '../models/folder'
import { showToast } from '../ui/qrcg-toast'
import { QrcgSelectFolderModal } from './qrcg-select-folder-modal'
import { DirectionAwareController } from '../core/direction-aware-controller'
import { QrcgExtendedLicenseModal } from '../ui/qrcg-extended-license-modal'
import { PluginManager } from '../../plugins/plugin-manager'
import { FILTER_QRCODE_ROW_FOLDERS_LINK } from '../../plugins/plugin-filters'
import { isNotEmpty } from '../core/helpers'

export class QrcgSelectFolderLink extends LitElement {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    droplet = new Droplet()

    static EVENT_FOLDERS_LOADED = 'qrcg-select-folder-link::folders-loaded'

    static folders = []

    static loadingFolders = false

    static styles = [
        css`
            :host {
                display: flex;
                align-items: center;
            }

            .action {
                color: var(--primary-0);
                text-decoration: underline;
                cursor: pointer;
                display: flex;
                align-items: center;
            }

            qrcg-icon {
                margin-right: 0.5rem;
            }

            :host(.dir-rtl) qrcg-icon {
                margin-right: 0;
                margin-left: 0.5rem;
            }

            .action[loading] {
                opacity: 0.5;
                pointer-events: none;
            }

            .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 10rem;
            }
        `,
    ]

    static get properties() {
        return {
            qrcode: {
                type: Object,
            },

            folder: {
                type: Object,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchFolder()

        document.addEventListener(
            QrcgSelectFolderLink.EVENT_FOLDERS_LOADED,
            this.onFoldersLoaded
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            QrcgSelectFolderLink.EVENT_FOLDERS_LOADED,
            this.onFoldersLoaded
        )
    }

    onFoldersLoaded = () => {
        this.fetchFolder()
        this.requestUpdate()
    }

    async onFolderSelection(e) {
        e.preventDefault()
        e.stopPropagation()

        if (this.droplet.isSmall()) {
            return QrcgExtendedLicenseModal.open()
        }

        try {
            const [id] = await QrcgSelectFolderModal.open({
                value: [this.qrcode.folder_id],
                multi: false,
                userId: loadUser().id,
            })

            if (id == this.qrcode.folder_id) return

            await put(`qrcodes/${this.qrcode.id}`, {
                ...this.qrcode,
                folder_id: id ?? null,
            })

            FolderModel.fireOnChange()

            await this.fetchQRCode()

            await this.fetchFolder(true)

            if (this.folder)
                showToast(
                    t`QR code moved to ` +
                        this.folder.name +
                        ' ' +
                        t`successfully`
                )
        } catch (ex) {
            console.error(ex)

            this.fetchFolder()

            FolderModel.fireOnChange()
        }
    }

    static async loadRemoteFolders() {
        const { json } = await get(`folders/${loadUser().id}`)

        this.folders = json

        return json
    }

    static async loadFolders(force = false) {
        if (force) {
            return this.loadRemoteFolders()
        }

        if (this.loadingFolders) {
            return []
        }

        if (isNotEmpty(this.folders)) {
            return this.folders
        }

        this.loadingFolders = true

        await this.loadRemoteFolders()

        this.loadingFolders = false

        document.dispatchEvent(
            new CustomEvent(QrcgSelectFolderLink.EVENT_FOLDERS_LOADED)
        )

        return this.folders
    }

    async fetchFolder(force = false) {
        this.fetchingFolder = true

        if (this.qrcode.folder_id) {
            try {
                const folders = await QrcgSelectFolderLink.loadFolders(force)

                this.folder = folders.find((f) => f.id == this.qrcode.folder_id)
            } catch {
                this.folder = null
            }
        } else {
            this.folder = null
        }

        this.fetchingFolder = false
    }

    async fetchQRCode() {
        const { response } = await get(`qrcodes/${this.qrcode.id}`)

        this.qrcode = await response.json()
    }

    renderName() {
        if (this.fetchingFolder) return t`Loading ...`

        if (!this.folder) {
            return t`Select Folder`
        }

        return this.folder.name
    }

    shouldRender() {
        // Show only to regular license admin
        if (this.droplet.isSmall() && !isSuperAdmin()) return false

        if (this.qrcode.archived) return false

        if (!permitted('folder.store')) return false

        if (this.superAdminTryingToMoveClientQRCodeToFolder()) return false

        const shouldRender = PluginManager.applyFilters(
            FILTER_QRCODE_ROW_FOLDERS_LINK,
            true
        )

        return shouldRender
    }

    superAdminTryingToMoveClientQRCodeToFolder() {
        return isSuperAdmin() && this.qrcode.user_id != loadUser().id
    }

    render() {
        if (!this.shouldRender()) return

        return html`
            <slot name="before-link"></slot>

            <a
                class="action"
                @click=${this.onFolderSelection}
                part="action"
                ?loading=${this.fetchingFolder}
            >
                <qrcg-icon mdi-icon=${mdiFolder}></qrcg-icon>

                <div class="name">${this.renderName()}</div>
            </a>
        `
    }
}
window.defineCustomElement('qrcg-select-folder-link', QrcgSelectFolderLink)
