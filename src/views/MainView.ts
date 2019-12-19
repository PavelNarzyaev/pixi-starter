import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import Text = PIXI.Text;
import InteractiveView from "../core/views/InteractiveView";
import EventEmitter = PIXI.utils.EventEmitter;
import ViewWithListenersControl from "../core/views/ViewWithListenersControl";
import TestInteractiveView from "./TestInteractiveView";
import IListenerState from "../interfaces/IListenerState";

export default class MainView extends View {
	private _background:Graphics;
	private _clickField:Text;
	private _clickTimerId:number;
	private _interactiveView:TestInteractiveView;
	private _listenersTitleField:Text;
	private _listenersFields:Text[] = [];
	private _dirty:boolean = false;

	constructor() {
		super();
		this.initBackground();
		this.initClickField();
		this.initInteractiveView();
		this.initListenersTitleField();
		this.refreshListenersFields();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initClickField():void {
		this._clickField = new Text("CLICK EVENT", { fill:0xe5e5e5 });
		this.addChild(this._clickField);
	}

	private initInteractiveView():void {
		this._interactiveView = new TestInteractiveView();
		(this._interactiveView as EventEmitter).on(
			ViewWithListenersControl.CHANGE,
			() => { this.interactiveViewChangeHandler(); }
		);
		(this._interactiveView as EventEmitter).on(
			InteractiveView.CLICK,
			() => { this.interactiveViewClickHandler(); }
		);
		this.addChild(this._interactiveView);
	}

	private interactiveViewChangeHandler():void {
		if (!this._dirty) {
			this._dirty = true;
			window.setTimeout(() => {
				this.refreshListenersFields();
				this._dirty = false;
			}, 0);
		}
	}

	private interactiveViewClickHandler():void {
		if (this._clickTimerId) {
			window.clearTimeout(this._clickTimerId);
		} else {
			this._clickField.style = { fill:0x00ff00 };
		}
		this._clickTimerId = window.setTimeout(() => {
			this._clickTimerId = null;
			this._clickField.style = { fill:0xe5e5e5 };
		}, 500);
	}

	private initListenersTitleField():void {
		this._listenersTitleField = new Text("Event listeners:");
		this.addChild(this._listenersTitleField);
	}

	private refreshListenersFields():void {
		this._interactiveView.createListenersStates().forEach((state:IListenerState, i:number) => {
			let field:Text;
			const fill:number = state.added ? 0x00ff00 : 0xe5e5e5;
			if (i < this._listenersFields.length) {
				field = this._listenersFields[i];
				field.style.fill = fill;
			} else {
				field = new Text(state.name, { fill });
				this.addChild(field);
				this._listenersFields.push(field);
			}
		});
		if (this.w && this.h) {
			this.alignListenersFields();
		}
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignClickField();
		this.alignInteractiveView();
		this.alignListenersTitleField();
		this.alignListenersFields();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}

	private alignClickField():void {
		this._clickField.y = 50;
		this.centerHorizontal(this._clickField);
	}

	private alignInteractiveView():void {
		this.align(this._interactiveView,
			{
				left: 100,
				right: 100,
				top: 100,
				h: 200,
			}
		)
	}

	private alignListenersTitleField():void {
		this._listenersTitleField.x = 120;
		this._listenersTitleField.y = this._interactiveView.y + this._interactiveView.h + 50;
	}

	private alignListenersFields():void {
		let nextY:number = this._listenersTitleField.y + this._listenersTitleField.height;
		this._listenersFields.forEach((field:Text) => {
			field.x = this._listenersTitleField.x;
			field.y = nextY;
			nextY += field.height;
		});
	}
}