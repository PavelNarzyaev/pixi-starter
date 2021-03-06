import View from "../View";
import InteractiveView from "../InteractiveView";
import NineSlicePlane = PIXI.NineSlicePlane;
import Rectangle = PIXI.Rectangle;
import Texture = PIXI.Texture;

export default class ButtonTexture extends View {
	public static readonly SOURCE:string = "img/buttons.png";
	private _textures:Map<boolean, Map<symbol, NineSlicePlane>>; // <selected, <state, texture>>
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
		const texture:Texture = new Texture(Texture.from(ButtonTexture.SOURCE).baseTexture, rectangle);
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