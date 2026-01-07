'use client'
import Link from 'next/link'
import React from 'react';
import { useState } from 'react';
import { fetcher } from '../lib/api';
import { setToken, unsetToken } from '../lib/auth';
import Router from 'next/router'
import { getIdFromLocalCookie, getTokenFromServerCookie } from '../lib/auth';

const RegisterForm = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);  // 'success', 'error', or null

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            username: email,
          }),
        }
      );
      console.log({ res: response })

      if (response.error) {
        setFormStatus('error')
        switch (response.error.message) {
          case 'Email or Username are already taken':
            setErrorMessage('El correo proporcionado ya había sido registrado.');
            break
          default:
            setErrorMessage('Ocurrió un error, favor de reintentar.');
        }
      }
      else {
        setToken(response, '/preferencias');
        setFormStatus('success');
      }
    } catch (error) {
      setFormStatus('error');
      setErrorMessage('Ocurrió un error, favor de reintentar.');
    }
    setIsSubmitting(false);
  };

  const handleRegresar = () => {
    Router.reload('/');
  }

  const renderFormContent = () => {
    console.log({ formStatus })
    switch (formStatus) {
      case 'success':
        return (
          <>
            <div className="text-center m-4 p-4 border border-green-600 rounded-md bg-green-100">
              <p className="text-green-700">Te has registrado con éxito.</p>
            </div>
            <Link
              className="m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              href="/bienvenida"
              onClick={handleRegresar}
            >Continuar</Link>
          </>
        )
      case 'error':
        return (
          <>
            <div className="text-center m-4 p-4 border border-red-600 rounded-md bg-red-100">
              <p className="text-red-700">{errorMessage}</p>
            </div>
            <button
              className="m-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleRegresar}
            >Regresar</button>
          </>
        )
      default:
        return (
          <>
            <form onSubmit={handleSubmit} className="m-4 mt-8">
              <fieldset>
                <label htmlFor="email" className="block mb-2 font-medium">Email:</label>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="block mb-4 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
                <label htmlFor="password" className="block mb-2 font-medium">Contraseña:</label>
                <input
                  type="password"
                  id="password"
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
                  className="my-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {isSubmitting ? 'Procesando...' : 'Registrarse'}
                </button>
              </fieldset>
            </form>
            <div className="text-center">
              <p>¿Ya eres usuario?</p>
              <Link
                className="font-medium text-red-600 hover:underline"
                href="/iniciar-sesion"
              >Inicia Sesión</Link>
            </div>
          </>
        )
    }
  }

  return (
    <>
      <div className="flex">
        <div className="bg-vert1 bg-cover bg-center h-screen w-5/12">
          <div className="bg-black bg-opacity-80 w-full h-full flex items-center justify-center">
            <img
              src="https://mxn-public-assets.s3.us-east-2.amazonaws.com/logo-mxn-white.svg"
              className="w-1/2"
              alt="Logo Informativo MXN"
            />
          </div>
        </div>
        <div className="bg-white flex flex-col w-7/12 justify-center items-center">
          <div className="mx-2 text-stone-900 text-center text-2xl md:text-4xl font-bold">
            ¡Regístrate ahora!
          </div>
          <div className="sm:m-8 w-auto text-center text-stone-900 text-base font-normal">
            Crea tu usuario y contraseña para ingresar
          </div>
          <div className="flex flex-col sm:w-80 justify-center">
            {renderFormContent()}
          </div>
          {/* Sección de política de privacidad */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Al registrarte, aceptas nuestra{' '}
              <Link
                className="text-red-600 hover:underline"
                href="/politicaprivacidad"
              >
                Política de Privacidad
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;

export async function getServerSideProps({ req }) {
  const jwt = getTokenFromServerCookie(req);
  if (jwt) {
    return {
      redirect: {
        destination: '/',
      },
    };
  } else {
    return {
      props: {},
    };
  }
}
