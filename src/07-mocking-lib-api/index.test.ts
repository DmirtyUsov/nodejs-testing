import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const baseURL = 'https://jsonplaceholder.typicode.com';
const endpoint = '/users';
const mockData = {
  id: 1,
  name: 'John Dow',
};

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockedAxios.create.mockReturnThis();
    mockedAxios.get.mockResolvedValue({ data: mockData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(endpoint);

    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(endpoint);

    jest.runAllTimers();

    expect(mockedAxios.get).toHaveBeenCalledWith(endpoint);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi(endpoint);
    expect(result).toEqual(mockData);
  });
});
