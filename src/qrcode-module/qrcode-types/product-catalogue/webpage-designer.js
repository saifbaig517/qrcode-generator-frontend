import { css, html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

import './product-category-input'

import './product-item-input'

import { get, isArray, isEmpty } from '../../../core/helpers'

export class ProductCatalogueWebpageDesigner extends WebpageDesigner {
    static get styles() {
        return [
            super.styles,
            css`
                * {
                    box-sizing: border-box;
                }
                .show-product-item-image {
                    margin-bottom: 1rem;
                }

                .button-section [name] {
                    margin-bottom: 1rem;
                }
            `,
        ]
    }

    static get properties() {
        return {
            ...super.properties,
        }
    }

    constructor() {
        super()
    }

    updated(changed) {
        if (changed.has('data')) {
            this.forceUpdate()
        }
    }

    async forceUpdate() {
        this.requestUpdate()

        await this.updateComplete

        setTimeout(() => {
            this.syncInputs()
        })
    }

    renderBackgroundImageInput() {
        return this.renderFileInput('logo', t`Logo`)
    }

    renderCategories() {
        return html``
    }

    renderCategoriesSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Categories`}</h2>

                <qrcg-product-catalogue-category-input
                    name="categories"
                    ?loading=${this.loading}
                ></qrcg-product-catalogue-category-input>
            </qrcg-form-section>
        `
    }

    renderProductItemsImageDisplayOptions() {
        if (isEmpty(get(this.data, 'design.menuItems'))) return
        if (!isArray(this.data.design.menuItems)) return

        return html`
            <qrcg-balloon-selector
                class="show-product-item-image"
                name="showProductItemImage"
                .options=${[
                    {
                        name: t`Always`,
                        value: 'always',
                    },
                    {
                        name: t`Only if Uploaded`,
                        value: 'only-if-uploaded',
                    },
                    {
                        name: t`Do not Show Images`,
                        value: 'do-not-show-images',
                    },
                ]}
            >
                ${t`Show Images. Default (Always)`}
            </qrcg-balloon-selector>
        `
    }

    renderItemsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Products`}</h2>

                ${this.renderProductItemsImageDisplayOptions()}

                <qrcg-product-catalogue-item-input
                    name="menuItems"
                    .categories=${this.data.design.categories}
                    .qrcodeId=${this.qrcodeId}
                    .allergens=${get(this.data, 'design.foodAllergens.items')}
                    ?loading=${this.loading}
                ></qrcg-product-catalogue-item-input>
            </qrcg-form-section>
        `
    }

    renderColorsBackgroundSectionTitle() {
        return t`Main Details`
    }

    renderColorBackgroundPosition(position) {
        if (position != 'last-elements') return

        return html`
            <qrcg-input name="catalogue_name" placeholder=${t`Our Catalogue`}>
                ${t`Catalogue Name`}
            </qrcg-input>

            <qrcg-range-input name="catalogue_name_font_size">
                ${t`Catalogue Name Font Size`}
            </qrcg-range-input>

            ${this.renderQRCodeLanguageInput()}
        `
    }

    renderProductLinkSection() {
        return html`
            <qrcg-form-section class="button-section">
                <h2 class="section-title">${t`Product Button`}</h2>
                <qrcg-balloon-selector
                    name="product_button_target"
                    .options=${[
                        {
                            name: t`Same Window`,
                            value: 'self',
                        },
                        {
                            name: t`New Window`,
                            value: '_blank',
                        },
                    ]}
                >
                    ${t`Open Link in (Default: Same Window)`}
                </qrcg-balloon-selector>

                <qrcg-input
                    name="product_button_text"
                    placeholder=${t`Order Now`}
                >
                    ${t`Button Text`}
                </qrcg-input>

                <qrcg-color-picker name="product_button_color">
                    ${t`Button Color`}
                </qrcg-color-picker>
                <qrcg-color-picker name="product_button_text_color">
                    ${t`Text Color`}
                </qrcg-color-picker>
            </qrcg-form-section>
        `
    }

    renderAdvancedSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Advanced`}</h2>

                ${this.renderCustomCodeInput()}
                <!--  -->
                ${this.renderDesktopCustomizationInput()}
            </section>
        `
    }

    renderSections() {
        return html`
            ${super.renderSections()}
            <!-- -->
            ${this.renderCategoriesSection()}
            <!-- -->
            ${this.renderItemsSection()}
            <!-- -->
            ${this.renderProductLinkSection()}
            <!--  -->
            ${this.renderReviewSitesSection()}
            <!-- -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-product-catalogue-webpage-designer',
    ProductCatalogueWebpageDesigner
)
