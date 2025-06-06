import { QrcgQrcodeBaseReport } from './base-report'

import '../../ui/qrcg-chart/qrcg-chart-line-chart'

import { t } from '../../core/translate'

export class QrcgQrcodeScansPerDay extends QrcgQrcodeBaseReport {
    slug() {
        return 'scans-per-day'
    }

    chartTag() {
        return 'qrcg-chart-line-chart'
    }

    chartTitle() {
        return t`Daily Scans`
    }

    mapChartDataItem(item) {
        return {
            label: item.date,
            number: item.scans,
        }
    }
}

window.defineCustomElement('qrcg-qrcode-scans-per-day', QrcgQrcodeScansPerDay)
