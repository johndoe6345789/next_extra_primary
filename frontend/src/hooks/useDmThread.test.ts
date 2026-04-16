import { renderHook, act } from '@testing-library/react';
import { useDmThread } from './useDmThread';

const mockSendMut = jest.fn().mockReturnValue({
  unwrap: jest.fn().mockResolvedValue({
    id: 'm1',
    content: 'hi',
    senderId: 'u1',
    createdAt: '',
  }),
});
const mockRefetch = jest.fn();

jest.mock('@/store/api/socialApi', () => ({
  useGetDmMessagesQuery: () => ({
    data: [
      {
        id: 'm1',
        senderId: 'u1',
        content: 'hello',
        createdAt: '',
      },
    ],
    isLoading: false,
    refetch: mockRefetch,
  }),
  useSendDmMessageMutation: () => [
    mockSendMut,
    { isLoading: false },
  ],
}));

jest.mock('@/constants/social.json', () => ({
  dm: { pollIntervalMs: 100000 },
}));

describe('useDmThread', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it('returns messages from query', () => {
    const { result } = renderHook(() =>
      useDmThread('thread-1'),
    );
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe(
      'hello',
    );
  });

  it('calls sendMut on send', async () => {
    const { result } = renderHook(() =>
      useDmThread('thread-1'),
    );
    await act(async () => {
      await result.current.send('hi there');
    });
    expect(mockSendMut).toHaveBeenCalledWith({
      threadId: 'thread-1',
      content: 'hi there',
    });
  });

  it('does not send empty string', async () => {
    const { result } = renderHook(() =>
      useDmThread('thread-1'),
    );
    await act(async () => {
      await result.current.send('   ');
    });
    expect(mockSendMut).not.toHaveBeenCalled();
  });
});
