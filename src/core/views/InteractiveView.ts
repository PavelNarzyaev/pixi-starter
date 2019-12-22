import {POINTER_DOWN, POINTER_OUT, POINTER_OVER, POINTER_UP, POINTER_UP_OUTSIDE} from "../../PointerEvents";
import View from "./View";

export default class InteractiveView extends View {
	public static readonly CLICK:symbol = Symbol();
	public static readonly PRESS:symbol = Symbol();
	public static readonly RELEASE:symbol = Symbol();
	public static readonly DEFAULT_STATE:symbol = Symbol();
	public static readonly OVER_STATE:symbol = Symbol();
	public static readonly PRESSED_STATE:symbol = Symbol();
	private _state:symbol;
	private _over:boolean = false;
	private _down:boolean = false;

	constructor() {
		super();
		this.interactive = true;
		this._state = InteractiveView.DEFAULT_STATE;
		this.on(POINTER_OVER, this.pointerOverHandler, this);
		this.on(POINTER_OUT, this.pointerOutHandler, this);
		this.on(POINTER_DOWN, this.pointerDownHandler, this);
		this.on(POINTER_UP, this.pointerUpHandler, this);
		this.on(POINTER_UP_OUTSIDE, this.pointerUpOutsideHandler, this);
	}

	private pointerOverHandler():void {
		this._over = true;
		if (!this._down) {
			this.setState(InteractiveView.OVER_STATE);
		}
	}

	private pointerOutHandler():void {
		this._over = false;
		if (!this._down) {
			this.setState(InteractiveView.DEFAULT_STATE);
		}
	}

	private pointerDownHandler():void {
		this._down = true;
		this.setState(InteractiveView.PRESSED_STATE);
		this.emit(InteractiveView.PRESS);
	}

	private pointerUpHandler():void {
		this._down = false;
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
		this.setState(InteractiveView.DEFAULT_STATE);
		this.emit(InteractiveView.RELEASE);
	}

	private setState(state:symbol):void {
		this._state = state;
		this.refreshState(this._state);
	}

	protected refreshState(state:symbol):void {
	}
}