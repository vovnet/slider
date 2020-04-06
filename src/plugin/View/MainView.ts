import './slider.scss';
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

  private data: IData;

  private minMax: MinMax;

  constructor(container: HTMLElement, controller: Controller) {
    this.orientation = Orientation.Vertical;
    this.controller = controller;
    this.container = container;

    this.init();
  }

  public update(data: IData) {
    this.data = data;
    this.track.update(this.data.orientation);
    this.updateFill();
    this.updatePointers();
    this.updateTip();
    const minPos = this.track.getAbsolutePosition(0);
    const maxPos = this.track.getAbsolutePosition(1);
    this.minMax.update({
      max: this.data.max.toString(),
      maxPos,
      min: this.data.min.toString(),
      minPos,
      orientation: this.data.orientation,
    });
  }

  private init() {
    this.sliderElement = document.createElement('div');
    this.sliderElement.classList.add('slider');
    this.container.appendChild(this.sliderElement);
    this.track = new Track(this.sliderElement);
    this.track.update(this.orientation);
    this.fill = new Fill(this.track.getElement());
    this.fill.update({
      high: 0,
      low: 0,
      orientation: this.orientation,
    });
    this.createPointer('low');
    this.sliderElement.addEventListener('click', this.onClick);
    this.tipManager = new TipManager(this.sliderElement);
    this.tipManager.setDragListener(this.onDrag);
    this.minMax = new MinMax(this.sliderElement, this.controller);
  }

  private onClick = (event: MouseEvent) => {
    const target: HTMLElement = (event.target as HTMLElement);
    if (MainView.isTrack(target)) {
      const position: number = this.track.getRelativePosition(event.clientX, event.clientY);
      this.controller.setPosition(position);
    }
  }

  private onDrag = (key: string, x: number, y: number) => {
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
    pointer.setDragListener(this.onDrag);
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
    const { data, fill } = { ...this };
    let lowPos: number;
    let highPos: number;

    if (data.isRange) {
      lowPos = data.low * 100;
      highPos = (1 - data.high) * 100;
    } else {
      lowPos = 0;
      highPos = (1 - data.low) * 100;
    }

    fill.update({
      high: highPos,
      low: lowPos,
      orientation: data.orientation,
    });
  }

  private updateTip() {
    const { data, pointers, track } = { ...this };
    let lowPosition: number = 0;
    let highPosition: number = 0;

    let pointer: Pointer | undefined = pointers.get('low');
    if (pointer) {
      lowPosition = track.getAbsolutePosition(data.low);
    }

    pointer = pointers.get('high');
    if (pointer) {
      highPosition = track.getAbsolutePosition(data.high);
    }

    const tipData = new TipData(
      { value: data.values[0], position: lowPosition },
      { value: data.values[1], position: highPosition },
      data.orientation,
      data.isRange,
      data.isTips,
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

interface IData {
  max: number,
  min: number,
  low: number,
  high: number,
  orientation: Orientation,
  isRange: boolean,
  isTips: boolean,
  step: number,
  values: number[],
}

export default MainView;
