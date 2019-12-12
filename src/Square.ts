import View from "./View";
import Graphics = PIXI.Graphics;

export default class Square extends View {
	private _graphics:Graphics;

	constructor() {
		super();
	}

	protected onCreate():void {
		super.onCreate();
		this.initGraphics();
	}

	private initGraphics():void {
		this._graphics = new Graphics();
		this.addChild(this._graphics);
	}

	protected applySize():void {
		super.applySize();
		this._graphics.clear();
		this._graphics.beginFill(0x0000ff);
		this._graphics.drawRoundedRect(0, 0, this.w, this.h, 10);
		this._graphics.endFill();
	}
}