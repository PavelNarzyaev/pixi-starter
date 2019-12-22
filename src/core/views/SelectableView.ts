import InteractiveView from "./InteractiveView";

export default class SelectableView extends InteractiveView {
	private _selected:boolean = false;

	public setSelected(value:boolean):void {
		if (this._selected !== value) {
			this._selected = value;
			this.markAsDirty();
		}
	}

	public getSelected():boolean {
		return this._selected;
	}
}