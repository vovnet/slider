import Model from '../Model/Model';
import View from '../View/MainView';

class Controller {
  private model: Model;

  private view: View;

  constructor(container: HTMLElement, model: Model) {
    this.model = model;
    this.init(container);
  }

  public setPosition(pos: number) {
    this.model.setPosition(pos);
  }

  public setPointPosition(pos: number, pointer: number) {
    this.model.setPointPosition(pos, pointer);
  }

  private init(container: HTMLElement) {
    this.view = new View(container, this);
    this.updateView();
    this.model.addListener('change', this.onChangeModel);
    window.addEventListener('resize', this.onResize);
  }

  private onChangeModel = () => {
    this.updateView();
  }

  private updateView() {
    const low = this.model.getPointPosition(0);
    const high = this.model.getPointPosition(1);
    this.view.update({ ...this.model.getState(), low, high });
  }

  private onResize = () => {
    this.updateView();
  }
}

export default Controller;
