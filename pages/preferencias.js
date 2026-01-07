import { data } from 'autoprefixer';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import Tag from '../components/Tag';
import { fetcher } from '../lib/api';
import { getIdFromLocalCookie, getTokenFromServerCookie, getTokenFromLocalCookie } from '../lib/auth';
import { useFetchUser } from '../lib/authContext';
import { Dropdown } from "flowbite-react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { unsetToken } from '../lib/auth';
import Head from 'next/head';
import Nav from '../layouts/Nav';
import { UserProvider } from '../lib/authContext';
import { Sidebar } from '../layouts/Sidebar';
import { SidebarProvider } from "../contexts/SidebarContext"
import { Button } from '../components/Button';



const InfoAlertError = ({ handler }) => {

  const handleClose = () => {
    handler('')
  };

  return (
    <div id="alert-4" className="flex items-center p-4 mb-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
      <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div className="ms-3 text-sm font-medium">
        Hubo un error al guardar tus datos. Por favor intenta de nuevo.
      </div>
      <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700" data-dismiss-target="#alert-4" aria-label="Close" onClick={handleClose}>
        <span className="sr-only">Cerrar</span>
        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
};
const InfoAlertOk = ({ handler }) => {

  const handleClose = () => {
    handler('')
  };


  return (
    <div id="alert-3" className="flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
      <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div className="ms-3 text-sm font-medium">
        Tus datos se han guardado. <a href="/" className="font-semibold underline hover:no-underline">Ir a Inicio</a>. Cerrar esta alerta.
      </div>
      <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700" aria-label="Close" onClick={handleClose}>
        <span className="sr-only">Cerrar</span>
        <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  );
};

const DialogDeleteAccount = ({ handlerCancel, handlerConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold">¿Estás seguro de que deseas eliminar tu cuenta?</h2>
        <p className="text-gray-600 mt-4">Esta acción no se puede deshacer y perderás todos tus datos.</p>
        <div className="mt-8 flex justify-end">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4" onClick={ () => handlerConfirm() } >Eliminar</button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg" onClick={() => handlerCancel(false)}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};


const Preferencias = ({ avatar, prefEstado, listaEstados, prefUser, regiones }) => {
  const { user, loading } = useFetchUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePic, setProfilePic] = useState(avatar);
  const [resultMessage, setResultMessage] = useState('');
  const [image, setImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData] = useState({
    ...prefUser
  });
  const [misEstados, setMisEstados] = useState(prefEstado)
  const router = useRouter();

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const tmpImage = event.target.files[0];
      setImage(tmpImage);
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfilePic(reader.result);
      };

      if (tmpImage) {
        reader.readAsDataURL(tmpImage);
      }
    }
  };
  const deleteAccount = async () => {
    console.log("Deleting account")

    const user_id = await getIdFromLocalCookie();
    try {
      const responseData = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/user/me`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getTokenFromLocalCookie()}`,
        },
        body: JSON.stringify({ user_id }),
      });

      if (responseData.status === 200) {
        console.log("OK")
        unsetToken();
        router.push('/');
      } else {
        console.log("Error")
      }
    } catch (error) {
      console.error(error);
    }
  }
  const handleDeleteAccount = async () => {
    setIsDialogOpen(true);
   
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log({ name, value })
    setUserData({ ...userData, [name]: value });
    // console.log({ userData })
  };

  const uploadToServer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    if (image) formData.append('avatar', image);

    const user_id = await getIdFromLocalCookie();
    formData.append('user_id', user_id);
    formData.append('prefEstado', misEstados)
    formData.append('nombre', userData.nombre)
    formData.append('edad', userData.edad)
    formData.append('telefono', userData.telefono)
    formData.append('estadoDeOrigen', userData["estadoDeOrigen"])


    try {

      const responseData = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/user/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getTokenFromLocalCookie()}`,
        },
        body: formData,
      });

      console.log({ responseData: responseData })


      if (responseData.status === 200) {
        console.log("OK")
        setResultMessage('OK')
        //router.reload('/perfil');
      } else {
        setResultMessage('Error')
        console.log("Error")

      }
    } catch (error) {
      console.error(error);
      // console.error(JSON.stringify(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  const logout = () => {
    unsetToken();
  };



  // console.log({ misEstados })
  // console.log({ regiones })
  // console.log({ avatar })
  return (

    <>
      <SidebarProvider>
        <UserProvider value={{ user, loading }}>
          <Head>
            <title>Informativo MXN</title>
          </Head>
          {isDialogOpen && <DialogDeleteAccount handlerCancel={setIsDialogOpen} handlerConfirm={ deleteAccount}  />}
          <div className=" max-h-screen flex flex-col">
            {/* <PageHeader /> */}


            <Nav back={true} />
            <div className='px-8'>


              <section className='mt-4'>

                <div className='flex flex-col gap-4 md:gap-8  sm:items-center mb-24'>
                  <div className=' max-w-md sm:max-w-lg   '>Ayúdanos a darte una mejor experiencia llenando los siguientes datos:</div>
                  {/* <h1 className="text-3xl md:text-4xl sm:text-center">{(userData.nombre) ? userData.nombre : user}</h1> */}
                  <form id="form-preferencias" className="flex flex-col gap-4 w-full sm:max-w-2xl">
                    <div className='flex flex-col justify-center  items-center relative'>
                      <label htmlFor="avatar" className="md:p-2 rounded text-black cursor-pointer"> Sube tu foto de perfil:
                        {
                          avatar && (
                            <img className='w-40 h-40 rounded-ful object-cover'
                              src={`${profilePic}`}
                              alt="Profile Picture"
                            />
                          )
                        }
                        <div
                          className="absolute bottom-0  bg-red-600 text-white rounded-full p-2 transform translate-x-1/4 -translate-y-1/4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                          </svg>
                        </div>  <input type="file" name="avatar" id="avatar" value={undefined} onChange={uploadToClient}
                          accept="image/*" className="hidden"
                        />

                      </label>


                    </div>
                    <fieldset className='flex flex-col gap-4'>
                      <label
                        htmlFor='nombre'
                      >Nombre

                        <input
                          className="block w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm2"
                          id="nombre"
                          name="nombre"
                          autoComplete='name'
                          value={userData.nombre || userData.username}
                          onChange={(e) => handleChange(e)}
                        />
                      </label>
                      <label htmlFor='edad'>Edad
                        <input
                          className="block w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm2"

                          id="edad"
                          name="edad"
                          type='number'
                          value={userData.edad}
                          onChange={(e) => handleChange(e)}
                        />
                      </label>
                      <label htmlFor='estadoDeOrigen'>Estado de Origen
                        <input
                          className="block w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm2"
                          id="estadoDeOrigen"
                          name="estadoDeOrigen"
                          type='text'
                          autoComplete='address-level1'
                          value={userData.estadoDeOrigen}
                          onChange={(e) => handleChange(e)} />
                      </label>

                      <label htmlFor='telefono'
                        className='w-full '
                      >Teléfono
                        <PhoneInput
                          className='block w-full'
                          containerStyle={{ width: '100%' }} // Estilo para el contenedor
                          inputStyle={{ width: '100%', background: '#f9fafb' }}
                          defaultCountry="us"
                          value={userData.telefono ? userData.telefono : ''}
                          onChange={(phone) => setUserData({ ...userData, ["telefono"]: phone })}
                        />
                      </label>
                    </fieldset>

                    <fieldset className='mt-4'>
                      <h2>Selecciona los estados de los que prefieres recibir noticias:</h2>
                      <div className='block w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm2 '>
                        <Dropdown label="Estados" size="md" placement='auto' inline dismissOnClick={false}>
                          {
                            listaEstados.map((estado) => {
                              let checked = misEstados.includes(estado.id)
                              //console.log({ checked })
                              return (
                                <Dropdown.Item key={estado.id} >
                                  <input
                                    id={estado.nombre}
                                    type="checkbox"
                                    value={estado.id}
                                    name={estado.nombre}
                                    label={estado.nombre}
                                    checked={checked}
                                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    onClick={(input) => {
                                      if (input.target.checked) {
                                        setMisEstados(misEstados.concat([Number(input.target.value)]))
                                      }
                                      else {
                                        setMisEstados(misEstados.filter(miEstado => miEstado != input.target.value))
                                      }
                                    }} /><label htmlFor={estado.nombre}> &nbsp;&nbsp;{estado.nombre}</label>
                                </Dropdown.Item>
                              )
                            })
                          }
                        </Dropdown>
                      </div>


                      <div className='mt-6 max-w-2xl '>

                        {
                          misEstados.map((id) => {
                            const estado = listaEstados.find(element => element.id == id)
                            return (
                              <Tag title={estado.nombre} key={id} />
                            )
                          })
                        }


                      </div>
                    </fieldset>
                    <div className='mt-8 flex flex-col w-full justify-center items-center'>
                      {resultMessage == "OK" ? <InfoAlertOk handler={setResultMessage} /> : null}
                      {resultMessage == "Error" ? <InfoAlertError handler={setResultMessage} /> : null}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="main" size="default"
                        onClick={(e) => uploadToServer(e)} >
                        {isSubmitting ? 'Procesando...' : 'Guardar Preferencias'}
                      </Button>

                    </div>
                  </form>
                  <div className='mt-8 flex w-full justify-center items-center'>
                    <Button variant="secondary" size="default" onClick={logout} >
                      Cerrar Sesión
                    </Button>


                  </div>
                  <div>
                    <div className='mt-8 flex w-full justify-center items-center'>
                      <Button variant="ghost" size="default" onClick={handleDeleteAccount}>
                        Eliminar mi cuenta
                      </Button>

                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </UserProvider>
      </SidebarProvider>
    </>
  );
};


export async function getServerSideProps({ req }) {
  const jwt = getTokenFromServerCookie(req);
  console.log("jwt",{ jwt })
  if (!jwt) {
    return {
      redirect: {
        destination: '/',
      },
    };
  } else {
    const responseData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("users/me?populate=*")
    console.log("responseData",{ responseData })
    const avatar = responseData.avatar ? responseData.avatar.url : 'https://mxn-cms-qa.s3.us-east-2.amazonaws.com/default_profile_pciture_3797e770b9.jpeg';
    const prefEstado = responseData.prefEstado ? responseData.prefEstado.map(estado => {
      return estado.id
    }) : [];
    // console.log({ prefEstado })


    const responseEstados = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados/?fields[0]=nombre_completo&sort=nombre_completo:ASC`
    );
    console.log("responseEstados",{ responseEstados })
    const listaEstados = responseEstados.data.map((edo) => {
      return { id: edo.id, nombre: edo.attributes.nombre_completo }

    })
    const regionesResponse = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC&pagination[pageSize]=100`
    );
    console.log("regionesResponse",{ regionesResponse })
    
    return {
      props: {
        avatar,
        prefEstado,
        listaEstados,
        prefUser: responseData,
        regiones: regionesResponse
      },
    };
  }
}

export default Preferencias;
