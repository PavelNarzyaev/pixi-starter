import View from "./View";
import Graphics = PIXI.Graphics;

export default class Detail extends View {
	private _graphics:Graphics;

	constructor() {
		super();
	}

	protected init():void {
		super.init();
		this.initGraphics();
	}

	private initGraphics():void {
		this._graphics = new Graphics();
		this.addChild(this._graphics);
	}

	protected applySize():void {
		super.applySize();
		this.alignGraphics();
	}

	private alignGraphics():void {
		const border:number = 10;

		this._graphics.clear();
		this._graphics.lineStyle(4);
		this._graphics.drawRoundedRect(0, 0, this.w, this.h, 10);
		this._graphics.drawRoundedRect(border, border, this.w - 2 * border, this.h - 2 * border, 5);
	}
}