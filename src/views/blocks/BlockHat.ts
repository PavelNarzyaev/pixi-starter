import View from "../../core/views/View";
import Graphics = PIXI.Graphics;
import Text = PIXI.Text;

export default class BlockHat extends View {
	private _background:Graphics;
	private _nameField:Text;

	constructor(
		private _name:string,
	) {
		super();
		this.initBackground();
		this.initNameField();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initNameField():void {
		this._nameField = new Text(this._name);
		this.addChild(this._nameField);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignNameField();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.lineStyle(2);
		this._background.drawRect(0, 0, this.w, this.h);
	}

	private alignNameField():void {
		this._nameField.x = 20;
		this.centerVertical(this._nameField);
	}
}