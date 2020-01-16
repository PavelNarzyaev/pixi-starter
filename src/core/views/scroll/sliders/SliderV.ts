import View from "../../View";
import SliderAbstractV from "./SliderAbstractV";
import InteractiveView from "../../InteractiveView";
import Thumb from "../Thumb";
import GraphicsView from "../../GraphicsView";

export default class SliderV extends SliderAbstractV {
	protected backgroundFactory():View {
		return new GraphicsView(0x282828);
	}

	protected thumbFactory():InteractiveView {
		return new Thumb();
	}
}