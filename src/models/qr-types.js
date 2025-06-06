import {
    mdiBitcoin,
    mdiCallMade,
    mdiCellphone,
    mdiContactlessPayment,
    mdiContacts,
    mdiEmailFastOutline,
    mdiFile,
    mdiFileUpload,
    mdiGoogle,
    mdiLinkVariant,
    mdiMenu,
    mdiMessageProcessing,
    mdiPhone,
    mdiPin,
    mdiSmartCard,
    mdiStar,
    mdiTextBoxOutline,
    mdiWeb,
    mdiWhatsapp,
    mdiWifi,
} from '@mdi/js'

import { isArray, isEmpty, parseNumberValue } from '../core/helpers'

import { Config } from '../core/qrcg-config'
import {
    BRAZILPIX,
    CALL,
    CRYPTO,
    EMAIL,
    EVENT_ICON,
    FACEBOOK_MESSENGER,
    FACETIME,
    LOCATION_ICON,
    PAYPAL,
    SKYPE,
    SMS,
    TELEGRAM,
    TEXT,
    URL_ICON,
    VCARD,
    VIBER,
    WHATSAPP,
    WIFI,
    ZOOM,
} from '../ui/svg-icons'
import { PluginManager } from '../../plugins/plugin-manager'
import { FILTER_QRCODE_TYPES } from '../../plugins/plugin-filters'

export const qrTypes = [
    {
        id: 'url',
        name: 'Dynamic URL',
        cat: 'dynamic',
        icon: mdiLinkVariant,
        svgIcon: URL_ICON,
    },
    {
        id: 'biolinks',
        name: 'Bio Links (List of Links)',
        cat: 'dynamic',
        icon: mdiMenu,
    },
    {
        id: 'business-profile',
        name: 'Business Profile',
        cat: 'dynamic',
        icon: mdiContacts,
    },
    {
        id: 'business-review',
        name: 'Business Review',
        cat: 'dynamic',
        icon: mdiStar,
    },
    {
        id: 'website-builder',
        name: 'Website Builder',
        cat: 'dynamic',
        icon: mdiWeb,
    },
    {
        id: 'vcard-plus',
        name: 'vCard Plus',
        cat: 'dynamic',
        icon: mdiContacts,
    },
    {
        id: 'lead-form',
        name: 'Lead Form',
        cat: 'dynamic',
        icon: mdiMenu,
    },
    {
        id: 'restaurant-menu',
        name: 'Restaurant Menu',
        cat: 'dynamic',
        icon: mdiMenu,
    },
    {
        id: 'product-catalogue',
        name: 'Product Catalogue',
        cat: 'dynamic',
        icon: mdiMenu,
    },
    {
        id: 'app-download',
        name: 'App Download',
        cat: 'dynamic',
        icon: mdiCellphone,
    },
    {
        id: 'google-review',
        name: 'Google Review',
        cat: 'dynamic',
        icon: mdiGoogle,
    },
    {
        id: 'resume',
        name: 'Resume QR Code',
        cat: 'dynamic',
        icon: mdiFile,
    },
    {
        id: 'file-upload',
        name: 'File Upload',
        cat: 'dynamic',
        icon: mdiFileUpload,
    },
    {
        id: 'event',
        name: 'Event',
        cat: 'dynamic',
        svgIcon: EVENT_ICON,
    },
    {
        id: 'text',
        name: 'Static Text / URL',
        cat: 'static',
        icon: mdiTextBoxOutline,
        svgIcon: TEXT,
    },
    {
        id: 'vcard',
        name: 'VCard',
        cat: 'static',
        icon: mdiSmartCard,
        svgIcon: VCARD,
    },
    {
        id: 'email-dynamic',
        name: 'Email (Dynamic)',
        cat: 'dynamic',
        icon: mdiEmailFastOutline,
        svgIcon: EMAIL,
    },
    {
        id: 'email',
        name: 'Email (Static)',
        cat: 'static',
        icon: mdiEmailFastOutline,
        svgIcon: EMAIL,
    },
    {
        id: 'sms',
        name: 'SMS (Static)',
        cat: 'static',
        icon: mdiMessageProcessing,
        svgIcon: SMS,
    },
    {
        id: 'sms-dynamic',
        name: 'SMS (Dynamic)',
        cat: 'dynamic',
        icon: mdiMessageProcessing,
        svgIcon: SMS,
    },
    {
        id: 'call',
        name: 'Call',
        cat: 'static',
        icon: mdiPhone,
        svgIcon: CALL,
    },
    {
        id: 'wifi',
        name: 'WIFI',
        cat: 'static',
        icon: mdiWifi,
        svgIcon: WIFI,
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        cat: 'dynamic',
        icon: mdiWhatsapp,
        svgIcon: WHATSAPP,
    },
    {
        id: 'facetime',
        name: 'FaceTime',
        cat: 'static',
        icon: mdiCallMade,
        svgIcon: FACETIME,
    },
    {
        id: 'location',
        name: 'Location',
        cat: 'static',
        icon: mdiPin,
        svgIcon: LOCATION_ICON,
    },
    {
        id: 'crypto',
        name: 'Crypto',
        cat: 'static',
        icon: mdiBitcoin,
        svgIcon: CRYPTO,
    },
    {
        id: 'paypal',
        name: 'PayPal',
        cat: 'dynamic',
        icon: mdiContactlessPayment,
        svgIcon: PAYPAL,
    },
    {
        id: 'upi',
        name: 'UPI (Static)',
        cat: 'static',
        icon: mdiContactlessPayment,
    },
    {
        id: 'upi-dynamic',
        name: 'UPI (Dynamic)',
        cat: 'dynamic',
        icon: mdiContactlessPayment,
    },
    {
        id: 'zoom',
        name: 'Zoom',
        cat: 'static',
        icon: mdiPhone,
        svgIcon: ZOOM,
    },
    {
        id: 'skype',
        name: 'Skype',
        cat: 'static',
        icon: mdiPhone,
        svgIcon: SKYPE,
    },
    {
        id: 'brazilpix',
        name: 'Brazillian PIX',
        cat: 'static',
        icon: mdiContactlessPayment,
        svgIcon: BRAZILPIX,
    },
    {
        id: 'telegram',
        name: 'Telegram',
        cat: 'static',
        icon: mdiMessageProcessing,
        svgIcon: TELEGRAM,
    },
    {
        id: 'facebookmessenger',
        name: 'Messenger',
        cat: 'static',
        icon: mdiMessageProcessing,
        svgIcon: FACEBOOK_MESSENGER,
    },
    {
        id: 'viber',
        name: 'Viber Chat',
        cat: 'static',
        icon: mdiMessageProcessing,
        svgIcon: VIBER,
    },
]

export function getAvailableQrCodeTypes() {
    const manager = new QRCodeTypeManager()

    return manager.getAvailableQrCodeTypes()
}

export class QRCodeTypeManager {
    static filters = []

    static registerFilter(fl) {
        this.filters.push(fl)
    }

    getAvailableQrCodeTypes() {
        const availableTypes = Config.get('app.available_qrcode_types')

        let result = qrTypes

        if (isArray(availableTypes) && !isEmpty(availableTypes)) {
            result = result.filter((type) =>
                availableTypes.find((id) => id == type.id)
            )
        }

        result = this.executeFilters(result)

        result = PluginManager.applyFilters(FILTER_QRCODE_TYPES, result)

        return this.sortQrCodeTypes(result)
    }

    find(slug) {
        return this.getAvailableQrCodeTypes().find((type) => type.id === slug)
    }

    executeFilters(types) {
        for (const filter of this.constructor.filters) {
            types = types.filter(filter)
        }

        return types
    }

    sortQrCodeTypes(types) {
        const sortOrder = (t) => {
            try {
                const s = window.QRCG_QR_TYPES_SORT_ORDER.find(
                    (tt) => tt.slug == t.id
                )['sort_order']

                return parseNumberValue(s, 200)
            } catch {
                return 0
            }
        }

        types.sort(function (a, b) {
            return sortOrder(a) - sortOrder(b)
        })

        return types
    }

    getDynamicTypes() {
        const availableTypes = this.getAvailableQrCodeTypes()

        return availableTypes.filter((t) => t.cat == 'dynamic')
    }

    getDynamicSlugs() {
        return this.getDynamicTypes().map((t) => t.id)
    }

    isDynamic(slug) {
        return !!this.getDynamicTypes().find((t) => t.id === slug)
    }
}
