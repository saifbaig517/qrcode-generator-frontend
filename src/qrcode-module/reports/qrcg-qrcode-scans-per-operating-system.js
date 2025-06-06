import { QrcgQrcodeBaseReport } from './base-report'

import '../../ui/qrcg-chart/qrcg-chart-horizontal-bar-chart'

import { t } from '../../core/translate'

export class QrcgQrcodeScansPerOperatingSystem extends QrcgQrcodeBaseReport {
    slug() {
        return 'scans-per-operating-system'
    }

    chartTag() {
        return 'qrcg-chart-horizontal-bar-chart'
    }

    chartTitle() {
        return t`Operating Systems`
    }

    mapChartDataItem(item) {
        return {
            number: item.scans,
            label: item.os_name,
        }
    }
}

window.defineCustomElement(
    'qrcg-qrcode-scans-per-operating-system',
    QrcgQrcodeScansPerOperatingSystem
)
