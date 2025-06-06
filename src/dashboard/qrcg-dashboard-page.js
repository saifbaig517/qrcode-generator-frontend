import { QRCGTitleController } from '../core/qrcg-title-controller'

import { QrcgDashboardBreadcrumbs } from '../dashboard/qrcg-dashboard-breadcrumbs'

import './qrcg-dashboard-layout'

import { unsafeStatic, html } from 'lit/static-html.js'
import { BaseComponent } from '../core/base-component/base-component'

export class QrcgDashboardPage extends BaseComponent {
    titleController = new QRCGTitleController(this)

    connectedCallback() {
        super.connectedCallback()

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        this.updateNavigation()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        this.titleController = null
    }

    pageTitle() {
        return 'Default title'
    }

    updateTitle() {
        if (this.titleController)
            this.titleController.pageTitle = this.pageTitle()
    }

    breadcrumbs() {
        const pathLinks =
            QrcgDashboardBreadcrumbs.buildBreadcrumbFromCurrentPath()

        return pathLinks
    }

    updateBreadcumbs() {
        if (!this.breadcrumbs()) return

        QrcgDashboardBreadcrumbs.setLinks(this.breadcrumbs())
    }

    onLocationChanged = async () => {
        await new Promise((resolve) => setTimeout(resolve, 0))

        this.updateNavigation()
    }

    updateNavigation = () => {
        this.updateTitle()
        this.updateBreadcumbs()
    }

    renderBeforeContent() {}

    renderContent() {}

    renderTitle() {
        return unsafeStatic(this.titleController.pageTitle)
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title"> ${this.renderTitle()} </span>

                ${this.renderBeforeContent()}

                <div slot="content">${this.renderContent()}</div>
            </qrcg-dashboard-layout>
        `
    }
}
