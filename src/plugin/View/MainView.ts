import '../scss/slider.scss';
import Controller from '../Controller/Controller';
import Fill from './Fill';
import MinMax from './Labels/MinMax';
import Orientation from '../Types/Orientation';
import Pointer from './Pointer';
import TipData from './Tip/TipData';
import TipManager from './Tip/TipManager';
import Track from './Track';

class MainView {
  private static isTrack(element: HTMLElement) {
    return element.classList.contains('slider__fill') || element.classList.contains('slider__track');
  }

  private controller: Controller;

  private container: HTMLElement;

  private sliderElement: HTMLElement;

  private track: Track;

  private fill: Fill;

  private pointers: Map<string, Pointer> = new Map<string, Pointer>();

  private orientation: Orientation;

  private tipManager: TipManager;

  private data: {
    max: number,
    min: number,
    low: number,
    high: number,
    orientation: Orientation,
    isRange: boolean,
    isTips: boolean,
    step: number,
    values: number[],
  };

  private minMax: MinMax;

  constructor(container: HTMLElement, controller: Controller) {
    this.orientation = Orientation.Vertical;
    this.controller = controller;
    this.container = container;

    this.init();
  }

  public update(data: {
    max: number,
    min: number,
    low: number,
    high: number,
    orientation: Orientation,
    isRange: boolean,
    isTips: boolean,
    step: number,
    values: number[],
  }) {
    this.data = data;
    this.track.update(this.data.orientation);
    this.updateFill();
    this.updatePointers();
    this.updateTip();
    const minPos = this.track.getAbsolutePosition(0);
    const maxPos = this.track.getAbsolutePosition(1);
    this.minMax.update(
      this.data.min.toString(),
      this.data.max.toString(),
      this.data.orientation,
      minPos,
      maxPos,
    );
  }

  private init() {
    this.sliderElement = document.createElement('div');
    this.sliderElement.classList.add('slider');
    this.container.appendChild(this.sliderElement);
    this.track = new Track(this.sliderElement);
    this.track.update(this.orientation);
    this.fill = new Fill(this.track.getElement());
    this.fill.update(0, 0, this.orientation);
    this.createPointer('low');
    this.sliderElement.addEventListener('click', this.onClick.bind(this));
    this.tipManager = new TipManager(this.sliderElement);
    this.tipManager.setDragListener(this.onDrag.bind(this));
    this.minMax = new MinMax(this.sliderElement, this.controller);
  }

  private onClick(event: MouseEvent) {
    const target: HTMLElement = (event.target as HTMLElement);
    if (MainView.isTrack(target)) {
      const position: number = this.track.getRelativePosition(event.clientX, event.clientY);
      this.controller.setPosition(position);
    }
  }

  private onDrag(key: string, x: number, y: number) {
    const position: number = this.track.getRelativePosition(x, y);
    const id: number = (key === 'low') ? 0 : 1;
    this.controller.setPointPosition(position, id);
  }

  private createPointer(key: string) {
    if (this.pointers.has(key)) {
      return;
    }

    const pointer = new Pointer(this.track.getElement(), key);
    this.pointers.set(key, pointer);
    pointer.update(0, this.orientation);
    pointer.setDragListener(this.onDrag.bind(this));
  }

  private updatePointers() {
    let pointer: Pointer | undefined = this.pointers.get('low');
    if (pointer) {
      const pointerPosition: number = this.track.getAbsolutePosition(this.data.low);
      pointer.update(pointerPosition, this.data.orientation);
    }

    if (this.data.isRange) {
      this.createPointer('high');
      pointer = this.pointers.get('high');
      if (pointer) {
        const pointerPosition = this.track.getAbsolutePosition(this.data.high);
        pointer.update(pointerPosition, this.data.orientation);
      }
    } else {
      this.destroyPointer('high');
    }
  }

  private updateFill() {
    let lowPos: number;
    let highPos: number;

    if (this.data.isRange) {
      lowPos = this.data.low * 100;
      highPos = (1 - this.data.high) * 100;
    } else {
      lowPos = 0;
      highPos = (1 - this.data.low) * 100;
    }

    this.fill.update(lowPos, highPos, this.data.orientation);
  }

  private updateTip() {
    let lowPosition: number = 0;
    let highPosition: number = 0;

    let pointer: Pointer | undefined = this.pointers.get('low');
    if (pointer) {
      lowPosition = this.track.getAbsolutePosition(this.data.low);
    }

    pointer = this.pointers.get('high');
    if (pointer) {
      highPosition = this.track.getAbsolutePosition(this.data.high);
    }

    const tipData = new TipData(
      { value: this.data.values[0], position: lowPosition },
      { value: this.data.values[1], position: highPosition },
      this.data.orientation,
      this.data.isRange,
      this.data.isTips,
    );

    this.tipManager.update(tipData);
  }

  private destroyPointer(key: string) {
    if (this.pointers.has(key)) {
      const pointer: Pointer | undefined = this.pointers.get(key);
      if (pointer) {
        pointer.destroy();
      }

      this.pointers.delete(key);
    }
  }
}

export default MainView;
