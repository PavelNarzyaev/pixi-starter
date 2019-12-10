import Container = PIXI.Container;
import Circle from "./Circle";
import Graphics = PIXI.Graphics;
import {genRandomInteger} from "./Random";
import Pixi from "./Pixi";

export default class MainContainer extends Container {
	public static readonly WIDTH:number = 700;
	public static readonly HEIGHT:number = 350;
	private static readonly CIRCLES_NUM:number = 100;
	private _background:Graphics;
	private _circles:Set<Circle> = new Set<Circle>();

	constructor() {
		super();
		this.init();
	}

	private init():void {
		this.interactive = true;
		this.addListener("pointerdown", this.restart, this);

		this.initBackground();
		this.createCircles();
		Pixi.app.ticker.add((dt:number) => this.tick(dt));
	}

	private restart():void {
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
			circle.y = genRandomInteger(circle.radius, MainContainer.HEIGHT - circle.radius);
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

	private tick(dt:number):void {
		this._circles.forEach((circle:Circle) => {
			this.processCircle(
				circle.x + circle.speedX * dt,
				circle.radius,
				MainContainer.WIDTH - circle.radius,
				(newX:number) => circle.x = newX,
				() => circle.speedX *= -1
			);
			this.processCircle(
				circle.y + circle.speedY * dt,
				circle.radius,
				MainContainer.HEIGHT - circle.radius,
				(newY:number) => circle.y = newY,
				() => circle.speedY *= -1
			);
		});
	}

	private processCircle(
		targetPos:number,
		minPos:number,
		maxPos:number,
		setPos:(value:number) => void,
		invertSpeed:() => void
	):void {
		if (targetPos < minPos) {
			setPos(minPos + (minPos - targetPos));
			invertSpeed();
		} else if (targetPos > maxPos) {
			setPos(maxPos - (targetPos - maxPos));
			invertSpeed();
		} else {
			setPos(targetPos);
		}
	}
}