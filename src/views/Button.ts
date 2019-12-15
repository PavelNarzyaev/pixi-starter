import View from "../core/views/View";
import Text = PIXI.Text;
import BlockBackground from "./BlockBackground";

export default class Button extends View {
	private _background:BlockBackground;
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
		this._background = new BlockBackground();
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
		this._background.setSize(this.w, this.h);
	}

	private alignNameField():void {
		this.center(this._nameField);
	}
}