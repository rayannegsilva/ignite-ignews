import { render, screen, fireEvent } from '@testing-library/react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/react');
jest.mock('next/router');

describe('SubscribeButton Component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValue({ data: null, status: "loading"})

     render(
      <SubscribeButton />
    )
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  });

  it('redirects user to sign in when note authenticated', () => {
    const useSessionMocked = jest.mocked(useSession);
    const signInMocked = jest.mocked(signIn);

    useSessionMocked.mockReturnValue({ data: null, status: "loading"})
    
    render(<SubscribeButton />)
    
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
    
  });

  it('redirect to posts when user already has a subscription', () => {
    const useRouterMock = jest.mocked(useRouter);
    const useSessionMocked = jest.mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        activeSubscription: 'fake',
        expires: "fake-expires",
      },
     
      status: "authenticated",
    });

    useRouterMock.mockReturnValue({ 
      push: pushMock,
    } as any);

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalled()

    
  });
})
