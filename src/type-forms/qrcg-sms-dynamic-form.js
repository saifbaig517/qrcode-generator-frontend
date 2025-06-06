import { defineCustomElement } from '../core/helpers'
import { QRCGSMSForm } from './qrcg-sms-form'

export class QrcgSmsDynamicForm extends QRCGSMSForm {}

defineCustomElement('qrcg-sms-dynamic-form', QrcgSmsDynamicForm)
