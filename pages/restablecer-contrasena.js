'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React from 'react';
import { useState } from 'react';
import { fetcher } from '../lib/api';
import { setToken, unsetToken } from '../lib/auth';

const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formStatus, setFormStatus] = useState(null);  // 'success', 'error', or null


    const searchParams = useSearchParams()

    const code = searchParams.get('code')

    const handleContinue = () => {

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/reset-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password,
                        passwordConfirmation: password,
                        code
                    }),
                }
            );
            console.log({ response })

            if (response.error) { setFormStatus('error'); }else {

                // setToken(responseData);
                // Set formSubmitted to true on successful submission
                //setFormSubmitted(true);
                setFormStatus('success');
            }
        } catch (error) {
            // Handle errors here
            // setFormSubmitted(false);

            setFormStatus('error');

            //            setFormSubmitted(false); // Keep the form visible on error
        }
        setIsSubmitting(false);
    };

    const renderFormContent = () => {
        console.log({ formStatus })
        switch (formStatus) {
            case 'success':
                return (
                    <>
                        <div className="text-center m-4 p-4 border border-green-600 rounded-md bg-green-100">
                            <p className="text-green-700">Tu contraseña ha sido actualizada con éxito.</p>
                        </div>
                        <Link
                            className="m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"

                            href="/">Iniciar Sesión</Link>
                    </>
                )
            case 'error':
                return (
                    <>
                        <div className="text-center m-4 p-4 border border-red-600 rounded-md bg-red-100">
                            <p className="text-red-700">Esta página ya no es válida. Favor de reintentar el proceso.</p>
                        </div>
                        <Link
                            className="m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"

                            href="/recuperar-contrasena">Regresar</Link>
                    </>
                )
            default:
                return (
                    <form onSubmit={handleSubmit} className="m-4">
                        <fieldset >
                            <label htmlFor="new-password">Nueva contraseña:</label>
                            <input
                                type="password"
                                id="new-password"
                                autoComplete="new-password"
                                title="Usa 8 caracteres mínimo"
                                minLength="8"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />



                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="my-4  w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                {isSubmitting ? 'Procesando...' : 'Restablecer Contraseña'}
                            </button>


                        </fieldset>

                    </form>
                )
        }
    }
    return (
        <>
            <div className="flex">
                <div className="bg-vert1 bg-cover bg-center h-screen w-5/12">
                    <div
                        className="bg-black bg-opacity-80 w-full h-full items-center flex justify-center"
                    >
                        <img
                            src="https://mxn-public-assets.s3.us-east-2.amazonaws.com/logo-mxn-white.svg"
                            className="w-1/2 "
                            alt="Logo Informativo MXN"
                        />
                    </div>
                </div>
                <div className="bg-white flex flex-col w-7/12 justify-center items-center">
                    <div className='mx-2 text-stone-900 text-center text-2xl md:text-4xl font-bold'>
                        Restablece tu contraseña
                    </div>
                    <div className="m-8 w-auto text-center text-stone-900 text-base font-normal">Ingresa una nueva contraseña que tenga por lo menos 8 caracteres.</div>

                    <div className=' max-w-fit'>
                        {renderFormContent()}
                    </div>


                </div>
            </div>




        </>
    );
};

export default ResetPasswordForm;
