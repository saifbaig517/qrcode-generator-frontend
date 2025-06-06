import { css, html, LitElement } from 'lit'

import '../ui/qrcg-loader'

import './reports/qrcg-qrcode-scans-per-operating-system'
import './reports/qrcg-qrcode-scans-per-day'
import './reports/qrcg-qrcode-scans-per-device-brand'
import './reports/qrcg-qrcode-scans-per-country'
import './reports/qrcg-qrcode-scans-per-city'
import './reports/qrcg-qrcode-scans-per-hour'

import { QRCGRouteParamsController } from '../core/qrcg-route-params-controller'
import { get } from '../core/api'
import { classMap } from 'lit/directives/class-map.js'
import { isEmpty, parentMatches, url } from '../core/helpers'
import { mdiLinkVariant } from '@mdi/js'
import { t } from '../core/translate'
import { QrcgDashboardBreadcrumbs } from '../dashboard/qrcg-dashboard-breadcrumbs'
import { QrcgQrcodeStatsDateRangeModal } from './qrcg-qrcode-stats-date-range-modal'

export class QrcgQrcodeStats extends LitElement {
    routeParams = new QRCGRouteParamsController(this)

    static get styles() {
        return css`
            :host {
                display: block;
                box-sizing: border-box;
            }

            * {
                box-sizing: border-box;
                user-select: none;
                -webkit-user-select: none;
            }

            .qrcode-name {
                margin: 0;
                color: var(--gray-2);

                font-weight: 500;
                opacity: 0;
                transition: all ease 0.5s;
                display: flex;
                align-items: center;
            }

            .qrcode-name span {
                max-width: 25rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            @media (max-width: 450px) {
                .qrcode-name span {
                    max-width: 15rem;
                }
            }

            .qrcode-link {
                color: var(--gray-2);
                margin-left: 1rem;
                transform: translateY(0.15rem);
            }

            .qrcode-link qrcg-icon {
                width: 1.5rem;
                height: 1.5rem;
            }

            .qrcode-name.loaded {
                opacity: 1;
            }

            .reports {
                display: grid;
                grid-template-columns: 100%;
                grid-gap: 1rem;
            }

            header {
                margin-bottom: 2rem;
                position: relative;
            }

            @media (min-width: 900px) {
                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                }
            }

            .date-range-container {
                margin-top: 1rem;
                display: flex;
                padding: 0.1rem;
            }

            .date-range {
                position: relative;
            }

            @media (max-width: 450px) {
                .date-range:nth-child(2) {
                    display: none;
                }
            }

            @media (max-width: 900px) {
                .date-range:nth-child(3) {
                    display: none;
                }
            }

            .date-range:not(:first-child) {
                margin-left: 1rem;
            }

            .date-range.active::after {
                content: ' ';
                position: absolute;
                height: 0.25rem;
                background-color: var(--primary-0);
                left: 0;
                right: 0;
                bottom: 0rem;
                border-bottom-left-radius: 0.5rem;
                border-bottom-right-radius: 0.5rem;
                pointer-events: none;
                animation: fade-in 0.3s ease-in both;
            }

            .custom-date-range {
                position: absolute;
                color: black;
                bottom: -1.5rem;
                font-size: 1rem;
                font-weight: 400;
                right: 0;
                animation: fade-in 0.3s 0.3s ease-in both;
                color: var(--gray-2);
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @media (min-width: 900px) {
                .reports {
                    grid-template-columns: calc(50% - 0.5rem) calc(50% - 0.5rem);
                }
            }
        `
    }

    static get properties() {
        return {
            qrcode: { type: Object },
            selectedDateRange: {},
            from: {},
            to: {},
            shouldShowCustomDateRangeText: { type: Boolean },
            endpoint: {},
        }
    }

    constructor() {
        super()

        this.days = [15, 30, 90, 'Custom']

        /**
         * @property number of days or "custom" for custom range
         * @type number|string
         * */
        this.selectedDateRange = 15

        this.syncDates()

        this.shouldShowCustomDateRangeText = false
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetch()
        this.updateBreadcrumbs()
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        const node = e.composedPath()[0]

        if (parentMatches(node, '.date-range')) {
            this.onDateRangeClick(e)
        }
    }

    updated(changed) {
        if (changed.has('from') || changed.has('to')) {
            this.updateReportsDates()
        }
    }

    onDateRangeClick(e) {
        const button = parentMatches(e.composedPath()[0], '.date-range')

        this.selectedDateRange = button.day

        this.syncDates()

        this.hideCustomDateRangeTextIfNeeded()

        if (this.selectedDateRange == 'custom') {
            this.onCustomDateRangeClick()
        }
    }

    hideCustomDateRangeTextIfNeeded() {
        if (this.selectedDateRange != 'custom') {
            this.shouldShowCustomDateRangeText = false
        }
    }

    async onCustomDateRangeClick() {
        try {
            const { from, to } = await QrcgQrcodeStatsDateRangeModal.open(
                this.from,
                this.to
            )

            this.from = from

            this.to = to

            this.shouldShowCustomDateRangeText = true
        } catch (error) {
            //
        }
    }

    syncDates() {
        if (typeof this.selectedDateRange == 'string') return

        const now = new Date()

        let daysAgo = new Date()

        daysAgo.setDate(now.getDate() - this.selectedDateRange)

        this.from = this.formatDate(daysAgo)

        this.to = this.formatDate(now)
    }

    formatDate(date) {
        return date.toLocaleDateString([['sv-SE']])
    }

    updateReportsDates() {
        this.reports.forEach((report) => {
            report.to = this.to
            report.from = this.from
        })
    }

    updateBreadcrumbs() {
        const links = QrcgDashboardBreadcrumbs.buildBreadcrumbFromCurrentPath()

        links.pop()

        links[links.length - 2] = {
            ...links[links.length - 2],
            text: t`QR Codes`,
        }

        QrcgDashboardBreadcrumbs.setLinks(links)
    }

    getRouteQRCodeId() {
        const parts = window.location.pathname.split('/')

        return parts[parts.length - 1]
    }

    getEndpoint() {
        return 'qrcodes/' + this.getRouteQRCodeId()
    }

    async fetch() {
        const { response } = await get(this.getEndpoint())

        this.qrcode = await response.json()
    }

    /**
     * @type Array<QrcgQrcodeBaseReport>
     */
    get reports() {
        return this.shadowRoot.querySelectorAll('.reports > *')
    }

    renderLinkIcon() {
        if (isEmpty(this.qrcode)) {
            return
        }

        return html`
            <a
                href="${url('/dashboard/qrcodes/edit/' + this.qrcode.id)}"
                class="qrcode-link"
                title="${t`Edit`}"
            >
                <qrcg-icon mdi-icon=${mdiLinkVariant}></qrcg-icon>
            </a>
        `
    }

    renderQrCodeName() {
        const name = isEmpty(this.qrcode) ? 'qrcode name' : this.qrcode.name

        return html`
            <slot name="qrcode-name">
                <h2
                    class="${classMap({
                        'qrcode-name': true,
                        loaded: !isEmpty(this.qrcode),
                    })}"
                >
                    <span title=${name}> ${name} </span>
                    ${this.renderLinkIcon()}
                </h2>
            </slot>
        `
    }

    renderDateRangeButton(day) {
        let $class = 'date-range'

        if (day == this.selectedDateRange) {
            $class += ' active'
        }

        if (typeof day == 'string') {
            $class =
                day.toLowerCase() === this.selectedDateRange
                    ? `${$class} active`
                    : $class
        }

        if (typeof day == 'number') {
            return html`
                <qrcg-button transparent class="${$class}" .day=${day}>
                    ${t`Last`} ${day} ${t`days`}
                </qrcg-button>
            `
        }

        return html`
            <qrcg-button
                transparent
                class="${$class}"
                .day=${day.toLowerCase()}
            >
                ${t(day)}
            </qrcg-button>
        `
    }

    renderDateRanges() {
        return html`
            <div class="date-range-container">
                ${this.days.map((day) => {
                    return this.renderDateRangeButton(day)
                })}
                ${this.renderCustomDateRange()}
            </div>
        `
    }

    renderCustomDateRange() {
        if (!this.shouldShowCustomDateRangeText) return

        return html`
            <div class="custom-date-range">
                ${t`From`} <strong>${this.from}</strong> ${t`to`}
                <strong>${this.to}</strong>
            </div>
        `
    }

    render() {
        return html`
            <header>
                ${this.renderQrCodeName()} ${this.renderDateRanges()}
            </header>

            <div class="reports">
                <qrcg-qrcode-scans-per-day></qrcg-qrcode-scans-per-day>
                <qrcg-qrcode-scans-per-hour></qrcg-qrcode-scans-per-hour>
                <qrcg-qrcode-scans-per-operating-system></qrcg-qrcode-scans-per-operating-system>
                <qrcg-qrcode-scans-per-device-brand></qrcg-qrcode-scans-per-device-brand>
                <qrcg-qrcode-scans-per-country></qrcg-qrcode-scans-per-country>
                <qrcg-qrcode-scans-per-city></qrcg-qrcode-scans-per-city>
            </div>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-stats', QrcgQrcodeStats)
