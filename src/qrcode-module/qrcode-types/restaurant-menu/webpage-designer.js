import { css, html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

import './menu-category-input'

import './menu-item-input'

import './food-allergens-input'

import { get, isArray, isEmpty } from '../../../core/helpers'

export class RestaurantMenuWebpageDesigner extends WebpageDesigner {
    static get styles() {
        return [
            super.styles,
            css`
                * {
                    box-sizing: border-box;
                }
                .show-menu-item-image {
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

    renderBackgroundImageInput() {
        return html`
            ${this.renderFileInput('logo', t`Logo`)}
            ${this.renderFileInput('background_image', t`Background Image`)}
        `
    }

    renderCategories() {
        return html``
    }

    renderCategoriesSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Categories`}</h2>

                <qrcg-restaurant-menu-category-input
                    name="categories"
                    ?loading=${this.loading}
                ></qrcg-restaurant-menu-category-input>
            </qrcg-form-section>
        `
    }

    renderMenuItemsImageDisplayOptions() {
        if (isEmpty(get(this.data, 'design.menuItems'))) return

        if (!isArray(this.data?.design?.menuItems)) return

        return html`
            <qrcg-balloon-selector
                class="show-menu-item-image"
                name="showMenuItemImage"
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
                <h2 class="section-title">${t`Menu Items`}</h2>

                ${this.renderMenuItemsImageDisplayOptions()}

                <qrcg-restaurant-menu-item-input
                    name="menuItems"
                    .categories=${this.data?.design?.categories}
                    .qrcodeId=${this.qrcodeId}
                    .allergens=${get(this.data, 'design.foodAllergens.items')}
                    ?loading=${this.loading}
                ></qrcg-restaurant-menu-item-input>
            </qrcg-form-section>
        `
    }

    renderFoodAllergensSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Food Allergens`}</h2>

                <qrcg-food-allergens-input
                    name="foodAllergens"
                    ?loading=${this.loading}
                    .qrcodeId=${this.qrcodeId}
                ></qrcg-food-allergens-input>
            </qrcg-form-section>
        `
    }

    renderColorsBackgroundSectionTitle() {
        return t`Main Details`
    }

    renderColorBackgroundPosition(position) {
        if (position != 'last-elements') return

        return html`
            <qrcg-input name="menu_name" placeholder=${t`Today's Menu`}>
                ${t`Menu Name`}
            </qrcg-input>

            <qrcg-range-input name="menu_name_font_size">
                ${t`Menu Name Font Size`}
            </qrcg-range-input>
        `
    }

    renderFaviconInput() {
        return html`
            ${super.renderFaviconInput()}

            <qrcg-balloon-selector
                name="background-gradient-effect"
                .options=${[
                    {
                        name: t`Enabled`,
                        value: 'enabled',
                    },
                    {
                        name: t`Disabled`,
                        value: 'disabled',
                    },
                ]}
            >
                ${t`Gradient Effect. Default (Enabled)`}
            </qrcg-balloon-selector>

            ${this.renderQRCodeLanguageInput()}
        `
    }

    renderAdvancedSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Advanced`}</h2>

                ${this.renderCustomCodeInput()}
                <!--  -->
                ${this.renderDesktopCustomizationInput()}
            </qrcg-form-section>
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
            ${this.renderFoodAllergensSection()}
            <!--  -->
            ${this.renderReviewSitesSection()}
            <!--  -->
            ${this.renderInformationPopupInput()}
            <!--  -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-restaurant-menu-webpage-designer',
    RestaurantMenuWebpageDesigner
)
