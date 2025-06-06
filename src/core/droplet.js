import { QRCodeTypeManager as Manager } from '../models/qr-types'
import { Config } from './qrcg-config'

export class Droplet {
    static boot() {
        const instance = new Droplet()

        Manager.registerFilter(instance.filterQRCTItems)
    }

    filterQRCTItems = (t) => {
        const largeTs = [
            // b-p
            'YnVzaW5lc3MtcHJvZmlsZQ==',
            // v-p
            'dmNhcmQtcGx1cw==',
            // r-m
            'cmVzdGF1cmFudC1tZW51',
            // p-c
            'cHJvZHVjdC1jYXRhbG9ndWU=',
            // b-l
            'YmlvbGlua3M=',
            // l-f
            'bGVhZC1mb3Jt',
            // r
            'cmVzdW1l',
            // f-u
            'ZmlsZS11cGxvYWQ=',
            // a-d
            'YXBwLWRvd25sb2Fk',
            // w-b
            'd2Vic2l0ZS1idWlsZGVy',
            // b-r
            'YnVzaW5lc3MtcmV2aWV3',
            // u-d
            'dXBpLWR5YW5taWM=',
        ]

        const isLarge = largeTs.find((slug) => {
            return t.id == this.bd(slug)
        })

        if (isLarge) {
            return this.isLarge()
        }

        return true
    }

    isLarge() {
        return Config.get('droplet.is_large', Boolean)
    }

    isSmall() {
        return !this.isLarge()
    }

    bd(a) {
        let n = 'WSSFaOPWIEURXtXFALHQWEROUIoASDFbDSAFCCSS'

        n = n.replace(/[A-Z]/g, '')

        return window[n](a)
    }
}

Droplet.boot()
