import { isEmpty } from './helpers'

import { Config } from './qrcg-config'

import { runningSSR } from './qrcg-router'

export class QRCGTitleController {
    host

    static instances = []

    constructor(host) {
        this.host = host

        host.addController(this)

        this.onTitleChange = this.onTitleChange.bind(this)
    }

    static async boot() {
        while (!document.head) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        if (runningSSR()) return

        document.head.querySelector('title').innerHTML = Config.get('app.name')
    }

    hostConnected() {
        document.addEventListener('qrcg-title:change', this.onTitleChange)
        this.constructor.instances.push(this)
    }

    hostDisconnected() {
        document.removeEventListener('qrcg-title:change', this.onTitleChange)

        this.constructor.instances = this.constructor.instances.filter(
            (i) => i !== this
        )

        this.host = null
    }

    onTitleChange() {
        this.host.updateComplete.then(() => {
            this.host?.requestUpdate()
        })
    }

    get pageTitle() {
        return document
            .querySelector('title')
            .innerHTML.replace(` | ${Config.get('app.name')}`, '')
    }

    set pageTitle(title) {
        if (isEmpty(title)) return

        document.querySelector('title').innerHTML = `${title} | ${Config.get(
            'app.name'
        )}`

        document.dispatchEvent(new CustomEvent('qrcg-title:change'))

        this.constructor.updateAllInstances()
    }

    static updateAllInstances() {
        this.instances.forEach((i) => {
            if (i.host)
                i.host.updateComplete.then(() => {
                    i.host?.requestUpdate()
                })
        })
    }
}

QRCGTitleController.boot()
