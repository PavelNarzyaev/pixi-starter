import ViewWithListenersControl from "./ViewWithListenersControl";
import {POINTER_DOWN, POINTER_OUT, POINTER_OVER, POINTER_UP, POINTER_UP_OUTSIDE} from "../../PointerEvents";
import IListenerState from "../../interfaces/IListenerState";
import IListener from "../../interfaces/IListener";
import IEvent from "../../interfaces/IEvent";

export default class InteractiveView extends ViewWithListenersControl {
	public static readonly CLICK:symbol = Symbol();
	public static readonly PRESS:symbol = Symbol();
	public static readonly RELEASE:symbol = Symbol();
	private _overListenerId:number;
	private _outListenerId:number;
	private _downListenerId:number;
	private _upListenerId:number;
	private _upOutsideListenerId:number;

	private _down:boolean = false;

	constructor() {
		super();
		this.interactive = true;
		this.initListeners();
		this.onListener(this._overListenerId);
	}

	private initListeners():void {
		this._overListenerId = this.registerListener(this, POINTER_OVER, this.pointerOverHandler, this);
		this._outListenerId = this.registerListener(this, POINTER_OUT, this.pointerOutHandler, this);
		this._downListenerId = this.registerListener(this, POINTER_DOWN, this.pointerDownHandler, this);
		this._upListenerId = this.registerListener(this, POINTER_UP, this.pointerUpHandler, this);
		this._upOutsideListenerId = this.registerListener(this, POINTER_UP_OUTSIDE, this.pointerUpOutsideHandler, this);
	}

	private pointerOverHandler():void {
		this.offListener(this._overListenerId);
		this.onListener(this._outListenerId);
		if (!this._down) {
			this.onListener(this._downListenerId);
		} else {
			this.offListener(this._upOutsideListenerId);
			this.onListener(this._upListenerId);
		}
	}

	private pointerOutHandler():void {
		this.offListener(this._outListenerId);
		if (!this._down) {
			this.offListener(this._downListenerId);
		} else {
			this.offListener(this._upListenerId);
			this.onListener(this._upOutsideListenerId);
		}
		this.onListener(this._overListenerId);
	}

	private pointerDownHandler():void {
		this.offListener(this._downListenerId);
		this.onListener(this._upListenerId);
		this._down = true;
		this.emit(InteractiveView.PRESS);
	}

	private pointerUpHandler():void {
		this.offListener(this._upListenerId);
		this.onListener(this._downListenerId);
		this._down = false;
		this.emit(InteractiveView.RELEASE);
		this.emit(InteractiveView.CLICK);
	}

	private pointerUpOutsideHandler():void {
		this.offListener(this._upOutsideListenerId);
		this._down = false;
		this.emit(InteractiveView.RELEASE);
	}

	// FIXME: temporary code
	public getListeners():IListener[] {
		const listeners:IListener[] = [];
		listeners.push({ name:"over", id:this._overListenerId });
		listeners.push({ name:"out", id:this._outListenerId });
		listeners.push({ name:"down", id:this._downListenerId });
		listeners.push({ name:"up", id:this._upListenerId });
		listeners.push({ name:"up outside", id:this._upOutsideListenerId });
		return listeners;
	}

	// FIXME: temporary code
	public getListenersStates():IListenerState[] {
		const states:IListenerState[] = [];
		states.push({ id:this._overListenerId, added:this.getListenerState(this._overListenerId) });
		states.push({ id:this._outListenerId, added:this.getListenerState(this._outListenerId) });
		states.push({ id:this._downListenerId, added:this.getListenerState(this._downListenerId) });
		states.push({ id:this._upListenerId, added:this.getListenerState(this._upListenerId) });
		states.push({ id:this._upOutsideListenerId, added:this.getListenerState(this._upOutsideListenerId) });
		return states;
	}

	// FIXME: temporary code
	public getEvents():IEvent[] {
		const events:IEvent[] = [];
		events.push({ name:"click", symbol:InteractiveView.CLICK });
		events.push({ name:"press", symbol:InteractiveView.PRESS });
		events.push({ name:"release", symbol:InteractiveView.RELEASE });
		return events;
	}
}