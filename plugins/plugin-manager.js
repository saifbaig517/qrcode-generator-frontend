import { html } from 'lit'
import { FilterCollection } from './core/filter-callback'
import { ActionCollection } from './core/action-callback'

export class PluginManager {
    plugins = []

    filters = new FilterCollection()

    actions = new ActionCollection()

    static get _instance() {
        return window.__$$$private_qrcg__plugin_manager__
    }

    static set _instance(v) {
        window.__$$$private_qrcg__plugin_manager__ = v
    }

    /**
     *
     * @returns {PluginManager}
     */
    static instance() {
        if (!this._instance) {
            this._instance = new this()
        }

        return this._instance
    }

    static doActions(actionName, ...rest) {
        return html` ${this.instance().actions.doActions(actionName, ...rest)} `
    }

    static addAction(actionName, callback, sortOrder = 0) {
        return this.instance().actions.addAction(
            actionName,
            callback,
            sortOrder
        )
    }

    static applyFilters(filterName, value, ...rest) {
        return this.instance().filters.applyFilters(filterName, value, ...rest)
    }

    static addFilter(filterName, callback, sortOrder = 0) {
        return this.instance().filters.addFilter(
            filterName,
            callback,
            sortOrder
        )
    }

    static registerPlugin(Plugin) {
        this.instance().plugins.push(Plugin)
    }
}
