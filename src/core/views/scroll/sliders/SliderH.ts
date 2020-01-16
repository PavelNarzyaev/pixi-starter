import View from "../../View";
import SliderAbstractH from "./SliderAbstractH";
import InteractiveView from "../../InteractiveView";
import Thumb from "../Thumb";
import GraphicsView from "../../GraphicsView";

export default class SliderH extends SliderAbstractH {
	protected backgroundFactory():View {
		return new GraphicsView(0x282828);
	}

	protected thumbFactory():InteractiveView {
		return new Thumb();
	}
}