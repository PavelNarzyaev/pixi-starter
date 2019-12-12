import View from "./View";
import Square from "./Square";

export default class MainContainer extends View {
	private _square:Square;

	constructor() {
		super();
	}

	protected onCreate():void {
		super.onCreate();
		this.initSquare();
	}

	private initSquare():void {
		this._square = new Square();
		this.addChild(this._square);
	}

	protected applySize():void {
		super.applySize();
		this.alignSquare();
	}

	private alignSquare():void {
		this._square.setSize(Math.floor(this.w * .3), Math.floor(this.h * .3));
		this._square.x = Math.floor((this.w - this._square.w) / 2);
		this._square.y = Math.floor((this.h - this._square.h) / 2);
	}
}