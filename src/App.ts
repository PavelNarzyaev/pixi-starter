import Application = PIXI.Application;
import EventEmitter = PIXI.utils.EventEmitter;

export default class App {
	public static pixi:Application;
	public static emitter:EventEmitter = new EventEmitter();
}