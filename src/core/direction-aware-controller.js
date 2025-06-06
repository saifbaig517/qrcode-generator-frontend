import { ConfigHelper } from './config-helper'

export class DirectionAwareController {
    constructor(host) {
        this.host = host

        host.addController(this)
    }

    hostConnected() {
        if (!ConfigHelper.dir()) return

        this.host.classList.add('dir-' + ConfigHelper.dir())
    }

    get rtl() {
        return ConfigHelper.dir() === 'rtl'
    }
}
