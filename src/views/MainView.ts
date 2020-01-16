import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import Text = PIXI.Text;
import Scroll from "../core/views/scroll/Scroll";

export default class MainView extends View {
	private _background:Graphics;
	private _scroll:Scroll;
	private _scrollContent:View;
	private _textField:Text;

	constructor() {
		super();
		this._background = this.addChild(new Graphics());
		this._scroll = this.addChild(new Scroll(true, true, false));
		this._scrollContent = this._scroll.addContent(new View());
		this._textField = this._scrollContent.addChild(new Text("Hello!"));
	}

	protected applySize():void {
		super.applySize();
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
		this._scrollContent.setSize(500, 500);
		this._scroll.setSize(this.w, this.h);
		this._scrollContent.center(this._textField);
	}
}