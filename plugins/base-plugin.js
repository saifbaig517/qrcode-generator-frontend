import { ConfigHelper } from '../src/core/config-helper'
import { isEmpty } from '../src/core/helpers'
import { Config } from '../src/core/qrcg-config'
import { FILTER_MENU_GROUPS } from './plugin-filters'
import { PluginManager } from './plugin-manager'

export class BasePlugin {
    static boot() {
        if (!this.isEnabled()) {
            return
        }

        PluginManager.registerPlugin(this)

        this.registerActions()

        this.registerFilters()

        this.registerMenuFilter()
    }

    static registerActions() {}

    static registerFilters() {}

    static registerMenuFilter() {
        PluginManager.addFilter(
            FILTER_MENU_GROUPS,
            (groups) => {
                if (this.menuGroup()) {
                    groups.push(this.menuGroup())
                }

                return groups
            },
            10
        )
    }

    static menuGroup() {}

    static slug() {
        throw 'Slug must be defined in child plugins'
    }

    static isEnabled() {
        const config = Config.get('plugins.enabled')

        const plugins = isEmpty(config) ? [] : config

        return !isEmpty(plugins.find((slug) => slug === this.slug()))
    }
}
