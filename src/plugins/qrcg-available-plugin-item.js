import { css, html } from 'lit'
import { defineCustomElement } from '../core/helpers'
import { QrcgPluginItem } from './qrcg-plugin-item'
import { t } from '../core/translate'
import { BrandUrl } from '../core/brand-url-helper'

export class QrcgAvailablePluginItem extends QrcgPluginItem {
    static get tag() {
        return 'qrcg-available-plugin-item'
    }

    static get styles() {
        return [
            super.styles,
            css`
                .price {
                    margin: 1rem 0;
                    font-weight: bold;
                    color: var(--dark);
                }
            `,
        ]
    }

    renderActions() {
        const url = BrandUrl.url(`/plugins/#${this.plugin.slug}`)

        return html`
            <qrcg-button href="${url}" target="_blank">
                ${t`Buy Now`}
            </qrcg-button>
        `
    }

    renderAfterTags() {
        return html` <div class="price">${this.plugin.price}</div> `
    }
}

defineCustomElement(QrcgAvailablePluginItem.tag, QrcgAvailablePluginItem)
