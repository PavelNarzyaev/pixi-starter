import View from "../../core/views/View";
import SliderAbstractH from "../../core/views/scroll/sliders/SliderAbstractH";
import InteractiveView from "../../core/views/InteractiveView";
import Thumb from "./Thumb";
import GraphicsView from "../../core/views/GraphicsView";

export default class SliderH extends SliderAbstractH {
	protected backgroundFactory():View {
		return new GraphicsView(0x282828);
	}

	protected thumbFactory():InteractiveView {
		return new Thumb();
	}
}