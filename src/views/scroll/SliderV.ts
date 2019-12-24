import View from "../../core/views/View";
import SliderAbstractV from "../../core/views/scroll/sliders/SliderAbstractV";
import InteractiveView from "../../core/views/InteractiveView";
import Thumb from "./Thumb";
import GraphicsView from "../../core/views/GraphicsView";

export default class SliderV extends SliderAbstractV {
	protected backgroundFactory():View {
		return new GraphicsView(0x282828);
	}

	protected thumbFactory():InteractiveView {
		return new Thumb();
	}
}