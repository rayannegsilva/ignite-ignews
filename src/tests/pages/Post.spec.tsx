import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/stripe')
jest.mock('next-auth/react')

const post = 
    {
        slug: 'fake-slug',
        title: 'Fake title 1',
        content: '<p>Fake excerpt 1</p>',
        updatedAt: '10 de abril',
    };

jest.mock('../../services/prismic')

describe('Post page', () => {

    it('renders correctly', () => {
        render(<Post post={post} />);

        expect(screen.getByText('Fake title 1')).toBeInTheDocument();
        expect(screen.getByText('Fake excerpt 1')).toBeInTheDocument();
    });

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = jest.mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        }as any);
        
        const response = await getServerSideProps({ params: {slug: 'fake-slug'} }as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: {
                    destination: '/',
                    permanent: false
                }
            })
        )
    });

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);
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

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);

        const response = await getServerSideProps({ params: {slug: 'fake-slug'} }as any);

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