import { QRCGInstallPage } from './qrcg-install-page'

export class QrcgInstallAppDetails extends QRCGInstallPage {
    renderTitle() {
        return 'App Customisation'
    }

    getBackLink() {
        return '/install/purchase-code'
    }

    getNextLink() {
        return '/install/database'
    }

    renderHelp() {
        return `App name and slogan will be used in the frontend header.`
    }

    envVariables() {
        return [
            { key: 'APP_NAME', name: 'App Name' },
            {
                key: 'APP_SLOGAN',
                name: 'App Slogan',
            },
        ]
    }
}

window.defineCustomElement('qrcg-install-app-details', QrcgInstallAppDetails)
