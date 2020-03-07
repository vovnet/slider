import Slider from '../../src/model/Slider';
import Orientation from '../../src/types/Orientation';

describe('Slider model.', () => {
  let slider: Slider;

  beforeEach(() => { slider = new Slider(); });

  describe('Min and max methods:', () => {
    test('getMin - check default value', () => {
      expect(slider.getMin()).toBe(0);
    });

    test('setMin should be set', () => {
      const value: number = 5;
      slider.setMin(value);
      expect(slider.getMin()).toBe(value);
    });

    test('min value not be equal or great then max value', () => {
      let value = 100;
      slider.setMin(value);
      expect(slider.getMin()).toBe(0);

      value = 101;
      slider.setMin(value);
      expect(slider.getMin()).toBe(0);
    });

    test('max should be default set value', () => {
      expect(slider.getMax()).toBe(100);
    });

    test('setMax should be set', () => {
      const value = 50;
      slider.setMax(value);
      expect(slider.getMax()).toBe(value);
    });

    test('setMax should not be equal or less them min value', () => {
      let value = 0;
      slider.setMax(value);
      expect(slider.getMax()).toBe(100);

      value = -1;
      slider.setMax(value);
      expect(slider.getMax()).toBe(100);
    });

    test('change min should set low value to min value', () => {
      const low: number = 20;
      slider.setMin(low);
      expect(slider.getValue()).toBe(low);
    });

    test('change min should set hight value to min value + step, if it less', () => {
      const low: number = 50;
      slider.setRange(true);
      slider.setValue(20, 1);
      slider.setMin(low);
      expect(slider.getValue(1)).toBe(low + slider.getStep());
    });

    test('change max should set value to max', () => {
      const max: number = 60;
      slider.setValue(70);
      slider.setMax(max);
      expect(slider.getValue()).toBe(max);
    });

    test('change max in range should set low value to max - step', () => {
      const max: number = 50;
      slider.setRange(true);
      slider.setValue(70);
      slider.setMax(max);
      expect(slider.getValue()).toBe(max - slider.getStep());
    });

    test('should emit change event', () => {
      const changeCallback: jest.Mock = jest.fn();
      slider.addListener('change', changeCallback);
      slider.setMin(10);
      slider.setMax(70);
      expect(changeCallback.mock.calls.length).toBe(2);
    });
  });

  describe('Get/set range methods', () => {
    test('Range default value should be false', () => {
      expect(slider.getRange()).toBe(false);
    });

    test('setRange should be set', () => {
      const isRange: boolean = true;
      slider.setRange(isRange);
      expect(slider.getRange()).toBe(true);
    });

    test('should emit change event', () => {
      const changeCallback: jest.Mock = jest.fn();
      slider.addListener('change', changeCallback);
      slider.setRange(true);
      expect(changeCallback.mock.calls.length).toBe(1);
    });
  });

  describe('Get/set orientation methods', () => {
    test('default orientation value should be horizontal', () => {
      expect(slider.getOrientation()).toBe(Orientation.Horizontal);
    });

    test('set should be right', () => {
      slider.setOrientation(Orientation.Vertical);
      expect(slider.getOrientation()).toBe(Orientation.Vertical);
    });

    test('should emit change event', () => {
      const changeCallback: jest.Mock = jest.fn();
      slider.addListener('change', changeCallback);
      slider.setOrientation(Orientation.Vertical);
      slider.setOrientation(Orientation.Horizontal);
      expect(changeCallback.mock.calls.length).toBe(2);
    });
  });

  describe('Step methods', () => {
    test('get should be default value equal 1', () => {
      expect(slider.getStep()).toBe(1);
    });

    test('should be set value', () => {
      const step: number = 2;
      slider.setStep(step);
      expect(slider.getStep()).toBe(step);
    });

    test('step should not be greater max', () => {
      let step: number = 101;
      slider.setStep(step);
      expect(slider.getStep()).toBe(1);
      step = 100;
      slider.setStep(step);
      expect(slider.getStep()).toBe(step);
    });

    test('step should not be negative or zero', () => {
      let step: number = 0;
      const defaultStep: number = 1;
      slider.setStep(step);
      expect(slider.getStep()).toBe(defaultStep);
      step = -1;
      slider.setStep(step);
      expect(slider.getStep()).toBe(defaultStep);
    });

    test('setStep should set right current value of single slider', () => {
      const step: number = 5;
      slider.setValue(43);
      slider.setStep(step);
      expect(slider.getValue()).toBe(45);
    });

    test('setStep should set right current value of range slider', () => {
      const step: number = 4;
      slider.setRange(true);
      slider.setValue(13, 1);
      slider.setStep(step);
      expect(slider.getValue(1)).toBe(12);
    });

    test('should emit change event', () => {
      const changeCallback: jest.Mock = jest.fn();
      slider.addListener('change', changeCallback);
      slider.setStep(2);
      slider.setStep(200);
      slider.setStep(-1);
      expect(changeCallback.mock.calls.length).toBe(3);
    });
  });

  describe('Get/set value', () => {
    test('getValue should return default values', () => {
      expect(slider.getValue()).toBe(0);
      expect(slider.getValue(1)).toBe(100);
    });

    test('single slider should set right value', () => {
      const value: number = 40;
      slider.setValue(value);
      expect(slider.getValue()).toBe(value);
    });

    test('setValue should set right value', () => {
      const low: number = 10;
      const hight: number = 90;
      slider.setRange(true);
      slider.setValue(low);
      slider.setValue(hight, 1);
      expect(slider.getValue()).toBe(low);
      expect(slider.getValue(1)).toBe(hight);
    });

    test('values must be in the range', () => {
      const low: number = -1;
      const hight: number = 101;
      slider.setRange(true);
      slider.setValue(low);
      slider.setValue(hight, 1);
      expect(slider.getValue()).toBe(0);
      expect(slider.getValue(1)).toBe(100);
    });

    test('single slider should not be set hight value', () => {
      const hight: number = 80;
      slider.setValue(hight, 1);
      expect(slider.getValue(1)).toBe(100);
    });

    test('low value should be less them hight value', () => {
      const low: number = 50;
      const hight: number = 50;
      slider.setRange(true);
      slider.setValue(hight, 1);
      slider.setValue(low);
      expect(slider.getValue()).toBe(0);
    });

    test('hight value should be greater then low value', () => {
      const low: number = 50;
      const hight: number = 50;
      slider.setRange(true);
      slider.setValue(low);
      slider.setValue(hight, 1);
      expect(slider.getValue(1)).toBe(100);
    });

    test('setValue should correct value by step in single slider', () => {
      const step: number = 5;
      slider.setStep(step);
      slider.setValue(6);
      expect(slider.getValue()).toBe(step);
    });

    test('setValue should be correct value by step in range slider', () => {
      const step: number = 7;
      slider.setRange(true);
      slider.setStep(step);
      slider.setValue(18, 1);
      expect(slider.getValue(1)).toBe(21);
    });

    test('setValue should correct value by step in max case of single slider', () => {
      const max: number = 103;
      slider.setStep(5);
      slider.setMax(max);
      slider.setValue(max);
      expect(slider.getValue()).toBe(max);
    });

    test('setValue should correct hight value by step in max case of range slider', () => {
      const max: number = 103;
      slider.setRange(true);
      slider.setStep(10);
      slider.setMax(max);
      slider.setValue(max, 1);
      expect(slider.getValue(1)).toBe(max);
    });

    test('if step == max, the value should be correct in single slider', () => {
      const step: number = 100;
      slider.setStep(step);
      slider.setValue(51);
      expect(slider.getValue()).toBe(step);
      slider.setValue(49);
      expect(slider.getValue()).toBe(0);
    });

    test('if step == max in range slider, then values must be correct', () => {
      slider.setRange(true);
      slider.setStep(100);
      slider.setValue(51);
      expect(slider.getValue()).toBe(0);
    });

    test('should emit change event', () => {
      const changeCallback: jest.Mock = jest.fn();
      slider.addListener('change', changeCallback);
      slider.setRange(true);
      slider.setValue(5);
      slider.setValue(20, 1);
      expect(changeCallback.mock.calls.length).toBe(3);
    });
  });

  describe('Get/set pointer position', () => {
    test('setPosition should set valid value', () => {
      const position: number = 0.5;
      slider.setPointPosition(position);
      expect(slider.getValue()).toBe(50);
      slider.setMin(20);
      slider.setMax(70);
      slider.setPointPosition(position);
      expect(slider.getValue()).toBe(45);
    });

    test('setPosition should be between 0-1', () => {
      slider.setPointPosition(-1);
      expect(slider.getValue()).toBe(0);
      slider.setPointPosition(2);
      expect(slider.getValue()).toBe(100);
    });

    test('getPosition should return relative value of single slider', () => {
      slider.setValue(50);
      expect(slider.getPointPosition()).toBe(0.5);
    });

    test('getPosition should return relative value of range slider', () => {
      slider.setRange(true);
      slider.setValue(40, 1);
      expect(slider.getPointPosition(1)).toBe(0.4);
    });

    test('should emit change event', () => {
      const changeCallback: jest.Mock = jest.fn();
      slider.addListener('change', changeCallback);
      slider.setRange(true);
      slider.setPointPosition(0.3);
      slider.setPointPosition(0.6, 1);
      expect(changeCallback.mock.calls.length).toBe(3);
    });
  });

  describe('Get/set tooltips visibility', () => {
    test('should set tooltips visibility to true by default', () => {
      expect(slider.getTooltipVisibility()).toBe(true);
    });

    test('should set tooltips visibility to false', () => {
      slider.setTooltipVisibility(false);
      expect(slider.getTooltipVisibility()).toBe(false);
    });

    test('should emit change event', () => {
      const changeCallback: jest.Mock = jest.fn();
      slider.addListener('change', changeCallback);
      slider.setTooltipVisibility(true);
      expect(changeCallback.mock.calls.length).toBe(1);
    });
  });

  describe('SetPosition method', () => {
    test('should set correct position to point in single slider', () => {
      const position: number = 0.5;
      slider.setPosition(position);
      expect(slider.getPointPosition()).toBe(position);
    });

    test('should set position to low pointer if position less then current low pointer position of range slider', () => {
      const position: number = 0.2;
      slider.setRange(true);
      slider.setValue(50);
      slider.setPosition(position);
      expect(slider.getPointPosition()).toBe(position);
      expect(slider.getPointPosition(1)).toBe(1);
    });

    test('should set hight pointer position if passed position greater then hight pointer of range slider', () => {
      const position: number = 0.9;
      slider.setRange(true);
      slider.setValue(50, 1);
      slider.setPosition(position);
      expect(slider.getPointPosition(1)).toBe(position);
      expect(slider.getPointPosition()).toBe(0);
    });

    test('if passed position between low and hight pointers, position should set to nearest (low)', () => {
      const position: number = 0.49;
      slider.setRange(true);
      slider.setPosition(position);
      expect(slider.getPointPosition()).toBe(position);
      expect(slider.getPointPosition(1)).toBe(1);
    });

    test('if passed position between low and hight pointers, position should set to nearest (hight)', () => {
      const position: number = 0.51;
      slider.setRange(true);
      slider.setPosition(position);
      expect(slider.getPointPosition(1)).toBe(position);
      expect(slider.getPointPosition()).toBe(0);
    });

    test('should emit change event', () => {
      const changeCallback: jest.Mock = jest.fn();
      slider.addListener('change', changeCallback);
      slider.setRange(true);
      slider.setPosition(0.2);
      slider.setPosition(0.8);
      slider.setPosition(0.5);
      slider.setPosition(1);
      slider.setPosition(0);
      slider.setPosition(1.5);
      expect(changeCallback.mock.calls.length).toBe(7);
    });
  });
});