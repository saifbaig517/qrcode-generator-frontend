import { mdiFolder } from '@mdi/js'
import { html, css } from 'lit'
import { get, destroy } from '../core/api'
import { isEmpty, parentMatches } from '../core/helpers'
import { QRCGApiConsumer } from '../core/qrcg-api-consumer'
import { t } from '../core/translate'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { QrcgModal } from '../ui/qrcg-modal'
import { showToast } from '../ui/qrcg-toast'
import { loadUser } from '../core/auth'

export class QrcgSelectFolderModal extends QrcgModal {
    api = new QRCGApiConsumer(this)

    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .loader-container {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem 0;
            }

            .add-folder {
                margin-top: 1rem;
                display: flex;
                align-items: center;

                --qrcg-loader-h-color: var(--dark);
            }

            .folders-container {
            }

            .folder {
                padding: 0.5rem;
                background-color: var(--gray-0);
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
                user-select: none;
            }

            .folder qrcg-icon {
                color: var(--gray-2);
                margin-right: 0.5rem;
            }

            .folder-actions {
                display: flex;
                font-size: 0.8rem;
            }

            .folder .name {
                flex: 1;
            }

            .folder a {
                color: var(--primary-0);
                cursor: pointer;
            }

            .folder .count {
                margin-right: 1rem;
                color: var(--gray-2);
            }

            [name='folder_name'] {
                flex: 1;
                margin-right: 1rem;
            }

            [name='folder_name']::part(input) {
                margin-bottom: 0;
            }

            [name='folder_name']::part(label) {
                display: none;
            }

            .no-folders-message {
                text-align: center;
                margin: 1rem 0;
                color: var(--gray-2);
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            foldersLoading: { type: Boolean },
            saveFolderLoading: { type: Boolean },
            folders: { type: Array },
            data: {},
            value: {
                type: Array,
            },
            userId: {},
            multi: { type: Boolean },
        }
    }

    constructor() {
        super()

        this.foldersLoading = true
        this.folders = []
        this.data = {}
        this.userId = null
        this.multi = false
        this.value = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        this.addEventListener('click', this.onClick)

        setTimeout(() => {
            this.fetchFolders()
        })
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)

        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        const elem = e.composedPath()[0]

        if (parentMatches(elem, 'a.delete')) {
            this.onDeleteFolder(e)
        }
    }

    async onDeleteFolder(e) {
        const elem = e.composedPath()[0]

        e.preventDefault()

        e.stopPropagation()

        const folder = elem.folder

        if (folder.qrcode_count > 0) {
            await confirm({
                title: t`Folder is not empty`,
                message:
                    t`Are you sure you want to delete` + ` ${folder.name}?`,
            })
        }

        const userId = loadUser().id

        await destroy(`folders/${userId}/${folder.id}`)

        showToast(t`Folder deleted successfully`)

        await this.fetchFolders()
    }

    onInput(e) {
        if (e.detail.name === 'folder_check') {
            return this.onFolderChecked(e)
        }

        this.data = {
            ...this.data,
            [e.detail.name]: e.detail.value,
        }
    }

    resetCheckInputs() {
        const checkboxes = this.shadowRoot.querySelectorAll(
            '[name="folder_check"]'
        )

        checkboxes.forEach((c) => (c.value = false))
    }

    onFolderChecked(e) {
        const elem = e.composedPath()[0]

        if (!this.multi) this.resetValue()

        elem.value = e.detail.value

        if (elem.value) {
            this.addFolderId(elem.getAttribute('folder-id'))
        } else {
            this.removeFolderId(elem.getAttribute('folder-id'))
        }
    }

    async updated(changed) {
        if (changed.has('value') || changed.has('folders')) {
            await this.updateComplete

            this.syncValue()
        }
    }

    syncValue() {
        this.resetCheckInputs()

        this.value.forEach((id) => {
            const elem = this.shadowRoot.querySelector(`[folder-id="${id}"]`)

            if (!elem) return

            elem.value = true
        })
    }

    addFolderId(id) {
        this.value = [...this.value, id]
    }

    removeFolderId(id) {
        this.value = this.value.filter((_id) => _id != id)
    }

    resetValue() {
        this.value = []
    }

    resolvedData() {
        return this.value
    }

    async fetchFolders() {
        this.foldersLoading = true

        try {
            const { response } = await get(`folders/${this.userId}`)

            this.folders = await response.json()
        } catch {
            //
        }

        this.foldersLoading = false
    }

    async saveFolder() {
        this.saveFolderLoading = true

        try {
            const response = await this.api.post(
                `folders/${this.userId}`,
                this.data
            )

            const newFolder = response

            this.shadowRoot.querySelector('[name="folder_name"]').value = ''

            showToast(t`Folder saved successfully`)

            await this.fetchFolders()

            if (!this.multi) this.resetValue()

            this.addFolderId(newFolder.id)
        } catch (err) {
            console.error(err)
            showToast(t`Error saving new folder`)
        }

        this.saveFolderLoading = false
    }

    onFolderNameKeyUp(e) {
        if (e.key == 'Enter') {
            this.saveFolder()
        }
    }

    renderTitle() {
        return t`Select Folder`
    }

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderFolders() {
        if (this.foldersLoading) {
            return this.renderLoader()
        }

        if (isEmpty(this.folders)) {
            return html`
                <div class="no-folders-message">
                    ${t`You do not have any folders.`}
                </div>
            `
        }

        return this.folders.map((folder) => {
            return html`
                <div class="folder">
                    <qrcg-checkbox
                        class="name"
                        name="folder_check"
                        folder-id=${folder.id}
                    >
                        <qrcg-icon mdi-icon=${mdiFolder}></qrcg-icon>
                        ${folder.name}
                    </qrcg-checkbox>

                    <div class="folder-actions">
                        <div class="count">
                            ${folder.qrcode_count} ${t`QR Codes`}
                        </div>
                        <a class="delete" href="#" .folder=${folder}>
                            ${t`Delete`}
                        </a>
                    </div>
                </div>
            `
        })
    }

    renderFolderInput() {
        return html`
            <div class="add-folder">
                <qrcg-input
                    name="folder_name"
                    placeholder="${t`Add new folder`}"
                    ?disabled=${this.saveFolderLoading}
                    @keyup=${this.onFolderNameKeyUp}
                >
                </qrcg-input>

                <qrcg-button
                    @click=${this.saveFolder}
                    transparent
                    ?loading=${this.saveFolderLoading}
                >
                    ${t`Add folder`}
                </qrcg-button>
            </div>
        `
    }

    renderBody() {
        return html`
            <div class="folders-container">${this.renderFolders()}</div>

            <!-- -->

            ${this.renderFolderInput()}
        `
    }
}

window.defineCustomElement('qrcg-select-folder-modal', QrcgSelectFolderModal)
