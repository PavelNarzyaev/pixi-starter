import {POINTER_DOWN, POINTER_OUT, POINTER_OVER, POINTER_UP, POINTER_UP_OUTSIDE} from "../../PointerEvents";
import View from "./View";

export default class InteractiveView extends View {
	public static readonly CLICK:symbol = Symbol();
	public static readonly CHANGE_SELECT:symbol = Symbol();
	public static readonly DEFAULT_STATE:symbol = Symbol();
	public static readonly OVER_STATE:symbol = Symbol();
	public static readonly PRESSED_STATE:symbol = Symbol();
	private _currentState:symbol;
	private _selected:boolean = false;
	private _over:boolean = false;
	private _down:boolean = false;

	constructor(
		protected _selectable:boolean = false,
	) {
		super();
		this.interactive = true;
		this._currentState = InteractiveView.DEFAULT_STATE;
		this.on(POINTER_OVER, this.pointerOverHandler, this);
		this.on(POINTER_OUT, this.pointerOutHandler, this);
		this.on(POINTER_DOWN, this.pointerDownHandler, this);
		this.on(POINTER_UP, this.pointerUpHandler, this);
		this.on(POINTER_UP_OUTSIDE, this.pointerUpOutsideHandler, this);
	}

	private pointerOverHandler():void {
		this._over = true;
		if (!this._down) {
			this.setCurrentState(InteractiveView.OVER_STATE);
		}
	}

	private pointerOutHandler():void {
		this._over = false;
		if (!this._down) {
			this.setCurrentState(InteractiveView.DEFAULT_STATE);
		}
	}

	private pointerDownHandler():void {
		this.press();
	}

	public press():void {
		this._down = true;
		this.setCurrentState(InteractiveView.PRESSED_STATE);
	}

	private pointerUpHandler():void {
		this.release();
	}

	public release():void {
		this._down = false;
		if (this._selectable) {
			this.setSelected(!this.getSelected());
		}
		if (this._over) {
			this.setCurrentState(InteractiveView.OVER_STATE);
		} else {
			this.setCurrentState(InteractiveView.DEFAULT_STATE);
		}
		this.emit(InteractiveView.CLICK);
	}

	private pointerUpOutsideHandler():void {
		this._down = false;
		this.setCurrentState(InteractiveView.DEFAULT_STATE);
	}

	private setCurrentState(currentState:symbol):void {
		this._currentState = currentState;
		this.refreshState();
	}

	protected getCurrentState():symbol {
		return this._currentState;
	}

	public setSelected(value:boolean):void {
		if (value !== this._selected) {
			this._selected = value;
			this.emit(InteractiveView.CHANGE_SELECT);
		}
	}

	public getSelected():boolean {
		return this._selected;
	}

	protected refreshState():void {
	}
}