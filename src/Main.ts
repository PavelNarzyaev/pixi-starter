import * as PIXI from "pixi.js";
import MainContainer from "./MainContainer";

export class Main extends PIXI.Container {
	private _size:PIXI.Rectangle;
	private _pixiApp:PIXI.Application;
	private _mainContainer:MainContainer;

	constructor(canvasId:string) {
		super();
		this.initSize();
		this.initPixiApp(canvasId);
		this.initMainContainer();
		window.onresize = () => { this.resize(); };
		this.resize();
	}

	private initSize():void {
		this._size = new PIXI.Rectangle();
	}

	private initPixiApp(canvasId:string):void {
		this._pixiApp = new PIXI.Application({
			backgroundColor: 0x000000,
			view: document.getElementById(canvasId) as HTMLCanvasElement,
			// needed to avoid troubles with invisible fonts on some Android devices
			resolution: ((devicePixelRatio || 1) < 2) ? 1 : 2,
		});
		this._pixiApp.stage.addChild(this);
	}

	private initMainContainer():void {
		this._mainContainer = new MainContainer();
		this._pixiApp.stage.addChild(this._mainContainer);
	}

	private resize():void {
		this.refreshSize();
		this.alignPixiApp();
		this.alignContainer();
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
		this._pixiApp.renderer.view.style.width = this._size.width + "px";
		this._pixiApp.renderer.view.style.height = this._size.height + "px";
		this._pixiApp.renderer.resize(this._size.width, this._size.height);
	}

	private alignContainer():void {
		const scaleByWidth:number = this._size.width / MainContainer.WIDTH;
		const scaleByHeight:number = this._size.height / MainContainer.HEIGHT;
		this._mainContainer.scale.x = this._mainContainer.scale.y = Math.min(scaleByWidth, scaleByHeight);
		this._mainContainer.x = (this._size.width - this._mainContainer.width) / 2;
		this._mainContainer.y = (this._size.height - this._mainContainer.height) / 2;
	}
}