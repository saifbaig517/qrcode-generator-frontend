import { defineCustomElement } from '../core/helpers'
import { QRCGEmailForm } from './qrcg-email-form'

export class QrcgEmailDynamicForm extends QRCGEmailForm {}

defineCustomElement('qrcg-email-dynamic-form', QrcgEmailDynamicForm)
