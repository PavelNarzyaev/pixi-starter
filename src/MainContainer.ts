import View from "./View";
import Square from "./Square";
import {genRandomInteger} from "./Random";
import Text = PIXI.Text;

export default class MainContainer extends View {
	private _square:Square;
	private _squareLeft:number|string;
	private _squareW:number|string;
	private _squareRight:number|string;
	private _textField:Text;

	constructor() {
		super();
	}

	protected onCreate():void {
		super.onCreate();
		this.genAlignmentValues();
		this.refreshText();
		this.initSquare();
	}

	private genAlignmentValues():void {
		const random:number = genRandomInteger(1, 3);
		this._squareLeft = random != 1 ? this.genAlignmentValue() : undefined;
		this._squareW = random != 2 ? this.genAlignmentValue() : undefined;
		this._squareRight = random != 3 ? this.genAlignmentValue() : undefined;
	}

	private genAlignmentValue():number|string {
		if (Math.random() > .25) {
			if (Math.random() < .5) {
				const min:number = 1;
				const max:number = 200;
				return genRandomInteger(min, max);
			} else {
				const minPercent:number = 1;
				const maxPercent:number = 30;
				return genRandomInteger(minPercent, maxPercent) + "%";
			}
		} else {
			return undefined;
		}
	}

	private initSquare():void {
		this._square = new Square();
		this.addChild(this._square);
	}

	protected onFirstResize():void {
		super.onFirstResize();
		this.refreshText();
	}

	private refreshText():void {
		const text:string =
			"left: " + this.printAlignmentValue(this._squareLeft) +
			" | " +
			"width: " + this.printAlignmentValue(this._squareW) +
			" | " +
			"right: " + this.printAlignmentValue(this._squareRight);
		if (!this._textField) {
			this._textField = new Text(
				text,
				{
					fill: 0xffffff,
				}
			);
			this._textField.y = 10;
			this.addChild(this._textField);
		} else {
			this._textField.text = text;
		}
		this.alignTextField();
	}

	private printAlignmentValue(value:number|string):number|string {
		if (value === undefined) {
			return "-";
		} else if (typeof value === "number") {
			return value + "px";
		} else {
			return value;
		}
	}

	protected applySize():void {
		super.applySize();
		this.alignSquare();
		this.alignTextField();
	}

	private alignSquare():void {
		this._square.align({
			top: "25%",
			bottom: "25%",
			left: this._squareLeft,
			w: this._squareW,
			right: this._squareRight,
		});
	}

	private alignTextField():void {
		this._textField.x = Math.floor((this.w - this._textField.width) / 2);
	}
}