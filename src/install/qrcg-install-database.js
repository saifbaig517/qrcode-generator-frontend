import { QRCGInstallPage } from './qrcg-install-page'

export class QrcgInstallDatabase extends QRCGInstallPage {
    renderTitle() {
        return 'MySQL Database'
    }

    getBackLink() {
        return '/install/app-details'
    }

    getNextLink() {
        return '/install/super-user'
    }

    verifyLink() {
        return 'install/verify-database'
    }

    verificationFailedMessage() {
        return 'Cannot connect to databse server...'
    }

    verificationSuccessMessage() {
        return 'Database connection works...'
    }

    doNotRequireFields() {
        return 'DB_PASSWORD'
    }

    envVariables() {
        return [
            { key: 'DB_HOST', name: 'Database Host' },
            { key: 'DB_PORT', name: 'Database Port' },
            {
                key: 'DB_DATABASE',
                name: 'Database Name',
            },
            {
                key: 'DB_USERNAME',
                name: 'Database Username',
                placeholder: 'Priviliged user',
            },
            {
                key: 'DB_PASSWORD',
                name: 'Database User Password',
                type: 'password',
                placeholder: '',
            },
        ]
    }
}

window.defineCustomElement('qrcg-install-database', QrcgInstallDatabase)
