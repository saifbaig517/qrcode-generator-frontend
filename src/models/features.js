import { t } from '../core/translate'
import { advancedShapes } from './advanced-shapes'
import { qrShapes } from './qr-shapes'

const features = [
    {
        name: t`Copy QR Code`,
        value: 'qrcode.copy',
    },
    {
        name: t`QR Code Logo`,
        value: 'qrcode.logo',
    },
    {
        name: t`Remove Powered By`,
        value: 'qrcode.remove_powered_by',
    },
    {
        name: t`Color Customization`,
        value: 'qrcode.color_customization',
    },
    {
        name: t`Lead Form in vCard+`,
        value: 'vcard-plus.lead-form',
    },
    {
        name: t`Hide Subscription Details Section (Account Page)`,
        value: 'account.hide-subscription-details-section',
    },
    {
        name: t`Hide Custom Code Input`,
        value: 'designer.hide-custom-code-input',
    },
    {
        name: t`Bulk QR Code Creation`,
        value: 'bulk-qrcode-creation',
    },
]

export function getFeatures() {
    return [
        ...features,
        ...qrShapes.map((shape) => ({
            name: t`Shape: ` + shape.name,
            value: 'shape.' + shape.value,
        })),
        ...advancedShapes.map((shape) => ({
            name: t`Sticker: ` + shape.name,
            value: 'advancedShape.' + shape.value,
        })),
    ]
}
