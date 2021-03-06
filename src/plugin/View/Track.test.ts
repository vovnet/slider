import Track from './Track';
import Orientation from '../Types/Orientation';

let track: Track;
let parent: HTMLElement;

describe('Track class', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    parent = document.createElement('div');
    document.body.appendChild(parent);
    track = new Track(parent);
    if (parent.firstElementChild) {
      parent.firstElementChild.getBoundingClientRect = jest.fn(() => ({
        x: 0,
        y: 0,
        // tslint:disable-next-line:object-literal-sort-keys
        width: 600,
        height: 600,
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        toJSON: jest.fn(),
      }));
    }
  });

  describe('getRelativePosition method', () => {
    test('should return position in horizontal orientation', () => {
      track.update(Orientation.Horizontal);
      expect(track.getRelativePosition(300, 0)).toBe(0.5);
    });

    test('should return position in vertical orientation', () => {
      track.update(Orientation.Vertical);
      expect(track.getRelativePosition(0, 300)).toBe(0.5);
    });
  });

  describe('getAbsolutePosition method', () => {
    test('should return position in vertical orientation', () => {
      track.update(Orientation.Vertical);
      expect(track.getAbsolutePosition(0.5)).toBe(300);
    });
  });
});
