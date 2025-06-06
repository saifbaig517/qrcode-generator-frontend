import { html } from 'lit'
import { get } from '../../core/api'
import { isClient, isSuperAdmin, loadUser } from '../../core/auth'
import { Config } from '../../core/qrcg-config'
import { t } from '../../core/translate'
import { Droplet } from '../../core/droplet'
import { BillingMode } from '../../subscription-plan-module/billing-mode'
import { PluginManager } from '../../../plugins/plugin-manager'
import { FILTER_MENU_GROUPS } from '../../../plugins/plugin-filters'
import { MenuGroupModel } from './models/menu-group'
import { MenuItemModel } from './models/menu-item'

export class QrcgDashboardSidebarMenuStore {
    dropletManager = new Droplet()

    billing = new BillingMode()

    static get onChangeEventName() {
        return 'qrcg-dashboard-sidebar-menu-store:on-change'
    }

    get folders() {
        if (!this.dropletManager.isLarge()) return []

        try {
            return JSON.parse(localStorage.__folders__)
        } catch {
            return []
        }
    }

    set folders(v) {
        localStorage.__folders__ = JSON.stringify(v)

        this.fireOnChange()
    }

    get templateCategories() {
        if (!this.dropletManager.isLarge()) return []

        try {
            return JSON.parse(localStorage.__templateCategories__)
        } catch {
            return []
        }
    }

    set templateCategories(v) {
        localStorage.__templateCategories__ = JSON.stringify(v)

        this.fireOnChange()
    }

    constructor() {
        this.fetchFolders()
        this.fetchTemplateCategories()
    }

    fetchTemplateCategories = async () => {
        if (!this.dropletManager.isLarge()) return

        clearTimeout(
            QrcgDashboardSidebarMenuStore.__fetchTemplateCategoriesTimeout
        )

        QrcgDashboardSidebarMenuStore.__fetchTemplateCategoriesTimeout =
            setTimeout(async () => {
                const { json } = await get(
                    `template-categories?no-pagination=true`
                )

                this.templateCategories = json

                this.fireOnChange()
            }, 500)
    }

    fetchFolders = async () => {
        if (!this.dropletManager.isLarge()) return

        clearTimeout(QrcgDashboardSidebarMenuStore.__fetchFolderTimeout)

        QrcgDashboardSidebarMenuStore.__fetchFolderTimeout = setTimeout(
            async () => {
                const { response } = await get(`folders/${loadUser().id}`)

                this.folders = await response.json()

                this.fireOnChange()
            },
            500
        )
    }

    fireOnChange() {
        document.dispatchEvent(
            new CustomEvent(this.constructor.onChangeEventName)
        )
    }

    templateCategoriesGroup() {
        if (!isClient()) {
            return
        }

        return new MenuGroupModel(t`Categories`).lock().addItems(
            this.templateCategories.map((category) => {
                return new MenuItemModel(
                    category.name,
                    '/dashboard/qrcodes/new?template-category-id=' + category.id
                )
            })
        )
    }

    qrcodesGroup() {
        return new MenuGroupModel(t`QR Codes`)
            .lock()
            .addItem(
                new MenuItemModel(t`All`, '/dashboard/qrcodes', 'qrcode.list')
            )
            .addItem(
                new MenuItemModel(
                    t`Archived`,
                    '/dashboard/qrcodes?archived=true',
                    'qrcode.archive'
                )
            )
            .addItem(() => {
                if (this.dropletManager.isLarge()) {
                    return new MenuItemModel(
                        t('Templates'),
                        '/dashboard/qrcode-templates',
                        'qrcode-template.list'
                    )
                }
            })
    }

    /**
     *
     * @param {MenuGroupModel} usersGroup
     * @returns
     */
    addPayingUsers(usersGroup) {
        const value = Config.get('menu.show_paying_non_paying_users')

        if (value === 'disabled') return

        return usersGroup
            .addItem(
                new MenuItemModel(
                    t('Paying users'),
                    '/dashboard/users?paying=true',
                    'user.list-all'
                )
            )
            .addItem(
                new MenuItemModel(
                    t('Non paying users'),
                    '/dashboard/users?paying=false',
                    'user.list-all'
                )
            )
    }

    usersGroup() {
        const usersGroup = new MenuGroupModel(t`Users`)

        usersGroup.addItem(
            new MenuItemModel(t`All Users`, '/dashboard/users', 'user.list-all')
        )

        this.addPayingUsers(usersGroup)

        usersGroup.addItem(
            new MenuItemModel(t('Roles'), '/dashboard/roles', 'role.list-all')
        )

        return usersGroup
    }

    financeGroup() {
        return new MenuGroupModel(t('Finance'))
            .addItem(
                new MenuItemModel(
                    this.billing.menuItemLabel(),
                    this.billing.pricingManagementUrl(),
                    'subscription-plan.list-all'
                )
            )

            .addItem(
                new MenuItemModel(
                    t('Subscriptions'),
                    '/dashboard/subscriptions',
                    'subscription.list-all'
                )
            )
            .addItem(
                new MenuItemModel(
                    t`Billing`,
                    '/dashboard/billing',
                    'billing.manage'
                )
            )
            .addItem(
                new MenuItemModel(
                    t('Transactions'),
                    '/dashboard/transactions',
                    'transaction.list-all'
                )
            )
            .addItem(
                new MenuItemModel(
                    t`Payment Processors`,
                    '/dashboard/payment-processors',
                    'payment-processors.manage'
                ).ignoreQueryString()
            )
            .addItem(
                new MenuItemModel(
                    t`Currencies`,
                    '/dashboard/currencies',
                    'currency.list-all'
                )
            )
    }

    contentGroup() {
        return new MenuGroupModel(t`Content`)

            .addItem(
                new MenuItemModel(
                    t('Blog posts'),
                    '/dashboard/blog-posts',
                    'blog-post.list-all'
                )
            )
            .addItem(
                new MenuItemModel(
                    t('Content blocks'),
                    '/dashboard/content-blocks',
                    'content-block.list-all'
                )
            )
            .addItem(
                new MenuItemModel(
                    t`Translations`,
                    '/dashboard/translations',
                    'translations.list-all'
                )
            )
            .addItem(
                new MenuItemModel(
                    t('Custom Code'),
                    '/dashboard/custom-codes',
                    'custom-code.list-all'
                )
            )
            .addItem(
                new MenuItemModel(
                    t('Pages'),
                    '/dashboard/pages',
                    'pages.list-all'
                )
            )
            .addItem(() => {
                if (!this.dropletManager.isLarge()) {
                    return null
                }

                return new MenuItemModel(
                    t('Dynamic BioLinks'),
                    '/dashboard/dynamic-biolink-blocks',
                    'dynamic-biolinks-block.list-all'
                )
            })
    }

    contactsGroup() {
        return new MenuGroupModel(t`Contacts`)
            .addItem(
                new MenuItemModel(
                    t('Contact form'),
                    '/dashboard/contacts',
                    'contact.list-all'
                )
            )
            .addItem(
                new MenuItemModel(
                    t`Lead Form`,
                    '/dashboard/lead-forms',
                    'lead-form.list'
                )
            )
    }

    systemGroup() {
        const group = new MenuGroupModel(t`System`)

            .addItem(
                new MenuItemModel(
                    t('Status'),
                    '/dashboard/system/status',
                    'system.status'
                )
            )
            .addItem(
                new MenuItemModel(
                    t('Settings'),
                    '/dashboard/system/settings',
                    'system.settings'
                ).ignoreQueryString()
            )
            .addItem(
                new MenuItemModel(
                    t`Logs`,
                    '/dashboard/system/logs',
                    'system.logs'
                )
            )
            .addItem(
                new MenuItemModel(
                    t`Cache`,
                    '/dashboard/system/cache',
                    'system.cache'
                )
            )
            .addItem(
                new MenuItemModel(
                    t('Notifications'),
                    '/dashboard/system/notifications',
                    'system.notifications'
                ).ignoreQueryString()
            )
            .addItem(
                new MenuItemModel(
                    t('Sms Portals'),
                    '/dashboard/system/sms',
                    'system.sms-portals'
                ).ignoreQueryString()
            )
            .addItem(
                new MenuItemModel(
                    t`Auth Workflow`,
                    '/dashboard/system/auth-workflow',
                    'system.auth-workflow',
                    true
                )
            )
            .addItem(
                new MenuItemModel(
                    t`Domains`,
                    '/dashboard/domains',
                    'domain.list-all'
                )
            )

        if (this.dropletManager.isLarge()) {
            group.addItem(
                new MenuItemModel(
                    t`Template Categories`,
                    '/dashboard/template-categories',
                    'template-category.store'
                )
            )
        }

        return group
    }

    pluginsGroup() {
        return new MenuGroupModel(t`Plugins`)

            .addItem(
                new MenuItemModel(
                    t`Available Plugins`,
                    '/dashboard/plugins/available',
                    'plugins.manage'
                )
            )
            .addItem(
                new MenuItemModel(
                    t('Installed Plugins'),
                    '/dashboard/plugins/installed',
                    'plugins.manage'
                )
            )
    }

    foldersGroup() {
        return new MenuGroupModel(t`Folders`).lock().addItems(
            this.folders.map((f) => {
                return new MenuItemModel(
                    f.name,
                    `/dashboard/qrcodes?folder_id=${f.id}`,
                    'qrcode.list'
                )
                    .setData(f)
                    .setRenderer((item) => {
                        return html`
                            <qrcg-dashboard-sidebar-folder-menu-item
                                class="item"
                                .item=${item}
                                .isActive=${item.isActive()}
                            ></qrcg-dashboard-sidebar-folder-menu-item>
                        `
                    })
            })
        )
    }

    buildGroups() {
        let groups = [
            this.qrcodesGroup(),
            this.foldersGroup(),
            this.templateCategoriesGroup(),
            this.usersGroup(),
            this.financeGroup(),
            this.contentGroup(),
            this.contactsGroup(),
            this.pluginsGroup(),
            this.systemGroup(),
            ...this.userGeneratedMenu(),
        ]

        // Remove null groups
        groups = groups.filter((g) => g)

        groups = PluginManager.applyFilters(FILTER_MENU_GROUPS, groups)

        return groups
    }

    userGeneratedMenu() {
        if (isSuperAdmin()) {
            return []
        }

        let groups = Config.get('app.dashboard-client-menu')

        return MenuGroupModel.fromRawGroupList(groups)
    }
}
