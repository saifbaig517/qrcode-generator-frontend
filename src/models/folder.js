export class FolderModel {
    static get onChangeEventName() {
        return 'folder:on-change'
    }

    static fireOnChange() {
        document.dispatchEvent(new CustomEvent(this.onChangeEventName))
    }
}
