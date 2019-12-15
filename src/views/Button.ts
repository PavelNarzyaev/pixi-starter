import View from "../core/views/View";
import Graphics = PIXI.Graphics;
import Text = PIXI.Text;

export default class Button extends View {
	private _background:Graphics;
	private _nameField:Text;

	constructor(
		private _name:string,
		private _callback:() => void
	) {
		super();
		this.init();
	}

	private init():void {
		this.interactive = true;
		this.addListener("pointerdown", () => { this._callback(); });
		this.initBackground();
		this.initNameField();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initNameField():void {
		this._nameField = new Text(
			this._name,
			{
				fontSize: 14,
				fontStyle: "bold",
			}
		);
		this.addChild(this._nameField);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignNameField();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.lineStyle(2, 0xcdcdcd);
		this._background.beginFill(0xededed);
		this._background.drawRect(0, 0, this.w, this.h);
	}

	private alignNameField():void {
		this.center(this._nameField);
	}
}