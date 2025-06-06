import style from './dashboard-banner.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { Config } from '../../core/qrcg-config'
import { isEmpty } from '../../core/helpers'
import { unsafeStatic, html } from 'lit/static-html.js'

export class DashboardBanner extends BaseComponent {
    static tag = 'qrcg-dashboard-banner'

    static styleSheets = [...super.styleSheets, style]

    firstUpdated() {
        super.firstUpdated()

        this.style.setProperty(
            '--text-color',
            Config.get('dashboard.top_banner_text_color') ?? 'white'
        )

        this.style.setProperty(
            '--banner-height',
            Config.get('dashboard.top_banner_height') ?? '10rem'
        )
    }

    shouldRender() {
        return this.getType() !== 'no_banner'
    }

    isEnabled() {
        return this.getType() !== 'no_banner'
    }

    getType() {
        return Config.get('dashboard.top_banner_option') ?? 'no_banner'
    }

    raw(content) {
        return html`${unsafeStatic(content)}`
    }

    getSubtitle() {
        return this.raw(Config.get('dashboard.top_banner_subtitle'))
    }

    getTitle() {
        const value = this.raw(Config.get('dashboard.top_banner_title'))
        return value ?? ''
    }

    renderSubtitle() {
        if (isEmpty(this.getSubtitle())) {
            return
        }

        return html` <div class="subtitle">${this.getSubtitle()}</div> `
    }

    renderTitle() {
        if (isEmpty(this.getTitle())) {
            return
        }

        return html` <div class="title">${this.getTitle()}</div> `
    }

    renderBackgroundImage() {
        if (this.getType() !== 'image') {
            return
        }

        const url = Config.get('dashboard.top_banner_image_url')

        return html`
            <div class="background-image" style="background-image: url(${url})">
                ${this.renderTitle()}
                <!--  -->
                ${this.renderSubtitle()}
            </div>
        `
    }

    renderBackgroundVideo() {
        if (this.getType() !== 'video') {
            return
        }

        const url = Config.get('dashboard.top_banner_video_url')

        return html`
            <div class="background-video-container">
                <video muted autoplay loop inline>
                    <source src=${url} type="video/mp4" />
                </video>

                ${this.renderTitle()}
                <!--  -->
                ${this.renderSubtitle()}
            </div>
        `
    }

    render() {
        if (!this.isEnabled()) {
            return
        }

        return html`
            <div class="container">
                <!--  -->
                ${this.renderBackgroundImage()}

                <!--  -->

                ${this.renderBackgroundVideo()}
            </div>
        `
    }
}

DashboardBanner.register()
