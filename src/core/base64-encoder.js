export class Base64Encoder {
    static encode(string) {
        if (!string) {
            return string
        }

        const codeUnits = new Uint8Array(string.length)

        for (let i = 0; i < codeUnits.length; i++) {
            codeUnits[i] = string.charCodeAt(i)
        }

        return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)))
    }

    static decode(string) {
        if (!string) {
            return string
        }

        return new TextDecoder().decode(
            Uint8Array.from(window.atob(string), (m) => m.codePointAt(0))
        )
    }
}
