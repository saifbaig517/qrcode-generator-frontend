import { LitElement } from 'lit'

import style from './base-component.scss?inline'
import { defineCustomElement, parentMatches, sleep } from '../helpers'
import { html, unsafeStatic } from 'lit/static-html.js'

export class BaseComponent extends LitElement {
    static styleSheets = [style]

    static tag = ''

    static get styles() {
        return []
    }

    static register() {
        defineCustomElement(this.tag, this)
    }

    static renderSelf(attributes = {}) {
        let attributesTags = ''

        if (typeof attributes === 'object') {
            attributesTags = Object.keys(attributes)
                .map((key) => {
                    const value = attributes[key]

                    return `${key}="${value}"`
                })
                .join(' ')
        }

        return html`${unsafeStatic(
            `<${this.tag} ${attributesTags}></${this.tag}>`
        )}`
    }

    static findSelf(container) {
        return container.querySelector(this.tag)
    }

    static async injectInDocumentBody() {
        while (!document.body) {
            await sleep(0)
        }

        document.body.appendChild(new this())
    }

    connectedCallback() {
        super.connectedCallback()

        this.injectStylesheets()
    }

    /**
     * Inject uncompiled css into the shadow dom to avoid lit css compile and
     * optimize the performance
     */
    injectStylesheets() {
        for (const sheet of this.constructor.styleSheets) {
            const tag = document.createElement('style')

            tag.innerHTML = sheet

            this.shadowRoot.appendChild(tag)
        }
    }

    waitForTransition(elem) {
        return new Promise((resolve) => {
            elem.addEventListener('transitionend', () => {
                resolve()
            })
        })
    }

    /**
     *
     * @param {String} selector
     * @returns {HTMLElement}
     */
    $(selector) {
        return this.shadowRoot.querySelector(selector)
    }

    /**
     *
     * @param {String} selector
     * @returns {HTMLElement[]}
     */
    $$(selector) {
        return Array.from(this.shadowRoot.querySelectorAll(selector))
    }

    /**
     *
     * @returns {HTMLElement}
     */
    getDirectParent() {
        return parentMatches(this, '*:not(' + this.constructor.tag + ')')
    }
}
