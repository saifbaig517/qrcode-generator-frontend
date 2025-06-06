import { isArray, isEmpty } from '../../core/helpers'
import { t } from '../../core/translate'

export class ColorPalette {
    id = ''
    name = ''

    color_1 = ''
    color_2 = ''
    color_3 = ''
    color_4 = ''

    static get NUMBER_OF_COLORS_IN_PALETTE() {
        return 4
    }

    static fromPlainObject(obj) {
        const instance = new this(
            obj.id,
            obj.name,
            obj.color_1,
            obj.color_2,
            obj.color_3,
            obj.color_4
        )

        return instance
    }

    constructor(id, name = '', color_1, color_2, color_3, color_4) {
        this.id = id
        this.name = name

        this.color_1 = color_1
        this.color_2 = color_2
        this.color_3 = color_3
        this.color_4 = color_4
    }

    getName() {
        return isEmpty(this.name) ? t`New Palette` : this.name
    }
}

export class ColorPaletteManager {
    #collection = []
    #host
    #selectedPalette = null

    static get EVENT_ON_SELECTED_PALETTE_CHANGED() {
        return 'on-selected-palette-changed'
    }

    static connect(host) {
        const instance = new this()

        instance.#host = host

        return instance
    }

    #generateId() {
        return 'cp-' + new Date().getTime()
    }

    #newPalette() {
        return new ColorPalette(this.#generateId())
    }

    syncCollection(value) {
        if (!isEmpty(this.#collection)) {
            return
        }

        if (!isArray(value)) {
            value = []
        }

        value = value.map((p) => {
            return ColorPalette.fromPlainObject(p)
        })

        this.#collection = value

        this.requestUpdate()
    }

    deleteSelectedPalette() {
        this.#collection = this.#collection.filter((p) => {
            return p.id != this.#selectedPalette?.id
        })

        this.requestUpdate()
    }

    getPalettes() {
        return this.#collection
    }

    addPalette() {
        const newPalette = this.#newPalette()

        this.#collection.push(newPalette)

        this.selectPalette(newPalette.id)

        this.requestUpdate()
    }

    hasPalettes() {
        return this.#collection.length > 0
    }

    selectPalette(id) {
        this.#selectedPalette = this.#collection.find((p) => p.id == id)

        this.#notify(ColorPaletteManager.EVENT_ON_SELECTED_PALETTE_CHANGED)
    }

    updateSelectedPalette(fieldName, value) {
        this.#selectedPalette[fieldName] = value

        this.requestUpdate()

        this.#notify()
    }

    getSelectedPaletteValue(fieldName) {
        return this.#selectedPalette[fieldName]
    }

    getSelectedPalette() {
        return this.#selectedPalette
    }

    requestUpdate() {
        setTimeout(() => {
            this.#host.requestUpdate()
        })
    }

    #notify(eventName, detail = {}) {
        console.log('notifying host', {
            host: this.#host,
            eventName,
        })
        this.#host?.dispatchEvent(
            new CustomEvent(eventName, {
                detail,
            })
        )
    }
}
