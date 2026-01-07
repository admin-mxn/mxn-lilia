
'use client'

import { useSearchParams } from 'next/navigation';
import { setToken } from '../../../lib/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


export default function AppleRedirect() {

    // const access_token = searchParams.get('access_token');


    const router = useRouter();
    useEffect(() => {
        const code = router.query.code;
        console.log({ code })
        // console.log({ router })
        // console.log({ searchParams })

        if (code) {
            getToken(code);
        }
    }, [router])


    const getToken = async (code) => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/apple/callback?code=${code}`);

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