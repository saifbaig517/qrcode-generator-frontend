import { html } from 'lit'
import style from './permissions-input.scss?inline'

import { BaseInput } from '../../ui/base-input'
import { get } from '../../core/api'
import { PermissionStore } from './permission-store'
import { t } from '../../core/translate'
// eslint-disable-next-line
import { PermissionGroup } from './permission-group'
import { isArray, mapEventDelegate, parentMatches } from '../../core/helpers'
import { classMap } from 'lit/directives/class-map.js'

export class PermissionsInput extends BaseInput {
    static tag = 'qrcg-permissions-input'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            permissions: {
                type: Array,
            },
            loading: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.loading = true

        this.permissions = []

        this.groups = new PermissionStore()
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)

        this.addEventListener('on-input', this.onInput)

        this.fetchData()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onClick)

        this.removeEventListener('on-input', this.onInput)
    }

    syncValue() {
        this.groups.syncSelectedPermissionIds(this.value)

        this.groups.get().filter((group) => {
            const input = this.$(`[name=group-${group.slug}]`)

            if (input) {
                input.value = group.isSelected
            }
        })

        this.requestUpdate()
    }

    onInput(e) {
        const { name, value } = e.detail

        if (name === this.name) {
            return
        }

        if (name.match(/group/i)) {
            return this.onGroupInput(name, value)
        }

        if (name.match(/permission/i)) {
            return this.onPermissionInput(name, value)
        }
    }

    getValue() {
        if (!isArray(this.value)) return []

        return this.value
    }

    onPermissionInput(name, value) {
        const id = name.replace(/permission-/, '')

        if (value) {
            this.setValue([...this.getValue(), id])
        } else {
            this.setValue(this.getValue().filter((_id) => _id != id))
        }

        this._fireOnInput()

        this.requestUpdate()
    }

    updated(changed) {
        super.updated(changed)

        if (changed.has('value')) {
            this.syncPermissions()
        }
    }

    getPermissionsCheckboxes() {
        return this.$$('[name*="permission"]')
    }

    syncPermissions() {
        console.log(this.getPermissionsCheckboxes())

        this.getPermissionsCheckboxes().map((checkbox) => {
            const checked = this.getValue().find((id) => {
                return id == checkbox.getAttribute('permission-id')
            })

            checkbox.value = checked
        })
    }

    onGroupInput(name, value) {
        const slug = name.replace(/group-/, '')

        this.groups.find(slug).setSelected(value)

        const ids = this.groups.getSelectedPermissionIds()

        this.setValue(ids)

        this._fireOnInput()

        this.requestUpdate()
    }

    onClick(e) {
        mapEventDelegate(e, {
            '.group-heading': this.onGroupHeadingClick,
        })
    }

    onGroupHeadingClick(e, group) {
        const target = e.composedPath()[0]

        if (parentMatches(target, 'qrcg-checkbox')) {
            return
        }

        group.querySelector('qrcg-checkbox').dispatchEvent(new Event('click'))
    }

    async fetchData() {
        this.loading = true

        const { json } = await get('permissions')

        this.permissions = json

        this.groups = PermissionStore.withPermissions(this.permissions).build()

        this.loading = false

        this.syncValue()
    }

    renderLoader() {
        if (!this.loading) return

        return html`
            <div class="loading-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    /**
     *
     * @param {PermissionGroup} g
     * @returns
     */
    renderGroup(g) {
        const _class = classMap({
            group: true,
        })

        return html`
            <div class="${_class}">
                <div class="group-heading">
                    <div class="name">${g.getName()}</div>

                    <qrcg-checkbox name="group-${g.slug}"> </qrcg-checkbox>
                </div>

                <div class="group-permissions">
                    ${g.permissions.map(
                        (permission) => html`
                            <qrcg-checkbox
                                name="permission-${permission.id}"
                                permission-id=${permission.id}
                            >
                                ${permission.name}
                            </qrcg-checkbox>
                        `
                    )}
                </div>
            </div>
        `
    }

    renderPermissions() {
        if (this.loading) return

        return html`
            <div class="label">${t`Permissions`}</div>
            <div class="groups">
                ${this.groups.get().map((g) => this.renderGroup(g))}
            </div>
        `
    }

    render() {
        return [this.renderLoader(), this.renderPermissions()]
    }
}

PermissionsInput.register()
