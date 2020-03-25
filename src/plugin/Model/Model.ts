import IState from './IState';
import Observer from '../Observer/Observer';
import Orientation from '../Types/Orientation';
import Validator from './Validator';

class Model {
  private observer = new Observer();

  private state: IState = {
    isRange: false,
    isTips: true,
    max: 100,
    min: 0,
    orientation: Orientation.Horizontal,
    step: 1,
    values: [0, 100],
  };

  constructor(props?: IState) {
    if (props) {
      this.setState(props);
    }
  }

  public setState(state: IState) {
    const { min, max } = Validator.validateMinMax(state);
    const step = Validator.validateStep(state);
    const values = Validator.validateValues(state);
    this.state = {
      ...this.state,
      max,
      min,
      step,
      values,
    };
    this.emitChangeEvent();
  }

  public getState(): IState {
    return { ...this.state };
  }

  public setMin(min: number) {
    if (min < this.state.max) {
      this.state.min = min;
      this.recalculateValue();
    }

    this.emitChangeEvent();
  }

  public getMin(): number {
    return this.state.min;
  }

  public setMax(max: number) {
    if (max > this.state.min) {
      this.state.max = max;
      this.recalculateValue();
    }

    this.emitChangeEvent();
  }

  public getMax(): number {
    return this.state.max;
  }

  public setRange(isRange: boolean) {
    if (!this.state.isRange && isRange) {
      this.state.isRange = isRange;
      if (this.state.values[0] === this.state.max) {
        this.state.values[0] = this.state.max - this.state.step;
      }
      this.setNewValue(this.state.values[1], 1);
    }
    this.state.isRange = isRange;
    this.emitChangeEvent();
  }

  public getRange(): boolean {
    return this.state.isRange;
  }

  public setOrientation(orientation: Orientation) {
    this.state.orientation = orientation;
    this.emitChangeEvent();
  }

  public getOrientation(): Orientation {
    return this.state.orientation;
  }

  public setStep(step: number) {
    if (this.isValidStep(step)) {
      this.state.step = step;
      this.recalculateValue();
    }

    this.emitChangeEvent();
  }

  public getStep(): number {
    return this.state.step;
  }

  public setValue(value: number, pointer: number = 0) {
    this.setNewValue(value, pointer);
    this.emitChangeEvent();
  }

  public getValue(pointer: number = 0): number {
    return this.state.values[pointer];
  }

  public setPointPosition(position: number, pointer: number = 0) {
    const value = position >= 1 ? this.state.max : this.getValueByPosition(position);
    this.setNewValue(value, pointer);
    this.emitChangeEvent();
  }

  public getPointPosition(pointer: number = 0): number {
    return (this.state.values[pointer] - this.state.min) / (this.state.max - this.state.min);
  }

  public setPosition(position: number) {
    if (position >= 1) {
      const pointer = this.state.isRange ? 1 : 0;
      this.state.values[pointer] = this.state.max;
      this.emitChangeEvent();
      return;
    }

    if (this.state.isRange) {
      const value = this.getValueByPosition(position);
      if (value < this.state.values[0]) {
        this.setNewValue(value, 0);
      } else if (value > this.state.values[1]) {
        this.setNewValue(value, 1);
      } else {
        const pointer = this.closestPointer(value);
        this.setNewValue(value, pointer);
      }
    } else {
      this.setPointPosition(position, 0);
    }

    this.emitChangeEvent();
  }

  public setTooltipVisibility(isVisible: boolean) {
    this.state.isTips = isVisible;
    this.emitChangeEvent();
  }

  public getTooltipVisibility(): boolean {
    return this.state.isTips;
  }

  public addListener(event: string, fn: () => void) {
    this.observer.add(event, fn);
  }

  private recalculateValue() {
    if (this.state.isRange) {
      const high = this.state.values[1] <= this.state.min ? this.state.min + this.state.step : this.state.values[1];
      this.setValue(high, 1);
    }
    this.setValue(this.state.values[0], 0);
  }

  private getValueByPosition(position: number): number {
    return Math.round((this.state.max - this.state.min) * position + this.state.min);
  }

  private roundByStep(value: number): number {
    return Math.round((value - this.state.min) / this.state.step) * this.state.step + this.state.min;
  }

  private emitChangeEvent() {
    this.observer.emit('change');
  }

  private isValidStep(step: number) {
    return (this.state.max - this.state.min) >= step && step > 0;
  }

  private setNewValue(value: number, pointer: number) {
    const constraint = this.getConstraint(pointer);
    let roundedValue = (value === this.state.max) ? value : this.roundByStep(value);
    if (roundedValue < constraint.min) {
      roundedValue = constraint.min;
    } else if (roundedValue > constraint.max) {
      roundedValue = constraint.max;
    }
    this.state.values[pointer] = roundedValue;
  }

  private getConstraint(pointer: number): { min: number, max: number } {
    const constraint = { min: this.state.min, max: this.state.max };

    if (pointer === 0) {
      constraint.min = this.state.min;
      constraint.max = this.state.isRange ? this.state.values[1] - this.state.step : this.state.max;
    } else {
      constraint.max = this.state.max;
      constraint.min = this.state.isRange ? this.state.values[0] + this.state.step : this.state.min;
    }

    return constraint;
  }

  private closestPointer(value: number): number {
    const distanceToLow = value - this.state.values[0];
    const distanceToHigh = this.state.values[1] - value;
    if (distanceToLow <= distanceToHigh) {
      return 0;
    }

    return 1;
  }
}

export default Model;
