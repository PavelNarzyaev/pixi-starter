import ScrollAbstract from "../../core/views/scroll/ScrollAbstract";
import SliderAbstractV from "../../core/views/scroll/sliders/SliderAbstractV";
import SliderV from "./SliderV";
import SliderAbstractH from "../../core/views/scroll/sliders/SliderAbstractH";
import SliderH from "./SliderH";

export default class Scroll extends ScrollAbstract {
	protected verticalSliderFactory():SliderAbstractV {
		return new SliderV();
	}

	protected horizontalSliderFactory():SliderAbstractH {
		return new SliderH();
	}
}