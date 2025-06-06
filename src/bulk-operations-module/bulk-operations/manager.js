import { unsafeStatic, html } from 'lit/static-html.js'

import '../../ui/qrcg-tab'
import '../../ui/qrcg-tab-content'
import { QrcgImportUrlQRCodesOperation } from './import-url-qrcodes'

export class BulkOperationsManager {
    static #oprations = []

    static registerOperation(Operation) {
        this.#oprations.push(Operation)
    }

    static #renderTab(Operation, i) {
        return html`
            <qrcg-tab tab-id=${Operation.type()} ?active=${i === 0}>
                ${Operation.name()}
            </qrcg-tab>
        `
    }

    static renderTabs() {
        return html`
            <nav class="tabs">
                ${this.#oprations.map((Operation, i) =>
                    this.#renderTab(Operation, i)
                )}
            </nav>
        `
    }

    static renderForms() {
        return this.#oprations.map((Operation) => {
            const htmlTag = Operation.tag()

            const form = unsafeStatic(`<${htmlTag} mode="form"></${htmlTag}>`)
            const instances = unsafeStatic(
                `<${htmlTag} mode="instances"></${htmlTag}>`
            )

            return html`
                <qrcg-tab-content tab-id="${Operation.type()}">
                    <template> ${form} ${instances} </template>
                </qrcg-tab-content>
            `
        })
    }
}

BulkOperationsManager.registerOperation(QrcgImportUrlQRCodesOperation)
