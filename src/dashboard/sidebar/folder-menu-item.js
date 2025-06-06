import { LitElement, html, css } from 'lit'
import { QrcgDashboardSidebarMenuStore } from './menu-store'

export class QrcgDashboardSidebarFolderMenuItem extends LitElement {
    menuStore = new QrcgDashboardSidebarMenuStore()

    static styles = [
        css`
            :host {
                display: block;
                position: relative;
            }

            .container {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .folder-name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 1rem;
            }

            .badge {
                font-size: 0.8rem;

                color: white;
                width: 2rem;
                box-shadow: 0px 0px 0 0.25rem white;
                border-radius: 1rem;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: white;
                color: black;
                text-align: center;
            }

            :host(.active) .badge,
            :host(:hover) .badge {
                box-shadow: 0px 0px 0 0.25rem var(--primary-0);
                background-color: var(--primary-0);
                color: white;
            }

            a {
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        `,
    ]

    static get properties() {
        return {
            item: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )
    }

    onLocationChanged = () => {
        this.syncActiveClass()
    }

    updated() {
        this.syncActiveClass()
    }

    syncActiveClass() {
        if (this.item.isActive()) {
            this.classList.add('active')
        } else {
            this.classList.remove('active')
        }
    }

    render() {
        return html`
            <a href="${this.item.link}"></a>
            <div class="container">
                <div class="folder-name">${this.item.label}</div>

                <div>
                    <div class="badge">${this.item.data.qrcode_count}</div>
                </div>
            </div>
        `
    }
}

window.defineCustomElement(
    'qrcg-dashboard-sidebar-folder-menu-item',
    QrcgDashboardSidebarFolderMenuItem
)
