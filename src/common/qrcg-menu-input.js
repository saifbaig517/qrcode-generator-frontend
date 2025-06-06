import { mdiCloseCircle } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { generateUniqueID, isEmpty, parentMatches } from '../core/helpers'
import { t } from '../core/translate'

import { repeat } from 'lit/directives/repeat.js'

import '../common/qrcg-config-translator'

export class QrcgMenuInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .menu-group {
                margin: 1rem 0;
                padding: 1rem;
                position: relative;
                background-color: var(--gray-0);
            }

            :host(:not([has-groups])) .menu-group > qrcg-input {
                display: none;
            }

            :host(:not([has-badges])) .add-badge {
                display: none;
            }

            .menu-group::before {
                content: '';
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background-color: var(--primary-0);
                opacity: 0.05;
                z-index: 0;
                pointer-events: none;
            }

            .menu-group.last {
                margin-bottom: 0;
            }

            .menu-item {
                display: flex;
                flex-direction: column;
                position: relative;
                z-index: 1;

                padding: 1rem;
                background-color: white;
                margin: 1rem 0;
            }

            .menu-item-rows {
                flex: 1;
            }

            .menu-item-row {
                display: flex;
                flex-direction: column;
            }

            .badge-row > * {
                margin-bottom: 1rem;
            }

            @media (min-width: 900px) {
                .menu-item-row,
                .menu-item {
                    flex-direction: row;
                }

                .badge-row {
                    flex-direction: column;
                }

                .menu-item-row > qrcg-input {
                    flex: 1;
                }

                .menu-item-row > *:not(:last-child) {
                    margin-right: 1rem;
                }
            }

            @media (min-width: 1345px) {
                .badge-row {
                    flex-direction: row;
                    align-items: flex-end;
                }

                .badge-row > * {
                    margin-bottom: 0;
                }

                .badge-row qrcg-color-picker::part(color-box),
                .badge-row qrcg-input::part(input) {
                    margin-bottom: 0;
                }

                .badge-row qrcg-color-picker::part(label) {
                    margin-bottom: 0.25rem;
                }
            }

            .action {
                color: var(--primary-0);
                text-decoration: underline;
                font-size: 0.8rem;
                margin-top: 1rem;
                cursor: pointer;
                user-select: none;
                transition: opacity 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
            }

            .action.hidden {
                opacity: 0;
                pointer-events: none;
            }

            .delete-group {
                color: var(--danger);
            }

            .delete {
                width: 2rem;
                height: 2rem;
                cursor: pointer;
                color: var(--gray-1);
            }

            .delete.hidden {
                opacity: 0;
                pointer-events: none;
            }

            .delete-container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .group-actions {
                display: flex;
                justify-content: space-between;
            }

            .remove-badge {
                color: var(--danger);
                margin-bottom: 1rem;
            }
        `,
    ]

    static get properties() {
        return {
            groups: { type: Array },
            name: {},
            value: {},
            hasBadges: { type: Boolean, attribute: 'has-badge', reflect: true },
            hasGroups: {
                type: Boolean,
                attribute: 'has-groups',
                reflect: true,
            },
        }
    }

    constructor() {
        super()

        this.groups = [this.newGroup]

        this.hashStore = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)

        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)

        this.removeEventListener('on-input', this.onInput)

        this.hashStore.forEach((hash) => hash.clear())

        this.hashStore.length = 0

        this.groups.length = 0
    }

    willUpdate(changed) {
        if (changed.has('value') && this.value) {
            try {
                if (
                    JSON.stringify(this.groups) !== JSON.stringify(this.value)
                ) {
                    this.groups = this.value
                }
            } catch {
                //
            }
        }
    }

    get newItem() {
        return {
            label: '',
            link: '',
            target: '',
            hasBadge: false,
            badge: '',
            badgeBackgroundColor: '#ff0000',
            badgeTextColor: '#ffffff',
        }
    }

    get newGroup() {
        return {
            name: '',
            items: [this.newItem],
        }
    }

    onClick = (e) => {
        const target = e.composedPath()[0]

        if (target.matches('.action.add-group')) {
            this.addNewGroup(e)
        }

        if (target.matches('.action.add-item')) {
            this.addNewItem(e)
        }

        if (target.matches('.action.delete-group')) {
            this.deleteGroup(e)
        }

        if (target.matches('.action.add-badge')) {
            this.addBadge(e)
        }

        if (target.matches('.action.remove-badge')) {
            this.removeBadge(e)
        }

        const deleteItemElement = parentMatches(target, '.delete-item')

        if (deleteItemElement) {
            this.deleteItem(deleteItemElement)
        }
    }

    onInput = (e) => {
        const target = e.composedPath()[0]

        if (target === this) return

        e.stopImmediatePropagation()

        const item = target.item

        if (item) item[e.detail.name] = e.detail.value

        if (target.group) target.group[e.detail.name] = e.detail.value

        this.onInputChanged()
    }

    deleteItem(element) {
        const { item, group } = element

        group.items = group.items.filter((_item) => _item != item)

        this.onInputChanged()
    }

    addNewGroup() {
        this.groups.push(this.newGroup)

        this.onInputChanged()
    }

    addNewItem(e) {
        const group = e.composedPath()[0].group

        group.items.push(this.newItem)

        this.onInputChanged()
    }

    addBadge(e) {
        const item = e.composedPath()[0].item

        item.hasBadge = true

        this.onInputChanged()
    }

    removeBadge(e) {
        const item = e.composedPath()[0].item

        item.hasBadge = false

        this.onInputChanged()
    }

    deleteGroup(e) {
        const { group } = e.composedPath()[0]

        this.groups = this.groups.filter((_group) => group !== _group)

        this.onInputChanged()
    }

    onInputChanged() {
        this.requestUpdate()

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: this.groups,
                },
            })
        )
    }

    canAddItem(group) {
        // can only add item if the group has no empty items

        const emptyItems = group.items.filter((item) => {
            return isEmpty(item.label) || isEmpty(item.link)
        })

        return emptyItems.length === 0
    }

    canAddGroup() {
        return !this.groups.find((group) => isEmpty(group.name))
    }

    canDeleteGroup() {
        return this.groups.length > 1
    }

    groupKey = (group) => {
        return this.getObjectKey(group, 'groupsHash')
    }

    itemKey = (item) => {
        return this.getObjectKey(item, 'itemsHash')
    }

    getObjectKey = (object, hashName) => {
        if (!this[hashName]) {
            this[hashName] = new Map()
            this.hashStore.push(this[hashName])
        }

        if (!this[hashName].get(object)) {
            this[hashName].set(object, generateUniqueID(25))
        }

        const objectKey = this[hashName].get(object)

        return objectKey
    }

    getItemGroup(item) {
        return this.groups.find((group) => {
            return group.items.find((_item) => _item === item)
        })
    }

    renderBadgeInputs(item) {
        if (!item.hasBadge) {
            return html`<div class="action add-badge" .item=${item}>
                ${t`Add badge`}
            </div>`
        }

        return html`
            <div class="action remove-badge" .item=${item}>
                ${t`Remove badge`}
            </div>
            <div class="menu-item-row badge-row">
                <qrcg-input
                    name="badge"
                    value=${item.badge}
                    .item=${item}
                    placeholder="new"
                >
                    ${t`Badge`}
                </qrcg-input>

                <qrcg-color-picker
                    name="badgeBackgroundColor"
                    value=${item.badgeBackgroundColor}
                    .item=${item}
                >
                    ${t`Badge background color`}
                </qrcg-color-picker>

                <qrcg-color-picker
                    name="badgeTextColor"
                    value=${item.badgeTextColor}
                    .item=${item}
                >
                    ${t`Badge text color`}
                </qrcg-color-picker>
            </div>
        `
    }

    renderItemLabelInput(item, groupKey, itemKey) {
        return html`
            <qrcg-input
                placeholder="${t`Contact support`}"
                name="label"
                .value=${item.label}
                .item=${item}
            >
                ${t`Label`}

                <qrcg-config-translator
                    config-key=${this.name}
                    path="${groupKey}.items.${itemKey}.label"
                    slot="input-actions"
                    label="Menu Item Label"
                ></qrcg-config-translator>
            </qrcg-input>
        `
    }

    renderItemRow(item, itemKey, group, groupKey) {
        return html`
            <div class="menu-item-row">
                ${this.renderItemLabelInput(item, groupKey, itemKey)}
                <qrcg-input
                    name="link"
                    placeholder="https://helpdesk.domain.com"
                    .value=${item.link}
                    .item=${item}
                >
                    ${t`Link`}
                    <qrcg-config-translator
                        config-key=${this.name}
                        path="${groupKey}.items.${itemKey}.link"
                        slot="input-actions"
                        label="Menu Item Link"
                    ></qrcg-config-translator>
                </qrcg-input>
                <qrcg-balloon-selector
                    name="target"
                    value=${item.target}
                    .item=${item}
                    .options=${[
                        {
                            name: t`Same tab`,
                            value: '_self',
                        },
                        {
                            name: t`New tab`,
                            value: '_blank',
                        },
                    ]}
                >
                    ${t`Opens in`}
                </qrcg-balloon-selector>
            </div>
        `
    }

    renderItem(item, itemKey, group, groupKey) {
        return html`
            <div class="menu-item">
                <div class="menu-item-rows">
                    ${this.renderItemRow(item, itemKey, group, groupKey)}
                    ${this.renderBadgeInputs(item)}
                </div>

                <div class="delete-container">
                    <qrcg-icon
                        class="delete delete-item ${group.items.length < 2
                            ? 'hidden'
                            : ''}"
                        mdi-icon=${mdiCloseCircle}
                        .item=${item}
                        .group=${group}
                    >
                    </qrcg-icon>
                </div>
            </div>
        `
    }

    renderItems(group, groupKey) {
        return repeat(group.items, this.itemKey, (item, itemKey) =>
            this.renderItem(item, itemKey, group, groupKey)
        )
    }

    renderGroup = (group, i) => {
        return html`
            <div
                class="menu-group ${i === this.groups.length - 1 ? 'last' : ''}"
            >
                <qrcg-input
                    placeholder=${t`Help & Support`}
                    name="name"
                    .value=${group.name}
                    .group=${group}
                >
                    ${t`Group name`}
                    <qrcg-config-translator
                        config-key=${this.name}
                        path="${i}.name"
                        label="Group Name"
                    ></qrcg-config-translator>
                </qrcg-input>

                ${this.renderItems(group, i)}

                <div class="group-actions">
                    <div
                        class="action add-item ${this.canAddItem(group)
                            ? ''
                            : 'hidden'}"
                        .group=${group}
                    >
                        ${t`Add a new item`}
                    </div>

                    <div
                        class="action delete-group ${this.canDeleteGroup(group)
                            ? ''
                            : 'hidden'}"
                        .group=${group}
                    >
                        ${t`Delete group`}
                    </div>
                </div>
            </div>
        `
    }

    render() {
        return html`
            ${repeat(this.groups, this.groupKey, this.renderGroup)}

            <div class="action add-group ${this.canAddGroup() ? '' : 'hidden'}">
                ${t`Add a new group`}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-menu-input', QrcgMenuInput)
