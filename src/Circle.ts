import Graphics = PIXI.Graphics;
import {genRandomColor, genRandomInteger} from "./Random";

export default class Circle extends Graphics {
	private static readonly MIN_RADIUS:number = 20;
	private static readonly MAX_RADIUS:number = 50;
	private _radius:number;

	constructor() {
		super();

		this._radius = genRandomInteger(Circle.MIN_RADIUS, Circle.MAX_RADIUS);
		this.beginFill(genRandomColor());
		this.drawCircle(0, 0, this._radius);
		this.endFill();
	}

	public get radius():number {
		return this._radius;
	}
}