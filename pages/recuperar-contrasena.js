import React from 'react';
import { useState } from 'react';
import Link from 'next/link'

import { fetcher } from '../lib/api';


const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/forgot-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email
                    }),
                }
            );
            //console.log({ response })
            // Set formSubmitted to true on successful submission
            setFormSubmitted(true);
        } catch (error) {
            // Handle errors here
            // alert("error")
            setFormSubmitted(true);

//            setFormSubmitted(false); // Keep the form visible on error
        }
        setIsSubmitting(false);
    };

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
                    <div className=" m-8 max-w-xl text-center text-stone-900 text-base font-normal">Para que puedas ingresar nuevamente a <span className="font-bold">Informativo MXN</span> te enviaremos un correo con la liga para restablecer tu contraseña.</div>
                    {/* <img
                        src="https://mxn-public-assets.s3.us-east-2.amazonaws.com/creative1.png"
                        alt="Cambio de contraseña"
                        className="m-4 items-center"
                    /> */}
                    <div>
                        {!formSubmitted ? (
                            <form onSubmit={handleSubmit}  className="space-y-6">
                                <fieldset >
                                    <label htmlFor="email">Ingresa tu correo</label>
                                    <input
                                        type="email"
                                        id="email"
                                        autoComplete="email"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block  px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />


                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className=" my-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                       {isSubmitting ? 'Procesando...' : 'Enviar Correo'}
                                    </button>
                                    <Link
                                     href="/iniciar-sesion"
                                        className="  my-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 focus:outline-none  hover:ring-red-500  hover:ring-1 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Regresar
                                    </Link>

                                </fieldset>

                            </form>) : (
                            <div className="text-center m-4 p-4 border border-green-600 rounded-md bg-green-100">
                                <p className="text-green-700">Revisa tu correo con las instrucciones para continuar.</p>
                            </div>
                        )}
                    </div>


                </div>
            </div>


        </>
    );
};

export default ForgotPasswordForm;
