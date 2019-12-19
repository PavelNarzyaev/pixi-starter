import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import Text = PIXI.Text;

export default class MainView extends View {
	private _background:Graphics;
	private _textField:Text;

	constructor() {
		super();
		this.init();
	}

	protected init():void {
		this.initBackground();
		this.initTextField();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initTextField():void {
		this._textField = new Text("Hello!");
		this.addChild(this._textField);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignTextField();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}

	private alignTextField():void {
		this.center(this._textField);
	}
}