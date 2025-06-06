export function getDomainStatuses() {
    return 'draft,in-progress,published,rejected'.split(',')
}

export function getDomainDisplayName(domain) {
    return `${domain.protocol}://${domain.host}`
}
