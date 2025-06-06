import { html } from 'lit'
import { t } from '../../core/translate'

export class BackgroundFields {
    host

    constructor(host) {
        this.host = host

        host.addController(this)
    }

    hostDisconnected() {
        this.host = null
    }

    render() {
        if (this.host.isAiDesign()) return

        return html`
            <label>${t`Background`}</label>

            <qrcg-checkbox name="backgroundEnabled">
                ${t`Enabled`}
            </qrcg-checkbox>

            <label>${t`Background color`}</label>

            <qrcg-color-picker name="backgroundColor"></qrcg-color-picker>
        `
    }
}
