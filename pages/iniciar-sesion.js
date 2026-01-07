'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react';
import { useState } from 'react';
import { fetcher } from '../lib/api';
import { setToken, unsetToken } from '../lib/auth';
import Router from 'next/router'
import Script from 'next/script'
import Head from 'next/head'

const LoginForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState(null);  // 'success', 'error', or null

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        identifier: email,
                        password: password,
                    }),
                }
            );
            console.log({ response })

            if (response.error) {
                setFormStatus('error')
            } else {
                setToken(response);
                setFormStatus('success');
            }
        } catch (error) {
            setFormStatus('error');
        }
        setIsSubmitting(false);
    };

    const handleReturn = () => {
        Router.reload('/');
    }

    const renderFormContent = () => {
        switch (formStatus) {
            case 'success':
                return (
                    <>
                        <div className="text-center m-4 p-4 border border-green-600 rounded-md bg-green-100">
                            <p className="text-green-700">Iniciaste sesión con éxito.</p>
                        </div>
                        <Link
                            className="w-60 m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            href="/">Ingresar</Link>
                    </>
                )
            case 'error':
                return (
                    <>
                        <div className="text-center m-4 p-4 border border-red-600 rounded-md bg-red-100">
                            <p className="text-red-700">Tu correo o contraseña no coinciden.</p>
                        </div>
                        <button
                            className="m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={handleReturn}
                        >Regresar</button>
                    </>
                )
            default:
                return (
                    <form onSubmit={handleSubmit} className="m-4 mt-8">
                        <fieldset>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                autoComplete="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="block mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                            <label htmlFor="password">
                                Contraseña:
                                <input
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    title="Usa 8 caracteres mínimo"
                                    minLength="8"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="my-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                {isSubmitting ? 'Procesando...' : 'Ingresar'}
                            </button>
                        </fieldset>
                    </form>
                )
        }
    }

    return (
        <>
            <Head>
                <title>Iniciar Sesión</title>
                <meta name="description" content="Inicia sesión en el portal de MXN" />
                <meta name="appleid-signin-client-id" content="[CLIENT_ID]" />
                <meta name="appleid-signin-scope" content="[SCOPES]" />
                <meta name="appleid-signin-redirect-uri" content="[REDIRECT_URI]" />
                <meta name="appleid-signin-state" content="[STATE]" />
            </Head>
            <div className="flex">
                <div className="bg-vert1 bg-cover bg-center h-screen w-5/12">
                    <div className="bg-black bg-opacity-80 w-full h-full items-center flex justify-center">
                        <img
                            src="https://mxn-public-assets.s3.us-east-2.amazonaws.com/logo-mxn-white.svg"
                            className="w-1/2"
                            alt="Logo Informativo MXN"
                        />
                    </div>
                </div>
                <div className="bg-white flex flex-col w-7/12 justify-center items-center gap-y-4">
                    <div className='mx-2 text-stone-900 text-center text-2xl md:text-4xl font-bold'>
                        Iniciar Sesión
                    </div>
                    <div className="w-auto text-stone-900 text-base font-normal">Ingresa al mejor canal</div>

                    <div className='flex flex-col max-w-xs sm:w-96'>
                        {renderFormContent()}
                    </div>

                    <div className='text-center'>
                        <p>¿Aún no eres usuario?</p>
                        <Link className='font-medium text-red-600 hover:underline' href="/registro">Regístrate</Link>
                    </div>
                    <div className='flex flex-col gap-2 mt-4'>
                        <a href="https://cms.mxn.group/api/connect/apple">
                            <button type="button" className="w-56 text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2">
                                <svg className="mr-2 -ml-1 w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                    <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                                </svg>
                                Continuar con Apple
                            </button>
                        </a>
                        <a href="https://cms.mxn.group/api/connect/google">
                            <button type="button" className="w-56 text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
                                <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                                Continuar con Google
                            </button>
                        </a>
                        {/* <a href="https://cms-test.mxn.group/api/connect/facebook">
                            <button type="button" className="w-56 text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2">
                                <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                    <path fill="currentColor" d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"></path>
                                </svg>
                                Continuar con Facebook
                            </button>
                        </a> */}
                    </div>
                    <div>
                        <Link
                            className='mt-4 block font-normal hover:underline'
                            href="/recuperar-contrasena">Olvidé mi usuario y contraseña</Link>
                    </div>
                </div>
            </div>
            {/* Enlace de política fijado en la esquina inferior derecha */}
            <div className="fixed bottom-4 right-4 p-2 text-sm">
                <Link className="hover:underline" href="/politicaprivacidad">Política de Privacidad</Link>
            </div>
        </>
    );
};

export default LoginForm;
