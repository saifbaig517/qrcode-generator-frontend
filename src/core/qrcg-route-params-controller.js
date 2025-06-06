import { isEmpty, isFunction } from './helpers'

export class QRCGRouteParamsController {
    host

    isConnected = false

    constructor(host) {
        this.host = host

        host.addController(this)

        this.onChange = this.onChange.bind(this)
    }

    hostConnected() {
        window.addEventListener(
            'qrcg-route:route-paramas-change',
            this.onChange
        )
    }

    hostDisconnected() {
        window.removeEventListener(
            'qrcg-route:route-paramas-change',
            this.onChange
        )
    }

    getParentRoutes() {
        let parent = this.host.parentNode

        let parentRoutes = []

        while (parent) {
            if (parent.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
                parent = parent.getRootNode().host
            }

            if (
                isFunction(parent.matches) &&
                parent.matches('qrcg-route, qrcg-protected-route')
            ) {
                parentRoutes.push(parent)
            }

            parent = parent.parentNode
        }

        return parentRoutes
    }

    getRouteParams() {
        const parentRoutes = this.getParentRoutes()

        return parentRoutes.reduce((params, route) => {
            Object.keys(route.routeParams).forEach(function (key) {
                const value = route.routeParams[key]

                if (!isEmpty(value)) {
                    params[key] = value
                }
            })

            return params
        }, {})
    }

    onChange() {
        if (isFunction(this.host.onRouteParamChange)) {
            this.host.onRouteParamChange(this.getRouteParams())
        }
    }

    get(name) {
        return this.getRouteParams()[name]
    }
}
