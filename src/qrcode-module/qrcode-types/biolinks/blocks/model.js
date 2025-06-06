import { isEmpty, isFunction, parseNumberValue } from '../../../../core/helpers'

export class BlockModel {
    #id
    #mode
    #slug
    #data

    #subscribedElements = []

    static MODE_PREVIEW = 'preview'

    static MODE_EDIT = 'edit'

    static #models = []

    static find(id) {
        return this.#models.find((m) => m.getId() === id)
    }

    constructor({ id, mode, slug, data }) {
        this.setId(id)
        this.setMode(mode)
        this.setSlug(slug)
        this.setData(data)

        BlockModel.addModelOrUpdateExisting(this)
    }

    static addModelOrUpdateExisting(model) {
        const found = this.#models.find((m) => m.getId() === model.getId())

        if (!found) {
            this.#models.push(model)
        } else {
            this.#models = this.#models.map((m) => {
                if (m.getId() === model.getId()) {
                    return model
                }

                return m
            })
        }
    }

    setId(id) {
        this.#id = id
        this.updateSubscribedElements()
    }

    getId() {
        return this.#id
    }

    setMode(mode) {
        this.#mode = mode
        this.updateSubscribedElements()
    }

    getMode() {
        return this.#mode
    }

    setSlug(slug) {
        this.#slug = slug
        this.updateSubscribedElements()
    }

    getSlug() {
        return this.#slug
    }

    setData(data) {
        if (isEmpty(data)) {
            data = {}
        }

        this.#data = data
        this.updateSubscribedElements()
    }

    setSortOrder(value) {
        this.updateData('sortOrder', value)
    }

    getData() {
        return this.#data
    }

    field(key, defaultValue = null) {
        return this.getData()[key] ?? defaultValue
    }

    getSortOrder() {
        return parseNumberValue(this.getData()?.sortOrder)
    }

    updateData(key, value) {
        this.setData({
            ...this.getData(),
            [key]: value,
        })
    }

    subscribe(element) {
        if (this.#subscribedElements.find((e) => e === element)) return

        this.#subscribedElements.push(element)
    }

    updateSubscribedElements() {
        this.#subscribedElements.forEach((elem) => {
            elem.requestUpdate()
        })

        this.notifyModelChange()
    }

    notifyModelChange() {
        this.#subscribedElements.forEach((elem) => {
            if (isFunction(elem.onModelChange)) {
                elem.onModelChange(this)
            }
        })
    }

    disconnect(element) {
        this.#subscribedElements = this.#subscribedElements.filter(
            (e) => e != element
        )
    }

    static instance(slug, sortOrder) {
        const model = new BlockModel({
            id: slug + '-' + new Date().getTime(),
            mode: 'edit',
            slug,
            data: {},
        })

        model.setSortOrder(sortOrder)

        return model
    }

    toPlainObject() {
        return {
            id: this.getId(),
            slug: this.getSlug(),
            data: this.getData(),
            mode: this.getMode(),
        }
    }

    toJson() {
        return JSON.stringify(this.toPlainObject())
    }

    static fromJson(value) {
        try {
            return new BlockModel(JSON.parse(value))
        } catch {
            return null
        }
    }
}
