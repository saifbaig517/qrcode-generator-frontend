import { t } from '../core/translate'

export class PluginModel {
    name
    description
    tags
    slug
    price = null

    constructor(name, description, tags, slug, price) {
        this.name = name
        this.description = description
        this.tags = tags
        this.slug = slug
        this.price = price
    }
}

export class AvailablePlugins {
    static list() {
        return [
            new PluginModel(
                t`Affiliates & Coupons`,
                t`Essential marketing tools, allowing you to create coupons and referral program. Compatible with Quick Code v2.33 and above.`,
                ['marketing', 'coupons', 'affiliates'],
                'affiliatescoupons',
                '$45 / one time'
            ),
            new PluginModel(
                t`Pre Printed QR Codes`,
                t`Generate thousands of self-activating QR codes to sell in Amazon as NFC tags or QR Codes. Compatible with Quick Code v2.75 and above.`,
                ['amazon', 'bulk-creation'],
                'preprintedqrcodes',
                '$300 / one time'
            ),
        ]
    }
}
