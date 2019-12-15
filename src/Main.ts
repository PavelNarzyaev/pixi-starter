
import Rectangle = PIXI.Rectangle;
import Application = PIXI.Application;
import Pixi from "./Pixi";
import MainView from "./views/MainView";

export class Main {
	private static readonly MIN_MAIN_CONTAINER_WIDTH:number = 800;
	private static readonly MIN_MAIN_CONTAINER_HEIGHT:number = 500;
	private _size:Rectangle;
	private _mainView:MainView;

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
			antialias: true,
			backgroundColor: 0x000000,
			view: document.getElementById(canvasId) as HTMLCanvasElement,
			// needed to avoid troubles with invisible fonts on some Android devices
			resolution: ((devicePixelRatio || 1) < 2) ? 1 : 2,
		});
	}

	private initMainContainer():void {
		this._mainView = new MainView();
		Pixi.app.stage.addChild(this._mainView);
	}

	private resize():void {
		this.refreshSize();
		this.alignPixiApp();
		this.alignMainContainer();
	}

	private refreshSize():void {
		this._size.width = window.innerWidth;
		this._size.height = window.innerHeight;
	}

	private alignPixiApp():void {
		Pixi.app.renderer.view.style.width = this._size.width + "px";
		Pixi.app.renderer.view.style.height = this._size.height + "px";
		Pixi.app.renderer.resize(this._size.width, this._size.height);
	}

	private alignMainContainer():void {
		let targetWidth:number = Math.max(Main.MIN_MAIN_CONTAINER_WIDTH, this._size.width);
		let targetHeight:number = Math.max(Main.MIN_MAIN_CONTAINER_HEIGHT, this._size.height);
		const scaleByWidth:number = this.calculateObjectScale(this._size.width, targetWidth);
		const scaleByHeight:number = this.calculateObjectScale(this._size.height, targetHeight);
		if (scaleByWidth < scaleByHeight) {
			targetHeight = Math.floor((targetWidth * this._size.height) / this._size.width);
		} else if (scaleByHeight < scaleByWidth) {
			targetWidth = Math.floor((targetHeight * this._size.width) / this._size.height);
		}
		this._mainView.setSize(targetWidth, targetHeight);
		this._mainView.scale.x = this._mainView.scale.y = Math.min(scaleByWidth, scaleByHeight);
		this._mainView.x = Math.floor((this._size.width - this._mainView.w * this._mainView.scale.x) / 2);
		this._mainView.y = Math.floor((this._size.height - this._mainView.h * this._mainView.scale.y) / 2);
	}

	private calculateObjectScale(frameSize:number, objectSize:number):number {
		return frameSize < objectSize ? frameSize / objectSize : 1;
	}
}