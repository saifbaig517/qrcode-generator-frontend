import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { t } from '../core/translate'
import { QrcgSelectFolderModal } from '../qrcode-module/qrcg-select-folder-modal'
import { isArray, isEmpty } from '../core/helpers'

export class QrcgSelectFolderInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            loading: { type: Boolean },
            name: {},
            value: {},
            folders: {
                type: Array,
            },
            userId: {
                attribute: 'user-id',
            },
        }
    }

    constructor() {
        super()

        this.loading = false

        this.userId = null

        this.folders = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onButtonClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onButtonClick)
    }

    async onButtonClick() {
        if (this.loading) return

        try {
            const selected = await QrcgSelectFolderModal.open({
                value: isArray(this.value) ? this.value : [],
                userId: this.userId,
                multi: true,
            })

            this.fireOnInput(selected)
        } catch {
            //
        }
    }

    updated(changed) {
        if (changed.has('value')) {
            if (isEmpty(this.value)) {
                this.folders = null
            } else {
                this.fetchFolders()
            }
        }
    }

    async fetchFolders() {
        if (isEmpty(this.value)) {
            return
        }

        try {
            this.loading = true

            const { response } = await get(`folders/${this.userId}`)

            const folders = await response.json()

            this.folders = folders.filter((folder) => {
                return this.value.find((vId) => vId == folder.id)
            })
        } catch {
            ///
        }

        this.loading = false
    }

    fireOnInput(value) {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    renderName() {
        if (isEmpty(this.folders)) {
            return t`Select Folder`
        }

        if (this.folders.length == 1) {
            return this.folders[0].name
        }

        return this.folders.length + ' ' + t`Folders`
    }

    render() {
        return html`
            <qrcg-button transparent .loading=${this.loading}>
                ${this.renderName()}
            </qrcg-button>
        `
    }
}
window.defineCustomElement('qrcg-folder-input', QrcgSelectFolderInput)
