import { renderHook, act } from
  '@testing-library/react';

const dispatchMock = jest.fn();
const loginMut = jest.fn();
const registerMut = jest.fn();
const logoutMut = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => dispatchMock,
  useSelector: (
    fn: (s: unknown) => unknown,
  ) =>
    fn({
      auth: {
        user: { id: 1, email: 'a@b.c' },
        isAuthenticated: true,
        isLoading: false,
      },
    }),
}));

jest.mock('@/store/api/authApi', () => ({
  useLoginMutation: () => [loginMut],
  useRegisterMutation: () => [registerMut],
  useLogoutMutation: () => [logoutMut],
}));

jest.mock('@/store/slices/authSlice', () => ({
  setCredentials: (p: unknown) => ({
    type: 'auth/set', payload: p,
  }),
  clearCredentials: () => ({ type: 'auth/clear' }),
}));

import { useAuth } from './useAuth';

const unwrap = <T,>(v: T) =>
  ({ unwrap: () => Promise.resolve(v) });

describe('useAuth', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    loginMut.mockReset();
    registerMut.mockReset();
    logoutMut.mockReset();
  });

  it('exposes user from redux', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user?.email).toBe('a@b.c');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('dispatches credentials on login', async () => {
    loginMut.mockReturnValue(
      unwrap({
        user: { id: 2 },
        tokens: { accessToken: 'a' },
      }),
    );
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login({
        email: 'a', password: 'b',
      });
    });
    expect(loginMut).toHaveBeenCalledWith({
      email: 'a', password: 'b',
    });
    expect(dispatchMock).toHaveBeenCalled();
  });

  it('dispatches credentials on register', async () => {
    registerMut.mockReturnValue(
      unwrap({ user: { id: 3 }, tokens: {} }),
    );
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.register({
        email: 'a', password: 'b', name: 'n',
      });
    });
    expect(registerMut).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalled();
  });

  it('clears credentials on logout', async () => {
    logoutMut.mockReturnValue(unwrap({}));
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.logout();
    });
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'auth/clear',
    });
  });
});
