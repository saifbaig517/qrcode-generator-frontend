import { html } from 'lit'
import { isActingAs, loadUser, removeActingAs } from '../core/auth'

import { showNotice } from '../dashboard/qrcg-dashboard-notice'
import { t } from '../core/translate'

function onReturnClick() {
    removeActingAs()
}

export function showActAsNoticeIfNeeded() {
    setTimeout(() => {
        showNoticeIfNeeded()
    }, 100)
}

async function showNoticeIfNeeded() {
    if (!isActingAs()) {
        return
    }

    const user = loadUser()

    showNotice({
        message: html`
            ${t`You are currently acting as`} ${user.name},
            <strong style="cursor: pointer" @click=${onReturnClick}>
                ${t`click here to return to your account.`}
            </strong>
        `,
    })
}

async function onLocalUserReady() {
    setTimeout(() => {
        showNoticeIfNeeded()
    }, 100)
}

function onLocationChanged() {
    setTimeout(() => {
        showNoticeIfNeeded()
    }, 100)
}

window.addEventListener('qrcg-router:location-changed', onLocationChanged)

window.addEventListener('auth:local-user-ready', onLocalUserReady)
