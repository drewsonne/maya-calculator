import Windowing from '../src/parser/windowing';

test('windowing-functionality', () => {
  const source = [
    1, 2, 3, 4, 5, 6, 7, 8, 9
  ];
  expect(new Windowing(source).rolling(3)).toEqual([
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
    [5, 6, 7],
    [6, 7, 8],
    [7, 8, 9]
  ]);

  expect(new Windowing([1, 2, 3]).rolling(3)).toEqual([
    [1, 2, 3]
  ]);
});

test('collection of windows', () => {

  const windows = [];
  for (const window of new Windowing([1, 2, 3, 4, 5]).windows(2, 3)) {
    windows.push(window);
  }

  expect(windows[0]).toEqual([
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5]
  ]);

  expect(windows[1]).toEqual([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5]
  ]);
});

test('collection of windows backwards', () => {
  const windows = [];
  for (const window of new Windowing([1, 2, 3, 4, 5]).windows(3, 2)) {
    windows.push(window);
  }

  expect(windows[0]).toEqual([
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5]
  ]);

  expect(windows[1]).toEqual([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5]
  ]);
});
