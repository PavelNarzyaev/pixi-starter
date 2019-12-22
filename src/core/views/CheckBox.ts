import SelectableView from "./SelectableView";
import InteractiveView from "./InteractiveView";
import GraphicsView from "./GraphicsView";

export default class CheckBox extends SelectableView {
	public static CHANGE:symbol = Symbol();

	private _background:GraphicsView;

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
		this._background = new GraphicsView();
		this._background.setLineWidth(2);
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
		this._background.setFillColor(this.getBackgroundColor());
		this._background.setSize(this.w, this.h);
	}

	private getBackgroundColor():number {
		switch (this.getCurrentState()) {
			case InteractiveView.OVER_STATE:
				return this.getSelected() ? 0x00a603 : 0xf2f2f2;

			case InteractiveView.DEFAULT_STATE:
				return this.getSelected() ? 0x008c02: 0xe6e6e6;

			case InteractiveView.PRESSED_STATE:
				return this.getSelected() ? 0x007302 : 0xd9d9d9;

			default:
				return 0;
		}
	}
}