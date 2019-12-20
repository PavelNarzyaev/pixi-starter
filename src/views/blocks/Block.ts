import View from "../../core/views/View";
import BlockHat from "./BlockHat";
import BlockContent from "./BlockContent";

export default class Block extends View {
	private _hat:BlockHat;
	private _content:BlockContent;

	constructor(
		private _name:string,
	) {
		super();
		this.initHat();
	}

	private initHat():void {
		this._hat = new BlockHat(this._name);
		this.addChild(this._hat);
	}

	protected setContent(content:BlockContent):void {
		this._content = content;
		this.addChild(this._content);
		if (this.w && this.h) {
			this.alignContent();
		}
	}

	protected applySize():void {
		super.applySize();
		this.alignHat();
		this.alignContent();
	}

	private alignHat():void {
		this._hat.setSize(this.w, 50);
	}

	private alignContent():void {
		if (this._content) {
			this.align(
				this._content,
				{
					top: this._hat.h,
					left: 0,
					right: 0,
					bottom: 0,
				}
			);
		}
	}

	public getContent():BlockContent {
		return this._content;
	}
}