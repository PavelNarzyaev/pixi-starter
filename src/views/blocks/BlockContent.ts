import View from "../../core/views/View";
import Graphics = PIXI.Graphics;
import Text = PIXI.Text;

export default class BlockContent extends View {
	private static readonly DEFAULT_FILL:number = 0xe5e5e5;
	private static readonly ACTIVE_FILL:number = 0x00ff00;
	private _background:Graphics;
	private _fields:Text[] = [];

	constructor() {
		super();
		this.initBackground();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	protected createField(text:string):Text {
		const field:Text = new Text(text, { fill:BlockContent.DEFAULT_FILL })
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

	protected fillField(field:Text, active:boolean):void {
		field.style.fill = active ? BlockContent.ACTIVE_FILL : BlockContent.DEFAULT_FILL;
	}
}