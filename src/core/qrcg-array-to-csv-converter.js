export class QrcgArrayToCsvConverter {
    constructor(arrayOfObjects) {
        this.dataArray = this.normalize(arrayOfObjects)
    }

    normalize(arrayOfObjects) {
        const result = []

        const keys = Object.keys(arrayOfObjects[0])

        result.push(keys)

        for (const obj of arrayOfObjects) {
            result.push(keys.map((k) => obj[k]))
        }

        console.log(result)

        return result
    }

    download(filename) {
        filename = filename + '.csv'

        // Create a blob
        var blob = new Blob([this.csv()], { type: 'text/csv;charset=utf-8;' })
        var url = URL.createObjectURL(blob)

        // Create a link to download it
        var pom = document.createElement('a')
        pom.href = url
        pom.setAttribute('download', filename)
        pom.click()

        setTimeout(() => {
            URL.revokeObjectURL(url)
        }, 50)
    }

    csv() {
        return this.dataArray
            .map(
                (row) =>
                    row
                        .map(String) // convert every value to String
                        .map((v) => v.replaceAll('"', '""')) // escape double colons
                        .map((v) => `"${v}"`) // quote it
                        .join(',') // comma-separated
            )
            .join('\r\n') // rows starting on new lines
    }
}
