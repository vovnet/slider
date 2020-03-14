import Orientation from '../../types/Orientation';

class TipData {
  public isRange: boolean;

  public orientation: Orientation;

  public low: { value: number, position: number };

  public hight: { value: number, position: number };

  public isVisible: boolean;

  constructor(
    low: { value: number, position: number },
    hight: { value: number, position: number },
    orientation: Orientation,
    isRange: boolean,
    isVisible: boolean,
  ) {
    this.isRange = isRange;
    this.orientation = orientation;
    this.low = { value: low.value, position: low.position };
    this.hight = { value: hight.value, position: hight.position };
    this.isVisible = isVisible;
  }
}

export default TipData;