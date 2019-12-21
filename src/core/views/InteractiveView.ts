import ViewWithListenersControl from "./ViewWithListenersControl";
import {POINTER_DOWN, POINTER_OUT, POINTER_OVER, POINTER_UP, POINTER_UP_OUTSIDE} from "../../PointerEvents";
import IListenerState from "../../interfaces/IListenerState";
import IListener from "../../interfaces/IListener";
import IEvent from "../../interfaces/IEvent";
import IInteractiveViewState from "../../interfaces/IInteractiveViewState";

export default class InteractiveView extends ViewWithListenersControl {
	public static readonly CLICK:symbol = Symbol();
	public static readonly PRESS:symbol = Symbol();
	public static readonly RELEASE:symbol = Symbol();
	public static readonly DEFAULT_STATE:symbol = Symbol();
	public static readonly OVER_STATE:symbol = Symbol();
	public static readonly PRESSED_STATE:symbol = Symbol();
	private _overListenerId:number;
	private _outListenerId:number;
	private _downListenerId:number;
	private _upListenerId:number;
	private _upOutsideListenerId:number;
	private _state:symbol = InteractiveView.DEFAULT_STATE;
	private _over:boolean = false;
	private _down:boolean = false;

	constructor() {
		super();
		this.interactive = true;
		this.initListeners();
		this.onListener(this._overListenerId);
		this.onListener(this._downListenerId);
	}

	private initListeners():void {
		this._overListenerId = this.registerListener(this, POINTER_OVER, this.pointerOverHandler, this);
		this._outListenerId = this.registerListener(this, POINTER_OUT, this.pointerOutHandler, this);
		this._downListenerId = this.registerListener(this, POINTER_DOWN, this.pointerDownHandler, this);
		this._upListenerId = this.registerListener(this, POINTER_UP, this.pointerUpHandler, this);
		this._upOutsideListenerId = this.registerListener(this, POINTER_UP_OUTSIDE, this.pointerUpOutsideHandler, this);
	}

	private pointerOverHandler():void {
		this._over = true;
		this.offListener(this._overListenerId);
		this.onListener(this._outListenerId);
		if (!this._down) {
			this.setState(InteractiveView.OVER_STATE);
		}
	}

	private pointerOutHandler():void {
		this._over = false;
		this.offListener(this._outListenerId);
		this.onListener(this._overListenerId);
		if (!this._down) {
			this.setState(InteractiveView.DEFAULT_STATE);
		}
	}

	private pointerDownHandler():void {
		this._down = true;
		this.offListener(this._downListenerId);
		this.onListener(this._upListenerId);
		this.onListener(this._upOutsideListenerId);
		this.setState(InteractiveView.PRESSED_STATE);
		this.emit(InteractiveView.PRESS);
	}

	private pointerUpHandler():void {
		this._down = false;
		this.offListener(this._upListenerId);
		this.offListener(this._upOutsideListenerId);
		this.onListener(this._downListenerId);
		if (this._over) {
			this.setState(InteractiveView.OVER_STATE);
		} else {
			this.setState(InteractiveView.DEFAULT_STATE);
		}
		this.emit(InteractiveView.RELEASE);
		this.emit(InteractiveView.CLICK);
	}

	private pointerUpOutsideHandler():void {
		this._down = false;
		this.offListener(this._upListenerId);
		this.offListener(this._upOutsideListenerId);
		this.onListener(this._downListenerId);
		this.setState(InteractiveView.DEFAULT_STATE);
		this.emit(InteractiveView.RELEASE);
	}

	private setState(state:symbol):void {
		this._state = state;
		this.refreshState(this._state);
	}

	protected refreshState(state:symbol):void {
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

	// FIXME: temporary code
	public getStates():IInteractiveViewState[] {
		const states:IInteractiveViewState[] = [];
		states.push({ name:"default", symbol:InteractiveView.DEFAULT_STATE });
		states.push({ name:"over", symbol:InteractiveView.OVER_STATE });
		states.push({ name:"pressed", symbol:InteractiveView.PRESSED_STATE });
		return states;
	}
}