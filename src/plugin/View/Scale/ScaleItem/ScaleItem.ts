import Orientation from '../../../Types/Orientation';
import OrientationManager from '../../OrientationManager';
import Observer from '../../../Observer/Observer';

class ScaleItem extends Observer {
  private parent: HTMLElement;

  private fieldElement: HTMLElement;

  private key: string;

  private orientationManager: OrientationManager;

  constructor(parent: HTMLElement, key: string) {
    super();
    this.parent = parent;
    this.key = key;

    this.init();
  }

  public update(data: { value: string, position: number, orientation: Orientation }) {
    const { value, position, orientation } = data;
    this.orientationManager.setCurrentOrientation(orientation);
    this.fieldElement.innerHTML = value;
    const rect: DOMRect = this.fieldElement.getBoundingClientRect();
    let pos: number = 0;
    if (orientation === Orientation.Horizontal) {
      pos = position - rect.width / 2;
      this.fieldElement.style.left = `${pos}px`;
    } else {
      pos = position - rect.height / 2;
      this.fieldElement.style.top = `${pos}px`;
    }
  }

  private init() {
    this.fieldElement = document.createElement('div');
    this.fieldElement.classList.add('slider__range');
    this.parent.appendChild(this.fieldElement);
    this.orientationManager = new OrientationManager(this.fieldElement);
    this.orientationManager.addOrientationClass(Orientation.Horizontal, 'slider__range_horizontal');
    this.orientationManager.addOrientationClass(Orientation.Vertical, 'slider__range_vertical');
    this.fieldElement.addEventListener('click', this.handleElementClick);
  }

  private handleElementClick = () => {
    this.emit('click', this.key);
  }
}

export default ScaleItem;
