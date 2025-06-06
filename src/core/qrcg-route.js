import { LitElement, html, css } from 'lit'

import { isEmpty } from './helpers'
import { Config } from './qrcg-config'

export class QRCGRoute extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
            }
        `
    }

    static get properties() {
        return {
            route: { type: String },
            except: { type: String },
            withSearch: { type: Boolean, attribute: 'with-search' },
            _shouldRender: { state: true },
            routeMatch: { state: true },
            exceptMatch: { state: true },
            routeParams: {},
        }
    }

    constructor() {
        super()

        this.routeUpdate = this.routeUpdate.bind(this)

        this._shouldRender = false

        this.routeParams = {}

        this.onAfterRender = this.onAfterRender.bind(this)
    }

    connectedCallback() {
        super.connectedCallback()

        window.addEventListener('popstate', this.routeUpdate)

        window.addEventListener(
            'qrcg-router:location-changed',
            this.routeUpdate
        )

        window.addEventListener('qrcg-route:after-render', this.onAfterRender)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        window.removeEventListener('popstate', this.routeUpdate)

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.routeUpdate
        )

        window.removeEventListener(
            'qrcg-route:after-render',
            this.onAfterRender
        )
    }

    firstUpdated() {
        this.routeUpdate()
    }

    async routeUpdate() {
        try {
            await this.prepareUpdate()

            const prevRender = this._shouldRender

            this._shouldRender =
                this._routeIsMatched() &&
                this._exceptIsMatched() &&
                this._willRender()

            if (this._shouldRender && !prevRender) {
                this.renderInnerTemplate()
            }

            if (!this._shouldRender) {
                this.resetInnerContent()
            }

            if (this._shouldRender) {
                this.fireAfterRender()
            }
        } catch (ex) {
            this.handleUnpreparedRoute()
        }
    }

    prepareUpdate() {
        return true
    }

    handleUnpreparedRoute() {}

    _willRender() {
        return this.dispatchEvent(
            new CustomEvent('qrcg-route:will-render', {
                detail: {
                    route: this.route,
                },
                cancelable: true,
                bubbles: true,
                composed: true,
            })
        )
    }

    fireAfterRender() {
        window.dispatchEvent(
            new CustomEvent('qrcg-route:after-render', {
                detail: {
                    routeMatch: this.routeMatch,
                },
            })
        )
    }

    renderInnerTemplate() {
        const template = this.querySelector('template')

        if (!template) return

        this.appendChild(template.content.cloneNode(true))
    }

    resetInnerContent() {
        const elements = this.querySelectorAll(':not(template)')

        elements.forEach((element) => element.remove())
    }

    _routeIsMatched() {
        this.routeMatch = this._matchRoute(this.route)

        return this.routeMatch
    }

    _exceptIsMatched() {
        if (isEmpty(this.except)) return true

        this.exceptMatch = this._matchRoute(this.except)

        return !this.exceptMatch
    }

    _matchRoute(routeToMatch) {
        if (isEmpty(routeToMatch)) return true

        let route = isEmpty(routeToMatch) ? '' : routeToMatch

        if (!route.match(new RegExp('^/'))) {
            route = `/${route}`
        }

        const pattern = `^${route.length > 1 ? route : `${route}$`}`

        const match = this.currentPath().match(new RegExp(pattern, 'i'))

        return match
    }

    currentPath() {
        const a = document.createElement('a')

        a.href = Config.get('app.url')

        const basePathname = a.pathname === '/' ? '' : a.pathname

        a.remove()

        const pathname = window.location.pathname.replace(basePathname, '')

        if (this.withSearch) {
            return pathname + window.location.search
        }

        return pathname
    }

    onAfterRender(e) {
        const {
            detail: { routeMatch },
        } = e

        if (isEmpty(routeMatch.groups)) {
            this.routeParams = {}
        } else {
            this.routeParams = routeMatch.groups
        }

        window.dispatchEvent(
            new CustomEvent('qrcg-route:route-paramas-change', {
                detail: { routeParams: this.routeParams },
            })
        )
    }

    render() {
        return html`<slot></slot>`
    }
}

window.defineCustomElement('qrcg-route', QRCGRoute)
