import View from "./View";
import EventEmitter = PIXI.utils.EventEmitter;

export default class ViewWithListenersControl extends View {
	public static readonly CHANGE:symbol = Symbol(); // FIXME: temporary code
	private _listeners:Map<number, ViewListener>;
	private _addedListenersCounter:number = 0;

	public registerListener(
		target:EventEmitter,
		event:string|symbol,
		fn:(...params:any[]) => void,
		context:any,
	):number {
		this._addedListenersCounter++;
		if (!this._listeners) {
			this._listeners = new Map<number, ViewListener>();
		}
		this._listeners.set(this._addedListenersCounter, new ViewListener(target, event, fn, context));
		this.emit(ViewWithListenersControl.CHANGE);
		return this._addedListenersCounter;
	}

	public unregisterListener(listenerId:number):void {
		this._listeners.get(listenerId).off();
		this._listeners.delete(listenerId);
		this.emit(ViewWithListenersControl.CHANGE);
	}

	public onListener(listenerId:number):void {
		this._listeners.get(listenerId).on();
		this.emit(ViewWithListenersControl.CHANGE);
	}

	public onListeners():void {
		this._listeners.forEach((listener:ViewListener) => {
			listener.on();
		});
		this.emit(ViewWithListenersControl.CHANGE);
	}

	public offListener(listenerId:number):void {
		this._listeners.get(listenerId).off();
		this.emit(ViewWithListenersControl.CHANGE);
	}

	public offListeners():void {
		this._listeners.forEach((listener:ViewListener) => {
			listener.off();
		});
		this.emit(ViewWithListenersControl.CHANGE);
	}

	// FIXME: temporary code
	protected getListenerState(listenerId:number):boolean {
		return this._listeners.get(listenerId).added;
	}
}

class ViewListener {
	public added:boolean = false;

	constructor(
		public target:EventEmitter,
		public event:string|symbol,
		public fn:(...params:any[]) => void,
		public context:any,
	) {}

	public on():void {
		if (!this.added) {
			this.target.on(this.event, this.fn, this.context);
			this.added = true;
		}
	}

	public off():void {
		if (this.added) {
			this.target.off(this.event, this.fn, this.context);
			this.added = false;
		}
	}
}