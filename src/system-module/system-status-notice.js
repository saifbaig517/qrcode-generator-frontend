import { get } from '../core/api'

import { isSuperAdmin, loadUser } from '../core/auth'
import { t } from '../core/translate'

import { showNotice } from '../dashboard/qrcg-dashboard-notice'
import { showActAsNoticeIfNeeded } from './qrcg-act-as-notice'

const data = {
    user: null,
    ok: undefined,
}

async function onLocalUserReady() {
    data.user = loadUser()

    showNoticeIfNeeded()
}

async function fetchStatus() {
    if (!isSuperAdmin()) return

    const { response } = await get('system/status')

    const result = await response.json()

    data.ok = result.ok

    showNoticeIfNeeded()

    showActAsNoticeIfNeeded()
}

async function showNoticeIfNeeded() {
    if (!isSuperAdmin()) return

    if (!data.user) return

    if (typeof data.ok === 'undefined') return

    if (location.pathname == '/dashboard/system/status') {
        return
    }

    if (!data.ok) {
        await new Promise((resolve) => setTimeout(resolve, 50))

        showNotice({
            message: t(
                'Some of the functionality might not work, click here to resolve the issue.'
            ),
            link: '/dashboard/system/status',
        })
    }
}

function onLocationChanged() {
    return
}

fetchStatus()

window.addEventListener('qrcg-router:location-changed', onLocationChanged)

window.addEventListener('auth:local-user-ready', onLocalUserReady)
