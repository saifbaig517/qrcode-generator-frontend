import { QRCGInstallPage } from './qrcg-install-page'

export class QrcgInstallSuperUser extends QRCGInstallPage {
    renderTitle() {
        return 'Super User'
    }

    getBackLink() {
        return '/install/database'
    }

    getNextLink() {
        return '/install/mail'
    }

    envVariables() {
        return [
            { key: 'SUPER_USER_NAME', name: 'Name' },
            { key: 'SUPER_USER_EMAIL', name: 'Email' },
            { key: 'SUPER_USER_PASSWORD', name: 'Password', type: 'password' },
        ]
    }
}

window.defineCustomElement('qrcg-install-super-user', QrcgInstallSuperUser)
