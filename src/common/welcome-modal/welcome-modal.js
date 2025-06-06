import style from './welcome-modal.scss?inline'

import { QrcgModal } from '../../ui/qrcg-modal'
import { Config } from '../../core/qrcg-config'
import { isClient } from '../../core/auth'

import { unsafeStatic, html } from 'lit/static-html.js'
import { mdiCloseThick } from '@mdi/js'

export class WelcomeModal extends QrcgModal {
    static tag = 'qrcg-dashboard-welcome-modal'

    static styleSheets = [...super.styleSheets, style]

    static set showTimes(v) {
        localStorage.__dashboard_welcome_modal_show_times__ = JSON.stringify(v)
    }

    static get showTimes() {
        const value = +localStorage.__dashboard_welcome_modal_show_times__

        if (isNaN(value)) {
            return 0
        }

        return value
    }

    static didShowTimesExceeded() {
        const number = Config.get('dashboard.welcome_modal_show_times')

        if (number && !isNaN(number)) {
            return this.showTimes > number
        }

        this.showTimes++

        return false
    }

    static openIfNeeded() {
        if (Config.get('dashboard.welcome_popup_enabled') !== 'enabled') {
            return
        }

        if (!isClient()) {
            return
        }

        if (this.didShowInCurrentSession) {
            return
        }

        if (this.didShowTimesExceeded()) {
            return
        }

        this.didShowInCurrentSession = true

        this.open()
    }

    renderVideo() {
        const url = Config.get('dashboard.welcome_modal_video_url')

        if (!url) return

        return html`
            <video controls>
                <source src="${url}" />
            </video>
        `
    }

    renderBody() {
        const raw = Config.get('dashboard.welcome_modal_text')

        return html`
            <div>${this.renderVideo()}</div>
            <!--  -->
            <div class="raw-content">${unsafeStatic(raw)}</div>
        `
    }

    renderActions() {}

    getCloseIcon() {
        return mdiCloseThick
    }
}

WelcomeModal.register()
