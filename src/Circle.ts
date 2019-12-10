import Graphics = PIXI.Graphics;
import {genRandomColor, genRandomInteger} from "./Random";

export default class Circle extends Graphics {
	private static readonly MIN_RADIUS:number = 20;
	private static readonly MAX_RADIUS:number = 50;
	private static readonly MIN_SPEED:number = 3;
	private static readonly MAX_SPEED:number = 5;
	public speedX:number;
	public speedY:number;
	private _radius:number;

	constructor() {
		super();

		this.speedX = this.genRandomSpeed();
		this.speedY = this.genRandomSpeed();

		this._radius = genRandomInteger(Circle.MIN_RADIUS, Circle.MAX_RADIUS);
		this.beginFill(genRandomColor());
		this.drawCircle(0, 0, this._radius);
		this.endFill();
	}

	private genRandomSpeed():number {
		let speed:number = genRandomInteger(Circle.MIN_SPEED, Circle.MAX_SPEED);
		if (Math.random() > .5) {
			speed *= -1;
		}
		return  speed;
	}

	public get radius():number {
		return this._radius;
	}
}