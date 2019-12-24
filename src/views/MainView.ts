import View from "../core/views/View";
import Button from "./Button";
import InteractiveView from "../core/views/InteractiveView";
import TilingSprite = PIXI.TilingSprite;
import Texture = PIXI.Texture;
import Scroll from "./scroll/Scroll";
import Graphics = PIXI.Graphics;
import {genRandomColor, genRandomInteger} from "../Random";

export default class MainView extends View {
	private _scroll:Scroll;
	private _background:TilingSprite;
	private _button:Button;
	private _selectableButton:Button;

	constructor() {
		super();

		this._background = this.addChild(new TilingSprite(Texture.from("img/background.png"), 100, 100));
		this._button = this.addChild(new Button("Button"));
		this._selectableButton = this.addChild(new Button("Selectable", true));
		this._scroll = this.addChild(new Scroll(true));

		// FIXME: <temporary_code>
		const contentWidth:number = 1500;
		const contentHeight:number = 1500;
		for (let i:number = 0; i < 100; i++) {
			const circle:Graphics = new Graphics();
			circle.beginFill(genRandomColor());
			const radius:number = genRandomInteger(20, 50);
			circle.drawCircle(0, 0, radius);
			circle.x = genRandomInteger(radius, contentWidth - radius);
			circle.y = genRandomInteger(radius, contentHeight - radius);
			this._scroll.addContent(circle);
		}
		this._scroll.setContainerSize(contentWidth, contentHeight);
		// FIXME: </temporary_code>

		this._button.addListener(InteractiveView.CLICK, () => { console.log("click"); });
		this._selectableButton.addListener(
			InteractiveView.CHANGE_SELECT,
			() => {
				console.log("selected = " + this._selectableButton.getSelected());
			}
		);
	}

	protected applySize():void {
		super.applySize();

		this._scroll.setSize(this.w, this.h);
		this._background.width = this.w;
		this._background.height = this.h;
		this._button.setSize(150, 50);
		this._selectableButton.setSize(200, 50);

		this.centerHorizontal(this._button);
		this.centerHorizontal(this._selectableButton);

		const gap:number = 10;
		const buttonsHeight:number = this._button.h + gap + this._selectableButton.h;
		this._button.y = Math.floor((this.h - buttonsHeight) / 2);
		this._selectableButton.y = this._button.y + this._button.h + gap;
	}
}