import { Config } from './qrcg-config'

import { isEmpty, isNotEmpty } from './helpers'

import { loadToken, hasToken } from './auth'

export class ValidationError extends Error {
    constructor(details, ...params) {
        super(params)

        this.name = 'ValidationError'

        this.response = details.response

        this.jsonResponse = details.jsonResponse

        this.request = details.request
    }

    errors() {
        return { ...this.jsonResponse.validationErrors }
    }
}

function resolveRoute(route) {
    const base = `${Config.get('app.url')}/api`

    route = route.replace(base, '')

    route = `${base}/${route}`

    route = route.replace('api//', 'api/')

    return route
}

export class ApiError extends Error {
    constructor(details, ...params) {
        super(params)

        this.response = details.response

        this.request = details.request

        this.name = 'ApiError'
    }

    json = async () => {
        return await this.response.clone().json()
    }
}

const request = async (route, { method, body, headers = {} }) => {
    const defaultHeaders = {
        Accept: 'application/json',
        'content-type': 'application/json',
    }

    if (hasToken()) {
        defaultHeaders['Authorization'] = `Bearer ${loadToken()}`
    }

    const requestHeaders = {
        ...defaultHeaders,
        ...headers,
    }

    if (body instanceof FormData) {
        delete requestHeaders['content-type']
    }

    const resolvedRoute = resolveRoute(route)

    const request = new Request(resolvedRoute, {
        method,
        mode: 'cors',

        headers: requestHeaders,
        body: body instanceof FormData ? body : JSON.stringify(body),
    })

    const response = await fetch(request)

    document.dispatchEvent(
        new CustomEvent('api:response-ready', { detail: { response } })
    )

    let jsonResponse

    try {
        jsonResponse = await response.clone().json()
    } catch {
        // console.log(error)
    }

    if (!isEmpty(jsonResponse?.validationErrors)) {
        throw new ValidationError({ jsonResponse, response, request })
    }

    if (!response.ok || [200, 201].indexOf(response.status) === -1) {
        throw new ApiError({ response, request })
    }

    return { response, request, json: jsonResponse }
}

export const upload = async (route, data) => {
    const formData = Object.entries(data).reduce(
        (d, e) => (d.append(...e), d),
        new FormData()
    )

    return request(route, {
        method: 'post',
        body: formData,
    })
}

export const post = async (route, data) => {
    return request(route, {
        method: 'post',
        body: data,
    })
}

export const put = async (route, data) => {
    return request(route, {
        method: 'put',
        body: data,
    })
}

export const save = async (route, data) => {
    let method = 'post'

    if (!isEmpty(data.id)) {
        method = 'put'
        route += `/${data.id}`
    }

    return request(route, {
        method,
        body: data,
    })
}

export const get = async (route, params = {}) => {
    if (isNotEmpty(params)) {
        const paramSearch = new URLSearchParams(params)

        route += route.match(/\?/)
            ? `&${paramSearch.toString()}`
            : `?${paramSearch.toString()}`
    }

    return request(route, {
        method: 'get',
    })
}

export const destroy = async (route) => {
    return request(route, {
        method: 'delete',
    })
}
