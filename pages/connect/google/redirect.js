
'use client'

import { useSearchParams } from 'next/navigation';
import { setToken } from '../../../lib/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


export default function GoogleRedirect() {

    // const access_token = searchParams.get('access_token');


    const router = useRouter();
    const { searchParams } = useSearchParams();
    useEffect(() => {
        const access_token = router.query.access_token;
        console.log({ router })
        console.log({ searchParams })

        if (access_token) {
            getToken(access_token);
        }
    }, [router])


    const getToken = async (access_token) => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/google/callback?access_token=${access_token}`);

            const data = await response.json();
            console.log({ data })
            if (data && data.jwt) {
                setToken(data);
            } else {
                console.log('error', data)
            }


        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <h1>Redirecting...</h1>
    )
}