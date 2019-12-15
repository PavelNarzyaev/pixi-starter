import View from "../core/views/View";
import Graphics = PIXI.Graphics;

export default class BlockBackground extends View {
	private _graphics:Graphics;

	constructor() {
		super();
		this.init();
	}

	private init():void {
		this.initBackground();
	}

	private initBackground():void {
		this._graphics = new Graphics();
		this.addChild(this._graphics);
	}

	protected applySize():void {
		super.applySize();
		this.alignGraphics();
	}

	private alignGraphics():void {
		this._graphics.clear();
		this._graphics.lineStyle(2, 0xcdcdcd);
		this._graphics.beginFill(0xededed);
		this._graphics.drawRect(0, 0, this.w, this.h);
	}
}