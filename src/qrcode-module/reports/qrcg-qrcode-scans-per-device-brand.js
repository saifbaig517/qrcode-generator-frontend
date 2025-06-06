import { QrcgQrcodeBaseReport } from './base-report'

import '../../ui/qrcg-chart/qrcg-chart-horizontal-bar-chart'

import { t } from '../../core/translate'

export class QrcgQrcodeScansPerDeviceBrand extends QrcgQrcodeBaseReport {
    slug() {
        return 'scans-per-device-brand'
    }

    chartTag() {
        return 'qrcg-chart-horizontal-bar-chart'
    }

    chartTitle() {
        return t`Device Brands`
    }

    mapChartDataItem(item) {
        return {
            number: item.scans,
            label: item.device_brand,
        }
    }
}

window.defineCustomElement(
    'qrcg-qrcode-scans-per-device-brand',
    QrcgQrcodeScansPerDeviceBrand
)
