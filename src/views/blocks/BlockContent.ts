import View from "../../core/views/View";
import Graphics = PIXI.Graphics;
import Text = PIXI.Text;

export default class BlockContent extends View {
	private _background:Graphics;
	private _fields:Text[] = [];

	constructor(
		private _defaultFill:number = null,
		private _activeFill:number = null,
	) {
		super();
		this._defaultFill = this._defaultFill !== null ? this._defaultFill : 0xe5e5e5;
		this._activeFill = this._activeFill !== null ? this._activeFill : 0x00ff00;
		this.initBackground();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	protected createField(text:string):Text {
		const field:Text = new Text(text, { fill:this._defaultFill })
		this.addChild(field);
		this._fields.push(field);
		return field;
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignFields();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.lineStyle(2);
		this._background.drawRect(0, 0, this.w, this.h);
	}

	private alignFields():void {
		let nextY:number = 10;
		this._fields.forEach((listenerField:Text) => {
			listenerField.x = 30;
			listenerField.y = nextY;
			nextY += listenerField.height;
		});
	}

	protected getDefaultFill():number {
		return this._defaultFill;
	}

	protected getActiveFill():number {
		return this._activeFill;
	}
}