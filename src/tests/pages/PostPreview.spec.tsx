import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/stripe')
jest.mock('next-auth/react')
jest.mock('next/router')

const post = {
        slug: 'fake-slug',
        title: 'Fake title 1',
        content: '<p>Fake excerpt 1</p>',
        updatedAt: '10 de abril',
    };

jest.mock('../../services/prismic')

describe('PostPreview Page', () => {

    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)
        useSessionMocked.mockReturnValue({ data: null, status: "loading"})

        render(<Post post={post} />);

        expect(screen.getByText('Fake title 1')).toBeInTheDocument();
        expect(screen.getByText('Fake excerpt 1')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });

    it('redirects user to full post when is subscribed', async () => {
      const useSessionMocked = jest.mocked(useSession)
      const useRouterMocked = jest.mocked(useRouter)
      const pushMock = jest.fn();
      
      useSessionMocked.mockReturnValueOnce({
        data: { 
          activeSubscription: 'fake-active-subscription',
          expires: 'fake-expires'
       },
    } as any)

      useRouterMocked.mockReturnValueOnce({
        push: pushMock
      } as any)

      render(<Post post={post} />)

      expect(pushMock).toHaveBeenCalledWith("/posts/fake-slug")
    });

    it('loads initial data', async () => {
 
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{type: 'heading', text:'Fake title 1'}],
                    content: [
                        {
                            type: 'paragraph',
                            text: 'Fake excerpt 1',
                        },
                    ],
                },
                last_publication_date: '06-23-2022'
            })
        } as any)


        const response = await getStaticProps({ params: { slug: 'fake-slug'}})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: { 
                        slug: 'fake-slug',
                        title: 'Fake title 1',
                        content: '<p>Fake excerpt 1</p>',
                        updatedAt: '23 de junho de 2022',
                    }
                }
            })
        )
        
    });
   
});