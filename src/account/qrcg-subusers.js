import '../ui/qrcg-form-section'
import { mdiDelete } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { QrcgMobileInput } from '../common/qrcg-mobile-input'
import { get as apiGet, destroy, post } from '../core/api'

import { isEmpty, parentMatches } from '../core/helpers'

import { userInvitedUsersLimitReached } from '../core/subscription/logic'
import { t } from '../core/translate'
import { confirm } from '../ui/qrcg-confirmation-modal'

import { showToast } from '../ui/qrcg-toast'
import { isSuperAdmin } from '../core/auth'

import '../common/qrcg-folder-input'

import { QRCGFormController } from '../core/qrcg-form-controller'

export class QrcgSubusers extends LitElement {
    form = new QRCGFormController(this)

    static styles = [
        css`
            :host {
                display: block;
            }

            .error-message,
            .no-users-message,
            .invited-users-limit-reached {
                padding: 1rem 0;
                text-align: center;
                color: var(--gray-2);
                margin-bottom: 2rem;
            }

            .invited-users-limit-reached {
                margin-bottom: 0;
            }

            .invite-user-form {
                display: flex;
                align-items: flex-end;
            }

            @media (max-width: 1300px) {
                .invite-user-form {
                    flex-direction: column;
                    align-items: initial;
                }

                .invite-user-form > * {
                    margin-bottom: 1rem;
                }
            }

            .invite-user-form qrcg-button[type='submit'] {
                margin-bottom: 0.5rem;
            }

            qrcg-folder-input {
                margin-bottom: 0.5rem;
            }

            .invite-user-title {
                color: var(--gray-2);
                font-weight: normal;
            }

            [name] {
                margin-right: 1rem;
            }

            [name='email'] {
                flex: 1;
            }

            .user-row {
                display: flex;
                justify-content: space-between;
                background-color: var(--gray-0);
                padding: 1rem;
                margin-bottom: 1rem;
                align-items: center;
                font-weight: bold;
            }

            .user-row > * > span {
                font-weight: normal;
                display: inline-block;
                margin-right: 0.5rem;
                color: var(--gray-2);
            }

            .delete-user {
                position: relative;
            }

            .delete-button {
                position: absolute;
                right: 0;
                bottom: 0;
                transform: translateY(50%);
            }

            .delete-button::part(button) {
                padding: 0.5rem;
                min-width: 0;
            }

            .delete-button qrcg-icon {
                width: 1.5rem;
                height: 1.5rem;
            }

            .user-list {
                margin-bottom: 2rem;
            }

            .loader-container {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .loader-container qrcg-loader {
                margin: auto;
                transform: scale(0.5);
            }
        `,
    ]

    static get properties() {
        return {
            user: {
                type: Object,
            },

            subUsers: {
                type: Array,
            },

            data: {
                type: Object,
            },

            userId: {
                attribute: 'user-id',
            },

            fetchLoading: {
                type: Boolean,
            },

            saveLoading: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.userId = null

        this.user = {}

        this.subUsers = []

        this.data = {}

        this.saveLoading = false

        this.fetchLoading = true
    }

    connectedCallback() {
        super.connectedCallback()

        setTimeout(() => this.fetchData())

        this.addEventListener('keypress', this.blockEnter)

        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('keypress', this.blockEnter)

        this.removeEventListener('on-input', this.onInput)
    }

    onInput = (e) => {
        e.stopImmediatePropagation()
        e.preventDefault()

        this.form.onInput(e)
    }

    blockEnter = (e) => {
        if (e.key === 'Enter') {
            e.stopImmediatePropagation()
            e.preventDefault()
        }
    }

    updated(changed) {
        if (changed.has('userId')) {
            this.fetchData()
        }

        if (changed.has('saveLoading')) {
            this.syncSaveLoading()
        }
    }

    syncSaveLoading() {
        const elements = this.shadowRoot.querySelectorAll(`[name], qrcg-button`)

        elements.forEach((elem) => {
            elem.loading = this.saveLoading
        })
    }

    async fetchData() {
        if (isEmpty(this.userId)) {
            return
        }

        this.fetchLoading = true

        try {
            await this.fetchUser()

            await this.fetchSubUsers()
        } catch (err) {
            console.error(err)
        }

        this.fetchLoading = false
    }

    async fetchUser() {
        const { response } = await apiGet(`users/${this.userId}`)

        this.user = await response.json()
    }

    async fetchSubUsers() {
        const { response } = await apiGet(`users/${this.userId}/sub-users`)

        this.subUsers = await response.json()
    }

    async deleteUser(e) {
        const elem = e.composedPath()[0]

        const button = parentMatches(elem, 'qrcg-button')

        const user = button.user

        await confirm({
            message: t`Are you sure you want to delete ${user.name} account?`,
        })

        try {
            await destroy(`users/${this.userId}/sub-users/${user.id}`)

            showToast(t('Sub user deleted successfully'))

            this.fetchData()
        } catch (err) {
            showToast(t('Error deleting sub user.'))
        }
    }

    resetInputs() {
        this.data = {}

        const inputs = Array.from(this.shadowRoot.querySelectorAll('[name]'))

        inputs.forEach((i) => (i.value = null))
    }

    async invite() {
        if (!this.data.folder_id) {
            return showToast(t`You must select folder first.`)
        }

        this.saveLoading = true

        try {
            await post(`users/${this.userId}/invite-sub-user`, this.data)

            this.resetInputs()

            showToast(t`Invite sent successfully`)

            await this.fetchData()
        } catch (err) {
            console.error(err)
        }

        this.saveLoading = false
    }

    renderInvitedUsersLimitReachedMessage() {
        return html`
            <div class="invited-users-limit-reached">
                ${t`Invited users limit reached. Upgrade your plan to invite more users.`}
            </div>
        `
    }

    renderInviteUserForm() {
        let limitReached = userInvitedUsersLimitReached(
            this.user,
            this.subUsers
        )

        if (limitReached) {
            return this.renderInvitedUsersLimitReachedMessage()
        }

        return html`
            <div class="invite-user-form">
                <qrcg-input name="name" placeholder=${t`Enter name`}>
                    ${t`Name`}
                </qrcg-input>

                ${QrcgMobileInput.renderBasedOnConfigs()}

                <qrcg-input
                    name="email"
                    placeholder="${t`Enter email`}"
                    type="email"
                >
                    ${t`User email`}
                </qrcg-input>

                <qrcg-folder-input
                    user-id=${this.userId}
                    name="folder_id"
                ></qrcg-folder-input>

                <qrcg-button type="submit" @click=${this.invite}>
                    ${t`Invite User`}
                </qrcg-button>
            </div>
        `
    }

    renderSuperAdminMessage() {
        return html`
            <div class="invited-users-limit-reached">
                ${t`Only regular subscribers can invite sub users. Admin cannot.`}
            </div>
        `
    }

    renderEmptySubUsersMessage() {
        return html`
            <div class="no-users-message">
                ${t`There is no sub users associated with this account.`}
                ${t`You can invite users using the form below.`}
            </div>
        `
    }

    renderUsersList() {
        if (isEmpty(this.subUsers)) {
            return this.renderEmptySubUsersMessage()
        }

        return html`
            <div class="user-list">${this.subUsers.map(this.renderUser)}</div>
        `
    }

    renderSubUserFolderNames(user) {
        const folders = user.subuser_folders

        if (isEmpty(folders)) return '----'

        if (folders.length > 1) {
            return folders.length + ' ' + t`Folders`
        }

        return folders[0].name
    }

    renderUser = (user) => {
        return html`
            <div class="user-row">
                <div class="user-name">
                    <span>${t`Name`}</span>
                    ${user.name}
                </div>

                <div class="user-email">
                    <span>${t`Email`}</span>
                    ${user.email}
                </div>

                <div class="user-folder">
                    <span>${t`Folder`}</span>
                    ${this.renderSubUserFolderNames(user)}
                </div>

                <div class="delete-user">
                    <qrcg-button
                        class="delete-button"
                        transparent
                        @click=${this.deleteUser}
                        .user=${user}
                    >
                        <qrcg-icon mdi-icon=${mdiDelete}></qrcg-icon>
                    </qrcg-button>
                </div>
            </div>
        `
    }

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderSubUserMessage() {
        return html`
            <div class="error-message">
                ${t`This user is already sub user.`}
            </div>
        `
    }

    renderContent() {
        if (this.fetchLoading) {
            return this.renderLoader()
        }

        if (isSuperAdmin(this.user)) {
            return this.renderSuperAdminMessage()
        }

        if (this.user.is_sub) {
            return this.renderSubUserMessage()
        }

        return html`
            ${this.renderUsersList()}

            <!-- -->

            ${this.renderInviteUserForm()}
        `
    }

    render() {
        if (!this.userId) {
            return null
        }

        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Sub Users`}</h2>

                ${this.renderContent()}
            </qrcg-form-section>
        `
    }
}

window.defineCustomElement('qrcg-subusers', QrcgSubusers)
