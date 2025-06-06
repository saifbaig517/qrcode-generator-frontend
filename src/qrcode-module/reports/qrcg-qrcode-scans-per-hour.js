import { QrcgQrcodeBaseReport } from './base-report'

import '../../ui/qrcg-chart/qrcg-chart-horizontal-bar-chart'

import { t } from '../../core/translate'

export class QrcgQrcodeScansPerHour extends QrcgQrcodeBaseReport {
    slug() {
        return 'scans-per-hour'
    }

    chartTag() {
        return 'qrcg-chart-line-chart'
    }

    chartTitle() {
        return t`Hour of the day`
    }

    mapChartDataItem(item) {
        return {
            number: item.scans,
            label: item.hour,
        }
    }
}

window.defineCustomElement('qrcg-qrcode-scans-per-hour', QrcgQrcodeScansPerHour)
