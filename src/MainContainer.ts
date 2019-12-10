import Container = PIXI.Container;
import Circle from "./Circle";
import Graphics = PIXI.Graphics;
import {genRandomInteger} from "./Random";

export default class MainContainer extends Container {
	public static readonly WIDTH:number = 700;
	public static readonly HEIGHT:number = 350;
	private static readonly CIRCLES_NUM:number = 30;
	private _background:Graphics;

	constructor() {
		super();
		this.init();
	}

	private init():void {
		this.initBackground();
		this.initCircles();
	}

	private initBackground():void {
		this._background = new Graphics();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, MainContainer.WIDTH, MainContainer.HEIGHT);
		this._background.endFill();
		this.addChild(this._background);
	}

	private initCircles():void {
		let i:number = 0;
		while (i < MainContainer.CIRCLES_NUM) {
			const newCircle:Circle = new Circle();
			newCircle.x = genRandomInteger(newCircle.radius, MainContainer.WIDTH - newCircle.radius);
			newCircle.y = genRandomInteger(newCircle.radius, MainContainer.HEIGHT / 2 - newCircle.radius);
			this.addChild(newCircle);
			i++;
		}
	}
}