import path from 'path';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';

import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const timeoutMs = 5;

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');

    const callback = jest.fn();

    doStuffByTimeout(callback, timeoutMs);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, timeoutMs);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');

    const callback = jest.fn();

    doStuffByTimeout(callback, timeoutMs);
    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  const intervalMs = 5;
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();

    doStuffByInterval(callback, intervalMs);

    expect(setInterval).toHaveBeenCalled();
    expect(setInterval).toHaveBeenLastCalledWith(callback, intervalMs);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const times = 3;

    doStuffByInterval(callback, intervalMs);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(intervalMs * times);

    expect(callback).toHaveBeenCalledTimes(times);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'my.test';

  test('should call join with pathToFile', async () => {
    jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);

    expect(path.join).toHaveBeenCalledWith(expect.anything(), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'Content';
    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
    jest.spyOn(fsPromises, 'readFile').mockImplementation(() => {
      return Promise.resolve(Buffer.from(fileContent));
    });

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
  });
});
