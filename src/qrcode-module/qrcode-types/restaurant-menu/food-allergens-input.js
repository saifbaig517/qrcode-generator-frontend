import { LitElement, html, css } from 'lit'
import {
    get,
    isArray,
    isEmpty,
    parentMatches,
    parseNumberValue,
} from '../../../core/helpers'
import { t } from '../../../core/translate'
import { confirm } from '../../../ui/qrcg-confirmation-modal'
import { WebpageDesigner } from '../webpage-designer'
import { QrcgFoodAllergensModal } from './food-allergens-modal'

export class QrcgFoodAllergensInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            qrcg-button.add-food-allergens {
                margin: auto;
                margin-top: 2rem;
                width: fit-content;
            }

            .color-box span {
                display: block;
                width: 1rem;
                height: 1rem;
                border: 1px solid var(--gray-2);
                border-radius: 0.25rem;
                margin-right: 0.5rem;
            }

            .color-box.background-color {
                margin-right: 1rem;
            }

            .color-box {
                display: flex;
                align-items: center;
            }

            .allergen {
                display: flex;
                padding: 1rem;
                background-color: var(--gray-0);
                margin: 1rem 0;
                align-items: center;
                user-select: none;
                -webkit-user-select: none;
            }

            .allergen .allergen-name {
                flex: 1;
                font-weight: bold;
            }

            .allergen-icon {
                width: 3rem;
                height: 3rem;
                margin-right: 1rem;

                background-color: white;
            }

            .actions {
                display: flex;
                align-items: center;
                margin-left: 1rem;
            }

            .actions qrcg-button:not(:last-child) {
                margin-right: 0.5rem;
            }

            .actions qrcg-button:not(:first-child) {
                margin-left: 0.5rem;
            }

            .actions qrcg-button::part(button) {
                font-size: 0.8rem;
                padding: 0.5rem;
                min-width: 0;
            }

            .empty-message {
                margin: 2rem 0 0 0;
                text-align: center;
                color: var(--gray-2);
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: { type: Object },
            loading: { type: Boolean },
            qrcodeId: {},
        }
    }

    constructor() {
        super()
        this.value = {
            items: [],
            displayIconText: 'both',
        }
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
    }

    onInput(e) {
        if (e.detail.name === this.name) return

        e.stopImmediatePropagation()

        e.preventDefault()

        this.fireOnInput({
            ...this.value,
            [e.detail.name]: e.detail.value,
        })
    }

    updated(changed) {
        if (changed.has('value')) {
            this.syncInputs()
            this.updateComplete.then(() => {
                this.requestPositionalVariablesReset()
            })
        }
    }

    syncInputs() {
        this.shadowRoot
            .querySelectorAll('[name]')
            .forEach(
                (elem) => (elem.value = this.value[elem.getAttribute('name')])
            )
    }

    requestPositionalVariablesReset() {
        document.dispatchEvent(
            new CustomEvent(
                WebpageDesigner.requestUiPositionalVariablesResetEventName
            )
        )
    }

    onClick(e) {
        const element = e.composedPath()[0]

        const editButton = parentMatches(element, '.action-button.edit')

        if (editButton) {
            return this.onEditFoodAllergenClick(editButton)
        }

        const deleteButton = parentMatches(element, '.action-button.delete')

        if (deleteButton) {
            return this.onDeleteFoodAllergenClick(deleteButton)
        }
    }

    async onEditFoodAllergenClick(button) {
        const data = button.allergen

        try {
            const allergen = await this.openFoodAllergenModal(data)

            this.fireEditAllergen(allergen)
        } catch (ex) {
            //
        }
    }

    openFoodAllergenModal(data) {
        return QrcgFoodAllergensModal.open({
            data,
            qrcodeId: this.qrcodeId,
        })
    }

    async onDeleteFoodAllergenClick(button) {
        const allergen = button.allergen

        try {
            await confirm({
                message: html`${t`Are you sure you want to delete`}
                    <strong>${allergen.name}</strong>?`,
            })

            this.fireDelete(allergen)
        } catch (ex) {
            //
        }
    }

    async openModal() {
        try {
            const allergen = await this.openFoodAllergenModal()

            this.fireAddAllergen(allergen)
        } catch (ex) {
            //
        }
    }

    fireDelete(allergen) {
        const newItems = this.items.filter((c) => c.id != allergen.id)

        this.fireOnInput({
            ...this.value,
            items: newItems,
        })
    }

    fireAddAllergen(allergen) {
        const newItems = [...this.items, allergen]

        this.fireOnInput({
            ...this.value,
            items: newItems,
        })
    }

    fireEditAllergen(allergen) {
        const newItems = this.items.map((c) => {
            if (c.id === allergen.id) {
                return allergen
            }

            return c
        })

        this.fireOnInput({
            ...this.value,
            items: newItems,
        })
    }

    fireOnInput(value) {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    get items() {
        if (!(get(this.value, 'items') instanceof Array)) return []

        return this.value.items
    }

    sortedAllergens() {
        return this.items.sort(function (a, b) {
            return (
                parseNumberValue(a.sort_order, 100) -
                parseNumberValue(b.sort_order, 100)
            )
        })
    }

    renderAllergens() {
        if (isEmpty(this.items)) return

        return this.sortedAllergens().map((allergen) => {
            return html`
                <div class="allergen">
                    <qrcg-file-image
                        file-id=${allergen.icon}
                        class="allergen-icon"
                    ></qrcg-file-image>

                    <div class="allergen-name">${allergen.name}</div>

                    <div class="actions">
                        <qrcg-button
                            class="action-button edit"
                            transparent
                            .allergen=${allergen}
                            ?disabled=${this.loading}
                        >
                            ${t`Edit`}
                        </qrcg-button>
                        <qrcg-button
                            class="action-button delete"
                            transparent
                            .allergen=${allergen}
                            ?disabled=${this.loading}
                        >
                            ${t`Delete`}
                        </qrcg-button>
                    </div>
                </div>
            `
        })
    }

    renderEmptyAllergensMessage() {
        if (!isEmpty(this.value)) {
            return
        }

        return html`
            <div class="empty-message">
                ${t`There are no food allergens. Click on Add Food Allergen button below.`}
            </div>
        `
    }

    renderDisplayIconTextInput() {
        if (!isArray(get(this.value, 'items'))) return

        if (isEmpty(this.value.items)) {
            return
        }

        return html`
            <qrcg-balloon-selector
                name="displayIconText"
                .options=${[
                    {
                        name: t`Both`,
                        value: 'both',
                    },
                    {
                        name: t`Icon`,
                        value: 'icon',
                    },
                    {
                        name: t`Text`,
                        value: 'text',
                    },
                ]}
            >
                ${t`Display Preference. Default (Both)`}
            </qrcg-balloon-selector>
        `
    }

    render() {
        return html`
            ${this.renderEmptyAllergensMessage()}
            ${this.renderDisplayIconTextInput()}
            <!-- -->
            ${this.renderAllergens()}

            <qrcg-button
                class="add-food-allergens"
                transparent
                @click=${this.openModal}
                ?loading=${this.loading}
            >
                ${t`Add Food Allergen`}
            </qrcg-button>
        `
    }
}

window.defineCustomElement('qrcg-food-allergens-input', QrcgFoodAllergensInput)
