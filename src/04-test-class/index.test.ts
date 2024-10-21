import lodash from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  const initAmount = 5;

  test('should create account with initial balance', () => {
    const account = getBankAccount(initAmount);

    expect(account.getBalance()).toBe(initAmount);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(initAmount);

    expect(() => account.withdraw(2 * initAmount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const srcAccount = getBankAccount(initAmount);
    const dstAccount = getBankAccount(initAmount);

    expect(() => srcAccount.transfer(2 * initAmount, dstAccount)).toThrow();
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(initAmount);

    expect(() => account.transfer(initAmount, account)).toThrow();
  });

  test('should deposit money', () => {
    const account = getBankAccount(initAmount);
    account.deposit(initAmount);

    expect(account.getBalance()).toBe(2 * initAmount);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(initAmount);
    account.withdraw(initAmount);

    expect(account.getBalance()).toBe(initAmount - initAmount);
  });

  test('should transfer money', () => {
    const srcAccount = getBankAccount(initAmount);
    const dstAccount = getBankAccount(initAmount);

    srcAccount.transfer(initAmount, dstAccount);

    expect(srcAccount.getBalance()).toBe(initAmount - initAmount);
    expect(dstAccount.getBalance()).toBe(2 * initAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomBalance = initAmount + 3;
    const randomValue = 1;
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(randomBalance)
      .mockReturnValueOnce(randomValue);

    const account = getBankAccount(initAmount);
    const balance = await account.fetchBalance();

    expect(balance).toEqual(expect.any(Number));

    jest.restoreAllMocks();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const randomBalance = initAmount + 3;
    const randomValue = 1;
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(randomBalance)
      .mockReturnValueOnce(randomValue);

    const account = getBankAccount(initAmount);
    await account.synchronizeBalance();

    expect(account.getBalance()).toEqual(randomBalance);

    jest.restoreAllMocks();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(initAmount);
    jest
      .spyOn(account, 'fetchBalance')
      .mockReturnValue(new Promise((resolve) => resolve(null)));

    await expect(() => account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );

    jest.restoreAllMocks();
  });
});
