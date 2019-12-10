import MainContainer from "./MainContainer";
import Rectangle = PIXI.Rectangle;
import Application = PIXI.Application;
import Pixi from "./Pixi";

export class Main {
	private _size:Rectangle;
	private _mainContainer:MainContainer;

	constructor(canvasId:string) {
		this.initSize();
		this.initPixiApp(canvasId);
		this.initMainContainer();
		window.onresize = () => { this.resize(); };
		this.resize();
	}

	private initSize():void {
		this._size = new Rectangle();
	}

	private initPixiApp(canvasId:string):void {
		Pixi.app = new Application({
			backgroundColor: 0x000000,
			view: document.getElementById(canvasId) as HTMLCanvasElement,
			// needed to avoid troubles with invisible fonts on some Android devices
			resolution: ((devicePixelRatio || 1) < 2) ? 1 : 2,
		});
	}

	private initMainContainer():void {
		this._mainContainer = new MainContainer();
		Pixi.app.stage.addChild(this._mainContainer);
	}

	private resize():void {
		this.refreshSize();
		this.alignPixiApp();
		this.alignMainContainer();
	}

	private refreshSize():void {
		if (window.outerHeight !== 0) {
			this._size.width = window.innerWidth;
			this._size.height = window.innerHeight;
		} else { // needed to avoid some iOS troubles
			this._size.width = document.body.scrollWidth;
			this._size.height = document.body.scrollHeight;
		}
	}

	private alignPixiApp():void {
		Pixi.app.renderer.view.style.width = this._size.width + "px";
		Pixi.app.renderer.view.style.height = this._size.height + "px";
		Pixi.app.renderer.resize(this._size.width, this._size.height);
	}

	private alignMainContainer():void {
		const scaleByWidth:number = this._size.width / MainContainer.WIDTH;
		const scaleByHeight:number = this._size.height / MainContainer.HEIGHT;
		this._mainContainer.scale.x = this._mainContainer.scale.y = Math.min(scaleByWidth, scaleByHeight);
		this._mainContainer.x = (this._size.width - MainContainer.WIDTH * this._mainContainer.scale.x) / 2;
		this._mainContainer.y = (this._size.height - MainContainer.HEIGHT * this._mainContainer.scale.y) / 2;
	}
}