import { destroy, get, upload, ValidationError } from '../../core/api'
import { hash, isEmpty } from '../../core/helpers'
import { Config } from '../../core/qrcg-config'

export class FileModel {
    static cachedFiles = {}

    static get SAVED_BADGE() {
        return {
            type: 'success',
            label: 'Saved',
        }
    }

    static get ERROR_BADGE() {
        return { type: 'danger', label: 'Error' }
    }

    static get eventKey() {
        return 'qrcg-file-upload'
    }

    static get events() {
        return {
            beforeUpload: 'before-upload',
            afterUpload: 'after-upload',
            uploadError: 'upload-error',
            uploadSuccess: 'upload-success',
            beforeDelete: 'before-delete',
            afterDelete: 'after-delete',
            remoteFileDeleted: 'remote-file-deleted',
        }
    }

    get events() {
        return this.constructor.events
    }

    constructor({
        file = {},
        uploadEndpoint,
        remote,
        attachable_type,
        name,
        _name,
    }) {
        this.file = file
        this.loading = true
        this.errors = []
        this.uploadEndpoint = uploadEndpoint
        this.remote = remote
        this.uploaded = false
        this.name = name
        this.attachable_type = attachable_type
        this._name = _name
    }

    get id() {
        return this.remote?.id
    }

    static async fetchFile(id, { fetchEndpoint }) {
        if (!isEmpty(this.cachedFiles[id])) {
            return this.cachedFiles[id]
        }

        const { response } = await get(this.endpointRoute(fetchEndpoint, id))

        const file = await response.json()

        this.cachedFiles[id] = file

        return file
    }

    static endpointRoute(endpoint, id) {
        if (!endpoint) {
            endpoint = `files/${id}`
        } else {
            endpoint = `${endpoint}/${id}`
        }

        return endpoint.replace(/\/+/g, '/')
    }

    static async fromRemote(id, params) {
        const remote = await this.fetchFile(id, {
            fetchEndpoint: params?.fetchEndpoint,
        })

        const file = new FileModel({
            ...params,
            remote,
        })

        file.loading = false

        file.badge = this.SAVED_BADGE

        return file
    }

    onBeforeUpload = () => {
        this.loading = true
    }

    onUploadSuccess = (e) => {
        this.badge = this.constructor.SAVED_BADGE

        this.remote = e.detail.remote

        this.uploaded = true
    }

    onAfterUpload = () => {
        this.loading = false
    }

    onUploadError = () => {
        this.badge = this.constructor.ERROR_BADGE
    }

    shouldUpload() {
        return !this.uploaded && this.file instanceof File
    }

    async upload() {
        if (!this.shouldUpload()) return

        if (!this.uploadEndpoint) {
            this.uploadEndpoint = 'qrcodes/data-file'
        }

        this.fire(this.events.beforeUpload)

        try {
            const uploadData = {
                file: this.file,
            }

            if (this._name) {
                uploadData.name = this._name
            }

            if (this.name) {
                uploadData.name = this.name
            }

            if (this.attachable_type) {
                uploadData.attachable_type = this.attachable_type
            }

            const { response } = await upload(this.uploadEndpoint, uploadData)

            const remote = await response.clone().json()

            this.fire(this.events.uploadSuccess, { remote, response })
        } catch (ex) {
            if (ex instanceof ValidationError) {
                let errors = Object.keys(ex.errors()).reduce((arr, key) => {
                    arr.push(...ex.errors()[key])
                    return arr
                }, [])

                this.errors.push(...errors)
            }

            this.fire(this.events.uploadError)
        } finally {
            this.fire(this.events.afterUpload)
        }
    }

    fire(name, data = null) {
        const key = this.eventName(name)

        if (!this.host) {
            console.warn('FileModel host is not available')
            return
        }

        this.host.dispatchEvent(
            new CustomEvent(key, {
                detail: data,
            })
        )
    }

    bind(name, callback) {
        if (!this.host) {
            console.warn(
                'FileModel host is not available, cannot set up listeners'
            )

            return
        }

        this.host.addEventListener(this.eventName(name), callback)
    }

    detach(name, callback) {
        if (!this.host) {
            console.warn(
                'FileModel host is not available, cannot set up listeners'
            )

            return
        }

        this.host.removeEventListener(this.eventName(name), callback)
    }

    subscribe(callback) {
        Object.keys(this.events).forEach((key) => {
            const event = this.events[key]

            this.bind(event, callback)
        })
    }

    unsubscribe(callback) {
        Object.keys(this.events).forEach((key) => {
            const event = this.events[key]

            this.detach(event, callback)
        })
    }

    eventName(name) {
        return this.constructor.eventKey + ':' + name
    }

    get isConnected() {
        return !!this.host
    }

    hash() {
        if (this.id) {
            return hash(this.id + '')
        }

        return hash(this.file.name)
    }

    get extension() {
        return this.getName().split('.').pop()
    }

    static fileExtension(name) {
        return name.split('.').pop()
    }

    onBeforeDelete = () => {
        this.loading = true
    }

    onAfterDelete = () => {
        this.loading = false
    }

    async delete(deleteEndpoint = null) {
        this.fire(this.events.beforeDelete)

        if (!this.id) {
            await this.host.deleteAnimationPromise
            this.fire(this.events.afterDelete)
            return true
        }

        if (!deleteEndpoint) {
            deleteEndpoint = 'files/'
        }

        try {
            await destroy(FileModel.endpointRoute(deleteEndpoint, this.id))
        } catch {
            //
        }

        this.fire(this.events.remoteFileDeleted)

        await this.host.animationPromise

        this.fire(this.events.afterDelete)

        return false
    }

    getName() {
        if (!isEmpty(this.remote)) {
            return this.remote.name
        }

        return this.file.name
    }

    directLink(mode = 'download') {
        if (!this.id) return

        return (
            Config.get('app.url') +
            '/api/files/' +
            this.remote.slug +
            '/resource' +
            `?mode=${mode}`
        )
    }

    connect(host) {
        this.host = host

        this.bind(this.events.beforeUpload, this.onBeforeUpload)

        this.bind(this.events.afterUpload, this.onAfterUpload)

        this.bind(this.events.uploadError, this.onUploadError)

        this.bind(this.events.uploadSuccess, this.onUploadSuccess)

        this.bind(this.events.beforeDelete, this.onBeforeDelete)

        this.bind(this.events.afterDelete, this.onAfterDelete)
    }

    disconnect() {
        this.detach(this.events.beforeUpload, this.onBeforeUpload)

        this.detach(this.events.afterUpload, this.onAfterUpload)

        this.detach(this.events.uploadError, this.onUploadError)

        this.detach(this.events.uploadSuccess, this.onUploadSuccess)

        this.detach(this.events.beforeDelete, this.onBeforeDelete)

        this.detach(this.events.afterDelete, this.onAfterDelete)

        this.host = null
    }
}
