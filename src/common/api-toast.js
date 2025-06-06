import { get, isEmpty } from '../core/helpers'
import { showToast } from '../ui/qrcg-toast'

document.addEventListener('api:response-ready', async function (e) {
    const response = e.detail.response

    try {
        const json = await response.clone().json()

        const errorMessage = get(json, 'error_message')

        if (!isEmpty(errorMessage)) {
            showToast(errorMessage)
        }
    } catch ($error) {
        //
    }
})
