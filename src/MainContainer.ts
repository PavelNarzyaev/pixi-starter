import Container = PIXI.Container;
import Circle from "./Circle";
import Graphics = PIXI.Graphics;
import {genRandomInteger} from "./Random";

export default class MainContainer extends Container {
	public static readonly WIDTH:number = 700;
	public static readonly HEIGHT:number = 350;
	private static readonly CIRCLES_NUM:number = 30;
	private _background:Graphics;
	private _circles:Set<Circle> = new Set<Circle>();

	constructor() {
		super();
		this.init();
	}

	private init():void {
		this.interactive = true;
		this.addListener("pointerdown", this.refreshCircles, this);

		this.initBackground();
		this.createCircles();
	}

	private refreshCircles():void {
		this.removeCircles();
		this.createCircles();
	}

	private initBackground():void {
		this._background = new Graphics();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, MainContainer.WIDTH, MainContainer.HEIGHT);
		this._background.endFill();
		this.addChild(this._background);
	}

	private createCircles():void {
		let i:number = 0;
		while (i < MainContainer.CIRCLES_NUM) {
			const circle:Circle = new Circle();
			circle.x = genRandomInteger(circle.radius, MainContainer.WIDTH - circle.radius);
			circle.y = genRandomInteger(circle.radius, MainContainer.HEIGHT / 2 - circle.radius);
			this.addChild(circle);
			this._circles.add(circle);
			i++;
		}
	}

	private removeCircles():void {
		this._circles.forEach((circle:Circle) => {
			circle.parent.removeChild(circle);
		});
		this._circles.clear();
	}
}