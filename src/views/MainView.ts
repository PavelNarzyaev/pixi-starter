import View from "../core/views/View";
import TilingSprite = PIXI.TilingSprite;
import Texture = PIXI.Texture;
import Scroll from "./scroll/Scroll";
import MainContent from "./MainContent";

export default class MainView extends View {
	private _background:TilingSprite;
	private _scroll:Scroll;
	private _mainContent:MainContent;

	constructor() {
		super();

		this._background = this.addChild(new TilingSprite(Texture.from("img/background.png"), 100, 100));
		this._scroll = this.addChild(new Scroll(true));
		this._mainContent = this._scroll.addContent(new MainContent());
	}

	protected applySize():void {
		super.applySize();

		this._background.width = this.w;
		this._background.height = this.h;
		this._mainContent.setSize(1000, 1000);
		this._scroll.setSize(this.w, this.h);
	}
}