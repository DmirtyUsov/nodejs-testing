// Uncomment the code below and write your tests
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  return {
    __esModule: true,
    ...originalModule,
    mockOne: () => {
      return;
    },
    mockTwo: () => {
      return;
    },
    mockThree: () => {
      return;
    },
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const spyLog = jest.spyOn(console, 'log');

    mockOne();
    mockTwo();
    mockThree();

    expect(spyLog).toBeCalledTimes(0);
  });

  test('unmockedFunction should log into console', () => {
    jest.spyOn(console, 'log');

    unmockedFunction();

    expect(console.log).toBeCalled();
  });
});
