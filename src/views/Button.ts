import NineSlicePlane = PIXI.NineSlicePlane;
import InteractiveView from "../core/views/InteractiveView";
import View from "../core/views/View";
import Rectangle = PIXI.Rectangle;
import Texture = PIXI.Texture;
import OneLineTextField from "../core/views/OneLineTextField";

export default class Button extends InteractiveView {
	private _texture:ButtonTexture;
	private _nameField:OneLineTextField;

	constructor(
		private _name:string,
		selectable:boolean = false,
	) {
		super(selectable);
		this._texture = this.addChild(new ButtonTexture(this._selectable));
		this._nameField = this.addChild(new OneLineTextField(this._name));
		this.refreshState();
		if (this._selectable) {
			this.addListener(InteractiveView.CLICK, () => {
				this.setSelected(!this.getSelected())
			}, this);
		}
	}

	protected refreshState():void {
		super.refreshState();
		this._texture.refreshTexture(this.getCurrentState(), this.getSelected());
	}

	protected applySize():void {
		super.applySize();
		this.refreshTexture();
		this._nameField.setSize("80%", "60%");
		this.center(this._nameField);
	}

	private refreshTexture():void {
		this._texture.setSize(this.w, this.h);
	}
}

class ButtonTexture extends View {
	// <selected, <state, texture>>
	private _textures:Map<boolean, Map<symbol, NineSlicePlane>>;
	private _texture:NineSlicePlane;

	constructor(
		private _selectable:boolean = false,
	) {
		super();
		this.initTextures();
	}

	private initTextures():void {
		if (!this._textures) {
			this._textures = new Map<boolean, Map<symbol, NineSlicePlane>>();
			let selectedTextures:Map<symbol, NineSlicePlane>;
			if (this._selectable) {
				selectedTextures = new Map<symbol, NineSlicePlane>();
				selectedTextures.set(InteractiveView.DEFAULT_STATE, this.createTexture(0, 1));
				selectedTextures.set(InteractiveView.OVER_STATE, this.createTexture(1, 1));
				selectedTextures.set(InteractiveView.PRESSED_STATE, this.createTexture(2, 1));
				this._textures.set(true, selectedTextures);
			}
			const textures:Map<symbol, NineSlicePlane> = new Map<symbol, NineSlicePlane>();
			textures.set(InteractiveView.DEFAULT_STATE, this.createTexture(0, 0));
			textures.set(InteractiveView.OVER_STATE, this.createTexture(1, 0));
			if (this._selectable) {
				textures.set(InteractiveView.PRESSED_STATE, selectedTextures.get(InteractiveView.PRESSED_STATE));
			} else {
				textures.set(InteractiveView.PRESSED_STATE, this.createTexture(2, 0));
			}
			this._textures.set(false, textures);
		}
	}

	private createTexture(x:number, y:number):NineSlicePlane {
		const textureSize:number = 26;
		const sliceSize:number = 10;
		const rectangle:Rectangle = new Rectangle(x * textureSize, y * textureSize, textureSize, textureSize);
		const texture:Texture = new Texture(Texture.from("img/buttons.png").baseTexture, rectangle);
		return new NineSlicePlane(texture, sliceSize, sliceSize, sliceSize, sliceSize);
	}

	public refreshTexture(currentState:symbol, selected:boolean = false):void {
		const newTexture:NineSlicePlane = this._textures.get(this._selectable ? selected : false).get(currentState);
		if (this._texture !== newTexture) {
			if (this._texture) {
				this._texture.parent.removeChild(this._texture);
			}
			this._texture = newTexture;
			this.addChild(this._texture);
			if (this.w && this.h) {
				this.alignTexture();
			}
		}
	}

	protected applySize():void {
		super.applySize();
		this.alignTexture();
	}

	private alignTexture():void {
		if (this._texture) {
			this._texture.width = this.w;
			this._texture.height = this.h;
		}
	}
}