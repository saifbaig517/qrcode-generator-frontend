import { LeadFormChoicesQuestion } from './choices'
import { LeadFormRatingQuestion } from './rating'
import { LeadFormStarsQuestion } from './stars'
import { LeadFormTextQuestion } from './text'
import { LeadFormTextAreaQuestion } from './textarea'

export class LeadFormQuestionManager {
    static #types = []

    static registerType(type) {
        this.#types.push(type)
    }

    find(type) {
        return LeadFormQuestionManager.#types.find((T) => T.type === type)
    }
}

LeadFormQuestionManager.registerType(LeadFormTextQuestion)
LeadFormQuestionManager.registerType(LeadFormTextAreaQuestion)
LeadFormQuestionManager.registerType(LeadFormRatingQuestion)
LeadFormQuestionManager.registerType(LeadFormStarsQuestion)
LeadFormQuestionManager.registerType(LeadFormChoicesQuestion)
