export class BrandUrl {
    static base = 'aHR0cHM6Ly9xdWlja2NvZGUuZGlnaXRhbA=='

    static url(path) {
        if (path[0] != '/') {
            path = '/' + path
        }

        return window.atob(this.base) + path
    }

    static pricingUrl() {
        return this.url('/#pricing')
    }
}
