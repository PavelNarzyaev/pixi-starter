import View from "./View";
import NineSlicePlane = PIXI.NineSlicePlane;
import Texture = PIXI.Texture;

export default class Arrows extends View {
	private _texture:any;

	constructor() {
		super();
		this.h = 9;
	}

	protected init():void {
		super.init();
		this.initTexture();
	}

	private initTexture():void {
		this._texture = new NineSlicePlane(Texture.from("img/arrows.png"), 23, 4, 23, 4);
		this._texture.height = this.h;
		this.addChild(this._texture);
	}

	protected applySize():void {
		super.applySize();
		this.alignTexture();
	}

	private alignTexture():void {
		this._texture.width = this.w;
	}
}