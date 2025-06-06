import { get } from './api'

import { push } from './qrcg-router'

import { Config } from './qrcg-config'

import { get as getObjectProperty } from './helpers'

import { storeJson, loadStoredJson, isEmpty, queryParam } from './helpers'

import Auth0Manager from '../account/auth0-manager'
import { PluginManager } from '../../plugins/plugin-manager'
import { FILTER_AFTER_LOGIN_SHOULD_DO_REDIRECT } from '../../plugins/plugin-filters'

const userKey = 'auth:user'

const tokenKey = 'auth:token'

export function userHomePage() {
    const user = loadUser()

    if (isEmpty(user)) return ''

    let homePage = ''

    const path = user.is_sub
        ? `parent_user.roles[0].home_page`
        : `roles[0].home_page`

    homePage = getObjectProperty(user, path)

    return homePage
}

export function isSubUser() {
    return loadUser()?.is_sub
}

export function isCustomer() {
    if (!loadUser()) return true

    if (!loadUser().roles || !loadUser().roles[0]) return false

    return (
        loadUser().roles[0].name === 'Client' ||
        loadUser().roles[0].name === 'Sub User'
    )
}

export function loadUser() {
    return loadStoredJson(userKey)
}

function storeUser(user) {
    storeJson(user, userKey)
}

export function storeToken(token) {
    localStorage[tokenKey] = token
}

export function loadToken() {
    return localStorage[tokenKey]
}

export function login(user, token) {
    storeUser(user)
    storeToken(token)
}

export function actAs(user, token) {
    const mainUser = {
        user: loadUser(),
        token: loadToken(),
    }

    storeJson(mainUser, 'mainUser')

    storeUser(user)
    storeToken(token)
}

export function isActingAs() {
    const mainUser = loadStoredJson('mainUser')

    return !isEmpty(mainUser)
}

export function removeActingAs() {
    const mainUser = loadStoredJson('mainUser')

    storeUser(mainUser.user)

    storeToken(mainUser.token)

    delete localStorage.mainUser

    push(userHomePage())

    setTimeout(() => {
        window.location.reload()
    }, 10)
}

export function hasToken() {
    const token = loadToken()

    return !isEmpty(token)
}
export function loggedIn() {
    const user = loadUser()
    const token = loadToken()

    return !isEmpty(user) && !isEmpty(token)
}

export function verified() {
    const user = loadUser()

    if (isEmpty(user)) return false

    return !isEmpty(user.email_verified_at)
}

function clearLocalStorage() {
    delete localStorage[userKey]
    delete localStorage[tokenKey]

    delete localStorage.mainUser
}

function onInvalidToken() {
    clearLocalStorage()

    window.dispatchEvent(new CustomEvent('auth:request-logout'))
}

function redirectToLoginPageAfterLogout(e) {
    let redirect = ''

    try {
        const eRedirect = getObjectProperty(e, 'detail.redirect')

        if (eRedirect) redirect = `?redirect=${eRedirect}`
    } catch {
        redirect = ''
    }

    push(`/account/login${redirect}`)
}

function onLogoutRequested(e) {
    clearLocalStorage()

    if (Auth0Manager.isEnabled()) {
        window.location = '/auth0/logout'
        return
    }

    const action = Config.get('app.after_logout_action')

    const goToHomePageAndRefresh = () => {
        redirectToLoginPageAfterLogout(e)
        setTimeout(() => {
            location.reload()
        }, 50)
    }

    switch (action) {
        case 'redirect_to_login_page':
            goToHomePageAndRefresh()
            break
        case 'redirect_to_home_page':
            push('/')
            break
        default:
            goToHomePageAndRefresh()
            break
    }
}

async function onAfterLogin(e) {
    const { user, token, useRouter = true } = e.detail

    storeUser(user)

    storeToken(token)

    window.dispatchEvent(new CustomEvent('auth:local-user-ready'))

    const shouldDoRedirect = PluginManager.applyFilters(
        FILTER_AFTER_LOGIN_SHOULD_DO_REDIRECT,
        true
    )

    if (!shouldDoRedirect) return

    if (useRouter) {
        if (queryParam('redirect')) {
            push(queryParam('redirect'))
        } else {
            push(userHomePage())
        }
    } else {
        if (queryParam('redirect')) {
            window.location = queryParam('redirect')
        } else {
            window.location = userHomePage()
        }
    }
}

/**
 *
 * @param {Object} user if not specified, currently logged in user will be used.
 * @returns
 */
export function isSuperAdmin(user = null) {
    if (!user) {
        user = loadUser()
    }

    if (isEmpty(user) || isEmpty(user.roles)) {
        return false
    }

    const superAdmin = user.roles.reduce(
        (superAdmin, role) => superAdmin || role.super_admin,
        false
    )

    return superAdmin
}

export function isClient() {
    const user = loadUser()

    if (isEmpty(user) || isEmpty(user.roles)) {
        return false
    }

    return user.roles.filter((r) => r.name === 'Client').length > 0
}

export function permitted(slug) {
    if (isEmpty(slug)) return true
    const user = loadUser()

    if (isEmpty(user) || isEmpty(user.roles)) {
        return false
    }

    const superAdmin = user.roles.reduce(
        (superAdmin, role) => superAdmin || role.super_admin,
        false
    )

    if (superAdmin) {
        return true
    }

    if (!verified()) return false

    const permissions = user.roles
        .map((role) => role.permissions)
        .reduce((perms, arr) => perms.concat(arr), [])

    return !!permissions.find((p) => p.slug === slug)
}

function main() {
    window.addEventListener('qrcg-login:after-login', onAfterLogin)

    if (
        document.readyState === 'complete' ||
        document.readyState === 'loaded' ||
        document.readyState === 'interactive'
    ) {
        // document has at least been parsed
        onDocumentReady()
    } else {
        window.addEventListener('DOMContentLoaded', onDocumentReady)
    }

    window.addEventListener('storage', onWindowStorageChanged)

    window.addEventListener('auth:invalid-token', onInvalidToken)

    window.addEventListener('auth:request-logout', onLogoutRequested)
}

export function logout() {
    window.dispatchEvent(new CustomEvent('auth:request-logout'))
}

async function onWindowStorageChanged() {
    await new Promise((resolve) => setTimeout(resolve, 0))
}

function onDocumentReady() {
    validateCurrentToken()
}

export async function validateCurrentToken() {
    const token = loadToken()

    if (!token) {
        return
    }

    try {
        const { response } = await get('myself')

        const user = await response.clone().json()

        storeUser(user)

        window.dispatchEvent(new CustomEvent('auth:local-user-ready'))
    } catch {
        //
    }
}

main()
