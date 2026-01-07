import { data } from 'autoprefixer';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../components/Layout';
import Tag from '../components/Tag';
import { fetcher } from '../lib/api';
import { getIdFromLocalCookie, getTokenFromServerCookie } from '../lib/auth';
import { useFetchUser } from '../lib/authContext';
import { Dropdown } from "flowbite-react";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';


const Bienvenida = ({ avatar, prefEstado, listaEstados, prefUser }) => {
  const { user, loading } = useFetchUser();
  const [phone, setPhone] = useState('');
  //const [image, setImage] = useState(null);
  // const [userData, setUserData] = useState({
  //   nombre: '',
  //   edad: '',
  //   genero: '',
  //   telefono: '',
  //   estadoDeOrigen: ''
  // });
  const [userData, setUserData] = useState({
    ...prefUser
  });
  const [misEstados, setMisEstados] = useState(prefEstado)
  const router = useRouter();
  //console.log("reinicio")
  console.log({ userData })

  // const uploadToClient = (event) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const tmpImage = event.target.files[0];
  //     setImage(tmpImage);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseData = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            username: userData.username,
          }),
          method: 'POST',
        }
      );
      setToken(responseData);
      router.redirect('/profile');
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value })
    setUserData({ ...userData, [name]: value });
    console.log({ userData })
  };

  const uploadToServer = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    //const file = image;
    //formData.append('inputFile', file);
    formData.append('user_id', await getIdFromLocalCookie());
    formData.append('prefEstado', misEstados)
    formData.append('nombre', userData.nombre)
    formData.append('edad', userData.edad)
    formData.append('genero', userData.genero)
    formData.append('telefono', userData.telefono)
    formData.append('estadoDeOrigen', userData.estadoDeOrigen)
    console.log({ userData })
    try {
      const responseData = await fetcher('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (responseData.message === 'success') {
        console.log("OK")
        //router.reload('/perfil');
      }
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  };
  console.log({ misEstados })
  return (
    <Layout user={user}>
      <>
      <section>

        <div className='flex flex-col gap-4 md:gap-8  sm:items-center'>
          <h1 className="text-3xl md:text-4xl sm:text-center">{user}</h1>
          <div className=' max-w-md sm:max-w-lg sm:text-center  '>Tu perfil está incompleto, ayúdanos a darte una mejor experiencia llenando los siguientes datos:</div>
          <form id="form-preferencias" className="flex flex-col gap-4 w-full sm:max-w-2xl">
            <fieldset className='flex flex-col gap-4'>
              <label
                htmlFor='name'
              >Nombre

                <input
                  className="block w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm2"
                  id="name"
                  name="name"
                  autoComplete='name'
                  value={userData.nombre}
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
              <label htmlFor='address-level1'>Estado de Origen
                <input
                  className="block w-full px-3 py-2 border bg-gray-50 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm2"
                  id="address-level1"
                  name="address-level1"
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
                  inputStyle={{ width: '100%' , background:'#f9fafb'}}
                  defaultCountry="us"
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                />
              </label>
            </fieldset>

            <fieldset className='mt-4'>
              <h2>Selecciona los estados de los que quieras recibir noticias:</h2>

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
                            className="w-4 h-4 bg-gray-100 bg-gray-50 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
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
            <div className='mt-8 flex w-full justify-center items-center'>

              <button
                className="w-80 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
                type="submit"
                onClick={(e) => uploadToServer(e)}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </section>
        {/* {
          avatar === 'default_avatar' && (
            <div>
            <h4>Selecciona una imagen como foto de perfil</h4>
            <input type="file" onChange={uploadToClient} />
            <button
            className="md:p-2 rounded text-blac bg-purple-200 p-2"
            type="submit"
            onClick={uploadToServer}
            >
            Guardar imagen
            </button>
            </div>
          )} */}
        {/* eslint-disable @next/next/no-img-element */}
        {/* {
          avatar && (
            <img
            src={`https://res.cloudinary.com/tamas-demo/image/upload/f_auto,q_auto,w_150,h_150,g_face,c_thumb,r_max/${avatar}`}
            alt="Profile"
            />
            )
          } */}
      </>
    </Layout>
  );
};


export async function getServerSideProps({ req }) {
  const jwt = getTokenFromServerCookie(req);
  if (!jwt) {
    return {
      redirect: {
        destination: '/',
      },
    };
  } else {
    const responseData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me?populate[prefEstado][fields][0]=id&populate[prefEstado][fields][1]=nombre_completo&fields[0]=email&fields[1]=nombre&fields[2]=edad&fields[3]=genero&fields[4]=estadoDeOrigen`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );


    const avatar = responseData.avatar ? responseData.avatar : 'default_avatar';
    const prefEstado = responseData.prefEstado ? responseData.prefEstado.map(estado => {
      return estado.id
    }) : [];



    const responseEstados = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados/?fields[0]=nombre_completo&sort=nombre_completo:ASC`
    );
    const listaEstados = responseEstados.data.map((edo) => {
      return { id: edo.id, nombre: edo.attributes.nombre_completo }

    })

    return {
      props: {
        avatar,
        prefEstado,
        listaEstados,
        prefUser: responseData
      },
    };
  }
}

export default Bienvenida;
