import { html } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { permitted } from '../../core/auth'
import { CustomStyleInjector } from '../../core/custom-style-injector'
import { isEmpty, isFunction, mapEventDelegate } from '../../core/helpers'
import { Config } from '../../core/qrcg-config'

import './folder-menu-item'

import { QrcgDashboardSidebarMenuStore } from './menu-store'
import { BaseComponent } from '../../core/base-component/base-component'

import style from './sidebar-menu.scss?inline'
// eslint-disable-next-line
import { MenuGroupModel } from './models/menu-group'
// eslint-disable-next-line
import { MenuItemModel } from './models/menu-item'
import { mdiChevronDoubleRight } from '@mdi/js'

export class QrcgDashboardSidebarMenu extends BaseComponent {
    customStyleInjector = new CustomStyleInjector(this)

    menuStore = new QrcgDashboardSidebarMenuStore()

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            groups: { type: Array },
        }
    }

    constructor() {
        super()

        this.groups = this.menuStore.buildGroups()
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            QrcgDashboardSidebarMenuStore.onChangeEventName,
            this.onSidebarMenuChanged
        )

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            QrcgDashboardSidebarMenuStore.onChangeEventName,
            this.onSidebarMenuChanged
        )

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        mapEventDelegate(e, {
            '.group label': this.onGroupLabelClick,
        })
    }

    onGroupLabelClick = (e, label) => {
        label.group.isExpanded = !label.group.isExpanded

        this.requestUpdate()
    }

    onLocationChanged = () => {
        this.requestUpdate()
    }

    onSidebarMenuChanged = () => {
        this.groups = this.menuStore.buildGroups()
    }

    /**
     *
     * @param {MenuGroupModel} group
     * @returns
     */
    renderGroupItems(group) {
        if (!group.isExpanded && !group.isLocked) {
            return
        }

        return group.items.map((item) => this.renderItem(item))
    }

    renderGroup(group) {
        if (isEmpty(group) || isEmpty(group.items)) return

        const shouldRenderGroup = group.items.reduce(
            (anyPermitted, item) => anyPermitted || permitted(item.permission),
            false
        )

        if (!shouldRenderGroup) return null

        const $class = classMap({
            group: true,
            expanded: group.isExpanded,
            locked: group.isLocked,
        })

        return html`
            <div class="${$class}">
                <label .group=${group}>
                    <span> ${group.name} </span>
                    <qrcg-icon mdi-icon=${mdiChevronDoubleRight}></qrcg-icon>
                </label>

                ${this.renderGroupItems(group)}
            </div>
        `
    }

    renderGroups() {
        return this.groups.map((group) => this.renderGroup(group))
    }

    renderBadge(item) {
        if (!item.hasBadge) return

        return html`
            <qrcg-animated-badge
                style="background-color: ${item.badgeBackgroundColor}; color: ${item.badgeTextColor}"
            >
                ${item.badge}
            </qrcg-animated-badge>
        `
    }

    shouldRenderFrontendLinks() {
        const config = Config.get('app.frontend_links')

        return !config || config === 'enabled'
    }

    /**
     *
     * @param {MenuItemModel} item
     * @returns
     */
    renderItem(item) {
        if (!permitted(item.permission)) {
            return null
        }

        if (isFunction(item.renderer)) {
            return item.renderer(item)
        }

        return html`
            <a
                class="item ${classMap({
                    active: item.isActive(),
                })}"
                href="${item.link}"
                target=${item.target || '_self'}
            >
                ${item.label}

                <!--  -->
                ${this.renderBadge(item)}
            </a>
        `
    }

    render() {
        return this.renderGroups()
    }
}
window.defineCustomElement(
    'qrcg-dashboard-sidebar-menu',
    QrcgDashboardSidebarMenu
)
