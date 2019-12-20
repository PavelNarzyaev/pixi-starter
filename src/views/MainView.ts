import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import InteractiveView from "../core/views/InteractiveView";
import EventEmitter = PIXI.utils.EventEmitter;
import ViewWithListenersControl from "../core/views/ViewWithListenersControl";
import TestInteractiveView from "./TestInteractiveView";
import ListenersBlock from "./blocks/listeners-block/ListenersBlock";
import EventsBlock from "./blocks/events-block/EventsBlock";

export default class MainView extends View {
	private _background:Graphics;
	private _interactiveView:TestInteractiveView;
	private _listenersBlock:ListenersBlock;
	private _eventsBlock:EventsBlock;

	constructor() {
		super();
		this.initBackground();
		this.initInteractiveView();
		this.initListenersBlock();
		this.refreshListenersBlock();
		this.initEventsBlock();
	}

	private initBackground():void {
		this._background = new Graphics();
		this.addChild(this._background);
	}

	private initInteractiveView():void {
		this._interactiveView = new TestInteractiveView();
		(this._interactiveView as EventEmitter).on(
			ViewWithListenersControl.CHANGE,
			() => { this.interactiveViewChangeHandler(); }
		);
		(this._interactiveView as EventEmitter).on(
			InteractiveView.CLICK,
			() => { this.interactiveViewClickHandler(InteractiveView.CLICK); }
		);
		(this._interactiveView as EventEmitter).on(
			InteractiveView.PRESS,
			() => { this.interactiveViewClickHandler(InteractiveView.PRESS); }
		);
		(this._interactiveView as EventEmitter).on(
			InteractiveView.RELEASE,
			() => { this.interactiveViewClickHandler(InteractiveView.RELEASE); }
		);
		this.addChild(this._interactiveView);
	}

	private interactiveViewChangeHandler():void {
		if (!this._listenersBlock.dirty) {
			this._listenersBlock.dirty = true;
			window.setTimeout(() => {
				this.refreshListenersBlock();
				this._listenersBlock.dirty = false;
			}, 0);
		}
	}

	private refreshListenersBlock():void {
		this._listenersBlock.getContent().refreshStates(this._interactiveView.getListenersStates());
	}

	private interactiveViewClickHandler(event:symbol):void {
		this._eventsBlock.getContent().eventHandler(event);
	}

	private initListenersBlock():void {
		this._listenersBlock = new ListenersBlock(this._interactiveView.getListeners());
		this._listenersBlock.setSize(300, 230);
		this.addChild(this._listenersBlock);
	}

	private initEventsBlock():void {
		this._eventsBlock = new EventsBlock(this._interactiveView.getEvents());
		this._eventsBlock.setSize(300, 230);
		this.addChild(this._eventsBlock);
	}

	protected applySize():void {
		super.applySize();
		this.alignBackground();
		this.alignInteractiveView();
		this.alignBlocks();
	}

	private alignBackground():void {
		this._background.clear();
		this._background.beginFill(0xffffff);
		this._background.drawRect(0, 0, this.w, this.h);
		this._background.endFill();
	}

	private alignInteractiveView():void {
		this.align(this._interactiveView,
			{
				left: 100,
				right: 100,
				top: 50,
				h: 150,
			}
		)
	}

	private alignBlocks():void {
		this._listenersBlock.y = this._eventsBlock.y = this._interactiveView.y + this._interactiveView.h + 50;

		const gap:number = 20;
		const blocksWidth:number = this._listenersBlock.w + gap + this._eventsBlock.w;
		this._listenersBlock.x = Math.floor((this.w - blocksWidth) / 2);
		this._eventsBlock.x = this._listenersBlock.x + this._listenersBlock.w + gap;
	}
}