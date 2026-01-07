import Link from 'next/link';
import MuxPlayer from "@mux/mux-player-react";
// import MinimalTheme from '@mux/mux-player-react/themes/minimal'
import PlayerTheme from '@mux/mux-player-react/themes/microvideo'


const ImagenPortada = ({ thumbnail, titulo, sintesis, link }) => {
  return (
    <>
      <Link className={`relative flex flex-col rounded-xl   justify-end xl:justify-center`} href={link}>
        <img src={thumbnail} alt={sintesis} className=" aspect-video w-full  object-cover object-left-top rounded-xl" />
      <div className='absolute max-w-fit bg-black bg-opacity-30 p-5 xl:p-10 rounded-2xl   '>
        <div className='text-white text-lg md:text-4xl font-bold'>
          {titulo}
        </div>
        <div className='text-white text-sm  md:text-xl font-bold'>
          {sintesis}
        </div>
      </div>
      </Link>
    </>
  )
}

const Portada = ({ programa, modo = "IMAGEN" }) => {

  const thumbnail = (programa.attributes.portada?.data) ? programa.attributes.portada.data.attributes.url : `https://image.mux.com/${programa.attributes.video_pral.data.attributes.playback_id}/thumbnail.png?time=6`
  const titulo = programa.attributes.lanzamiento.split('-').reverse().join('-') + ' - ' + programa.attributes.region_estado.data.attributes.nombre_completo
  const sintesis = programa.attributes.sintesis
  const link = `/programa/${programa.id}`
  return (
    <>
        {
          modo === "IMAGEN" ?
            <ImagenPortada thumbnail={thumbnail} titulo={titulo} sintesis={sintesis} link={link} />
            : 
            <MuxPlayer
              theme={PlayerTheme}
              autoPlay="muted"
              streamType="on-demand"
              playbackId={programa.attributes.video_pral.data.attributes.playback_id}
              accentColor="#e02424"
              metadata={{
                video_id: programa.attributes.video_pral.data.attributes.playback_id,
                video_title: programa.attributes.titulo,
                viewer_user_id: "user-id-007",
              }}
            />
        }



    </>
  )
}

export default Portada;