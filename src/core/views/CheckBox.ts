import SelectableView from "./SelectableView";
import Graphics = PIXI.Graphics;

export default class CheckBox extends SelectableView {
	public static CHANGE:symbol = Symbol();

	private _background:Graphics;

	constructor() {
		super();
		this.initBackground();
		this.addListener(
			CheckBox.CLICK,
			() => {
				this.setSelected(!this.getSelected());
			},
			this
		);
	}

	setSelected(value:boolean):void {
		if (this.getSelected() !== value) {
			super.setSelected(value);
			this.emit(CheckBox.CHANGE);
		}
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	protected applySize():void {
		super.applySize();
		this.redrawBackground();
	}

	protected refreshState():void {
		super.refreshState();
		this.redrawBackground();
	}

	private redrawBackground():void {
		this._background.clear();
		this._background.lineStyle(2);
		this._background.beginFill(this.getBackgroundColor());
		this._background.drawRect(0, 0, this.w, this.h);
	}

	private getBackgroundColor():number {
		switch (this.getCurrentState()) {
			case CheckBox.OVER_STATE:
				return this.getSelected() ? 0x00a603 : 0xf2f2f2;

			case CheckBox.DEFAULT_STATE:
				return this.getSelected() ? 0x008c02: 0xe6e6e6;

			case CheckBox.PRESSED_STATE:
				return this.getSelected() ? 0x007302 : 0xd9d9d9;
		}
	}
}