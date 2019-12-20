import Graphics = PIXI.Graphics;
import View from "../core/views/View";
import InteractiveView from "../core/views/InteractiveView";
import EventEmitter = PIXI.utils.EventEmitter;
import ViewWithListenersControl from "../core/views/ViewWithListenersControl";
import TestInteractiveView from "./TestInteractiveView";
import ListenersBlock from "./blocks/listeners-block/ListenersBlock";
import EventsBlock from "./blocks/events-block/EventsBlock";
import StatesBlock from "./blocks/states-block/StatesBlock";
import Block from "./blocks/Block";

export default class MainView extends View {
	private _background:Graphics;
	private _interactiveView:TestInteractiveView;
	private _listenersBlock:ListenersBlock;
	private _eventsBlock:EventsBlock;
	private _statesBlock:StatesBlock;
	private _blocks:Block[] = [];

	constructor() {
		super();
		this.initBackground();
		this.initInteractiveView();
		this._listenersBlock = this.initBlock(new ListenersBlock(this._interactiveView.getListeners()));
		this.refreshListenersBlock();
		this._eventsBlock = this.initBlock(new EventsBlock(this._interactiveView.getEvents()));
		this._statesBlock = this.initBlock(new StatesBlock(this._interactiveView.getStates()));
		this.refreshStatesBlock();
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
		(this._interactiveView as EventEmitter).on(
			TestInteractiveView.CHANGED_STATE,
			() => { this.refreshStatesBlock(); }
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

	private refreshStatesBlock():void {
		this._statesBlock.getContent().setState(this._interactiveView.getState());
	}

	private initBlock<T extends Block>(block:T):T {
		block.setSize(230, 230);
		this.addChild(block);
		this._blocks.push(block);
		return block;
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
		const gap:number = 20;

		let totalBlocksWidth:number = (this._blocks.length - 1) * gap;
		this._blocks.forEach((block:Block) => {
			totalBlocksWidth += block.w;
		});

		const blocksY:number = this._interactiveView.y + this._interactiveView.h + 50;
		let nextX:number = Math.floor((this.w - totalBlocksWidth) / 2);
		this._blocks.forEach((block:Block) => {
			block.y = blocksY;
			block.x = nextX;
			nextX += block.w + gap;
		});
	}
}