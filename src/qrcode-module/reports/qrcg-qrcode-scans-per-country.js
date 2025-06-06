import { QrcgQrcodeBaseReport } from './base-report'

import '../../ui/qrcg-chart/qrcg-chart-horizontal-bar-chart'

import { t } from '../../core/translate'

export class QrcgQrcodeScansPerCountry extends QrcgQrcodeBaseReport {
    slug() {
        return 'scans-per-country'
    }

    chartTag() {
        return 'qrcg-chart-horizontal-bar-chart'
    }

    chartTitle() {
        return t`Countries`
    }

    mapChartDataItem(item) {
        return {
            number: item.scans,
            label: item.country,
        }
    }
}

window.defineCustomElement(
    'qrcg-qrcode-scans-per-country',
    QrcgQrcodeScansPerCountry
)
