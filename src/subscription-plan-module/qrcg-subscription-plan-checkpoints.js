import { LitElement, html, css } from 'lit'
import { isArray, isEmpty, parentMatches } from '../core/helpers'
import { mdiClose, mdiPlus } from '@mdi/js'
import { t } from '../core/translate'
import { showToast } from '../ui/qrcg-toast'

class Checkpoint {
    constructor({ id, text, available }) {
        if (!id) {
            this.id = this.#generateId()
        } else {
            this.id = id
        }

        this.text = text
        this.available = available
    }

    #generateId() {
        return 'cp-' + new Date().getTime()
    }

    static fromArray(checkpoints) {
        return checkpoints.map((checkpoint) => new this(checkpoint))
    }

    static deleteFromList(chekcpoints, id) {
        return chekcpoints.filter((c) => c.id != id)
    }

    static addToList(checkpoints, text, available) {
        return [
            ...checkpoints,
            new this({
                text,
                available,
            }),
        ]
    }

    static updateCheckpoint(checkpoints, id, text, available) {
        return checkpoints.map((checkpoint) => {
            if (checkpoint.id === id) {
                return new this({ id, text, available })
            }

            return checkpoint
        })
    }
}

export class QrcgSubscriptionPlanCheckpoints extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .checkpoint {
                display: flex;
                align-items: center;
            }

            .checkpoint qrcg-input {
                flex: 1;
                margin-right: 1rem;
            }

            .checkpoint qrcg-checkbox {
                margin-right: 1rem;
            }

            .action-button::part(button) {
                min-width: initial;
                padding: 0.5rem;
            }

            qrcg-form-comment {
                margin-bottom: 1rem;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {},
            subscriptionPlan: {},
        }
    }

    get checkpoints() {
        const value = isArray(this.value) ? this.value : []

        return Checkpoint.fromArray(value)
    }

    set checkpoints(value) {
        this.value = value

        this.fireOnInputEvent(value)
    }

    get elemNewCheckpointText() {
        return this.shadowRoot.querySelector('.new-checkpoint-text')
    }

    get elemNewCheckpointAvailable() {
        return this.shadowRoot.querySelector('.new-checkpoint-available')
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        this.addEventListener('click', this.onClick)

        this.addEventListener('keypress', this.watchEnter)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)

        this.removeEventListener('click', this.onClick)

        this.removeEventListener('keypress', this.watchEnter)
    }

    watchEnter(e) {
        const elem = e.composedPath()[0]

        if (!parentMatches(elem, '.new-checkpoint-text')) return

        if (e.key === 'Enter') {
            e.preventDefault()

            e.stopPropagation()

            e.stopImmediatePropagation()

            this.onAddCheckpointClick()
        }
    }

    onInput(e) {
        if (e.detail.name === this.name) {
            return
        }

        e.preventDefault()

        e.stopPropagation()

        const elem = e.composedPath()[0]

        const container = parentMatches(elem, '.checkpoint')

        const text = container.querySelector('[name="text"]').value
        const available = container.querySelector('[name="available"]').value

        const checkpoint = container.checkpoint

        this.value = Checkpoint.updateCheckpoint(
            this.checkpoints,
            checkpoint.id,
            text,
            available
        )

        setTimeout(() => {
            this.checkpoints = this.value
        }, 1000)
    }

    onClick(e) {
        const elem = e.composedPath()[0]

        if (parentMatches(elem, 'qrcg-button.add-checkpoint')) {
            return this.onAddCheckpointClick()
        }

        if (parentMatches(elem, 'qrcg-button.delete-checkpoint')) {
            return this.onDeleteCheckpointClick(e)
        }
    }

    onDeleteCheckpointClick(e) {
        const elem = e.composedPath()[0]

        const checkpointContainer = parentMatches(elem, '.checkpoint')

        const checkpoint = checkpointContainer.checkpoint

        this.checkpoints = Checkpoint.deleteFromList(
            this.checkpoints,
            checkpoint.id
        )
    }

    onAddCheckpointClick() {
        const available = this.elemNewCheckpointAvailable.value

        const text = this.elemNewCheckpointText.value

        if (isEmpty(text)) {
            return showToast(t`Checkpoint text is empty`)
        }

        this.checkpoints = Checkpoint.addToList(
            this.checkpoints,
            text,
            available
        )

        this.resetNewCheckpointFields()
    }

    resetNewCheckpointFields() {
        this.elemNewCheckpointAvailable.value = false
        this.elemNewCheckpointText.value = ''
    }

    fireOnInputEvent(value) {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                composed: true,
                bubbles: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    renderCheckpoint(checkpoint, i) {
        return html`
            <div class="checkpoint" .checkpoint=${checkpoint}>
                <qrcg-checkbox ?value=${checkpoint.available} name="available">
                    ${t`Available`}
                </qrcg-checkbox>
                <qrcg-input
                    name="text"
                    class="checkpoint-text"
                    value=${checkpoint.text}
                >
                    <qrcg-field-translator
                        model-class="SubscriptionPlan"
                        model-id="${this.subscriptionPlan.id}"
                        field="checkpoints.${i}.text"
                        label="${t`Plan Checkpoint`}"
                        slot="input-actions"
                    ></qrcg-field-translator>
                </qrcg-input>

                <qrcg-button
                    class="action-button delete-checkpoint"
                    transparent
                >
                    <qrcg-icon mdi-icon=${mdiClose}></qrcg-icon>
                </qrcg-button>
            </div>
        `
    }

    renderCheckpoints() {
        return this.checkpoints.map((checkpoint, i) =>
            this.renderCheckpoint(checkpoint, i)
        )
    }

    renderAddCheckpointButton() {
        return html`
            <div class="checkpoint">
                <qrcg-checkbox
                    class="new-checkpoint-available"
                    name="available"
                >
                    ${t`Available`}
                </qrcg-checkbox>

                <qrcg-input
                    class="new-checkpoint-text"
                    name="text"
                    placeholder=${t`Add new item here`}
                ></qrcg-input>

                <qrcg-button class="add-checkpoint action-button" transparent>
                    <qrcg-icon mdi-icon=${mdiPlus}></qrcg-icon>
                </qrcg-button>
            </div>
        `
    }

    render() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Plan Checkpoints`}</h2>

                <qrcg-form-comment label="">
                    ${t`Displayed in the pricing plans table in the home page.`}
                </qrcg-form-comment>

                ${this.renderCheckpoints()}
                <!-- -->
                ${this.renderAddCheckpointButton()}
            </qrcg-form-section>
        `
    }
}

window.defineCustomElement(
    'qrcg-subscription-plan-checkpoints',
    QrcgSubscriptionPlanCheckpoints
)
