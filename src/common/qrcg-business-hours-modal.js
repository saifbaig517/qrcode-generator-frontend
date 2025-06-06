import { mdiMinusThick, mdiPlusCircle } from '@mdi/js'
import { html, css } from 'lit'
import { isEmpty, parentMatches } from '../core/helpers'
import { t } from '../core/translate'
import { QrcgModal } from '../ui/qrcg-modal'

export class QrcgBusinessHoursModal extends QrcgModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .content-view {
                max-height: 50vh;
                overflow: auto;
            }

            .day-row {
                display: flex;
                align-items: center;
            }

            .day-row .name {
                flex: 1;
            }

            qrcg-checkbox.additional-hours::part(icon) {
                opacity: 0;
            }

            qrcg-input[name='from'] {
                margin-right: 1rem;
            }

            qrcg-input {
                width: 6rem;
            }

            .action::part(button) {
                min-width: unset;
                padding: 0.5rem;
            }

            .action {
                margin-left: 1rem;
            }
            .action qrcg-icon {
                color: var(--gray-2);
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            value: {},
            days: { type: Array },
        }
    }

    static get days() {
        return [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ]
    }

    static async open(value) {
        const modal = new QrcgBusinessHoursModal()

        if (!isEmpty(value)) {
            modal.value = value
            modal.days = QrcgBusinessHoursModal.sortedDays(value)
        }

        document.body.appendChild(modal)

        await new Promise((r) => setTimeout(r))

        return modal.open()
    }

    static defaultDayData() {
        return {
            enabled: true,
            from: '09:00 AM',
            to: '05:00 PM',
        }
    }

    static makeDefaultValue() {
        const defaultDay = this.defaultDayData()

        return this.days.reduce((obj, d) => {
            obj[d] = defaultDay
            return obj
        }, {})
    }

    static baseDayName(dayKey) {
        return dayKey.split('_')[0]
    }

    static sortedDays(value) {
        const defaultDays = Object.keys(
            QrcgBusinessHoursModal.makeDefaultValue()
        )

        return Object.keys(value).sort(function (a, b) {
            if (a === b) return 0

            // base name
            const bn = (v) => v.split('_')[0]

            const i = (v) => v.split('_')[1]

            if (bn(a) === bn(b)) {
                return i(a) - i(b)
            }

            return defaultDays.indexOf(bn(a)) - defaultDays.indexOf(bn(b))
        })
    }

    constructor() {
        super()

        this.days = this.constructor.days

        this.value = this.constructor.makeDefaultValue()
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.clickDelegate)
        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.clickDelegate)
        this.removeEventListener('on-input', this.onInput)
    }

    clickDelegate = (e) => {
        const elem = e.composedPath()[0]

        let target

        if ((target = parentMatches(elem, 'qrcg-button.add-hours'))) {
            this.onAddHoursClick(target)
        }

        if ((target = parentMatches(elem, 'qrcg-button.remove-hours'))) {
            this.onRemoveHoursClick(target)
        }
    }

    additionalDayKeys(day) {
        return this.days.filter((d) => d.match(new RegExp(day + '_\\d')))
    }

    lastAdditionalDayIndex(day) {
        return this.additionalDayKeys(day).reduce((last, additionalKey) => {
            return Math.max(last, additionalKey.split('_')[1])
        }, 0)
    }

    onAddHoursClick(elem) {
        const day = this.baseDayName(elem.getAttribute('day-name'))

        const newDays = [...this.days]

        const i = this.lastAdditionalDayIndex(day)

        const previousKey = i > 0 ? `${day}_${i}` : day

        const index = newDays.indexOf(previousKey) + 1

        const newDayKey = `${day}_${+i + 1}`

        newDays.splice(index, 0, newDayKey)

        this.days = newDays

        this.value[newDayKey] = this.constructor.defaultDayData()

        this.requestUpdate()
    }

    onRemoveHoursClick(button) {
        this.days = this.days.filter((d) => {
            return d != button.getAttribute('day-name')
        })

        delete this.value[button.getAttribute('day-name')]

        this.requestUpdate()
    }

    isAdditionalHours(dayKey) {
        return dayKey.match(/_/)
    }

    onInput = (e) => {
        e.stopPropagation()

        const elem = e.composedPath()[0]

        const row = parentMatches(elem, '.day-row')

        const dayName = row.getAttribute('day-name')

        const { name, value } = e.detail

        // child cannot be enabled / disabled but they can be completly removed ...
        if (name === 'enabled' && this.isAdditionalHours(dayName)) return

        this.value[dayName] = {
            ...this.value[dayName],
            [name]: value,
        }
    }

    async updated(changed) {
        if (changed.has('value') || changed.has('days')) {
            await this.updateComplete
            this.syncInputs()
        }
    }

    syncInputs() {
        this.days.forEach((day) => {
            const obj = this.value[day] ?? {}

            const names = Object.keys(obj)

            names.forEach((name) => {
                const selector = `[day-name="${day}"] [name="${name}"]`

                const input = this.shadowRoot.querySelector(selector)

                if (input) input.value = obj[name]
            })
        })
    }

    async onAffirmativeClick() {
        this.resolve(this.value)

        this.close()
    }

    baseDayName(dayKey) {
        return this.constructor.baseDayName(dayKey)
    }

    renderTitle() {
        return html`${t`Opening Hours`}`
    }

    renderDayAction(day) {
        if (this.isAdditionalHours(day)) {
            return html`
                <qrcg-button
                    transparent
                    class="action remove-hours"
                    day-name=${day}
                >
                    <qrcg-icon mdi-icon=${mdiMinusThick}></qrcg-icon>
                </qrcg-button>
            `
        }

        return html`
            <qrcg-button transparent class="action add-hours" day-name=${day}>
                <qrcg-icon mdi-icon=${mdiPlusCircle}></qrcg-icon>
            </qrcg-button>
        `
    }

    renderRow(day) {
        return html`
            <div class="day-row" day-name=${day}>
                <div class="name">
                    <qrcg-checkbox
                        name="enabled"
                        class=${this.isAdditionalHours(day)
                            ? 'additional-hours'
                            : ''}
                    >
                        ${t(this.baseDayName(day))}
                    </qrcg-checkbox>
                </div>

                <qrcg-input name="from" placeholder="${t`From`}"></qrcg-input>

                <qrcg-input name="to" placeholder="${t`To`}"></qrcg-input>

                ${this.renderDayAction(day)}
            </div>
        `
    }

    renderBody() {
        return html`
            <div class="content-view">
                ${this.days.map((day) => {
                    return this.renderRow(day)
                })}
            </div>
        `
    }
}
window.defineCustomElement('qrcg-business-hours-modal', QrcgBusinessHoursModal)
