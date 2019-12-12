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
		this._square.align({
			left:150,
			top:150,
			right:150,
			bottom:150,
		});
	}
}