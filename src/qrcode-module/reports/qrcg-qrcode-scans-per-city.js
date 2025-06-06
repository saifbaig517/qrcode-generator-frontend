import { QrcgQrcodeBaseReport } from './base-report'

import '../../ui/qrcg-chart/qrcg-chart-horizontal-bar-chart'

import { t } from '../../core/translate'

export class QrcgQrcodeScansPerCity extends QrcgQrcodeBaseReport {
    slug() {
        return 'scans-per-city'
    }

    chartTag() {
        return 'qrcg-chart-horizontal-bar-chart'
    }

    chartTitle() {
        return t`Cities`
    }

    mapChartDataItem(item) {
        return {
            number: item.scans,
            label: item.city.replace('"', ' ').replace("'", ' '),
        }
    }
}

window.defineCustomElement('qrcg-qrcode-scans-per-city', QrcgQrcodeScansPerCity)
