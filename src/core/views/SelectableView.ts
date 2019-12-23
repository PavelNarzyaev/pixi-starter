import InteractiveView from "./InteractiveView";

export default class SelectableView extends InteractiveView {
	public static readonly CHANGE:symbol = Symbol();
	private _selected:boolean = false;

	public setSelected(value:boolean):void {
		if (this._selected !== value) {
			this._selected = value;
			this.markAsDirty();
			this.emit(SelectableView.CHANGE);
		}
	}

	public getSelected():boolean {
		return this._selected;
	}
}