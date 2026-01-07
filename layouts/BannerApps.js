import Image from 'next/image';
import DownloadOnTheAppStoreBadge from "../public/Download_on_the_App_Store_Badge_ESMX_RGB_blk_100217.svg"
const BannerApps = () => {
    return (
        <>

            <div className=' flex px-2  py-2  items-center justify-center bg-red-600  '>

                <div className=' text-center font-staatliches text-xl md:text-4xl text-white md:px-4 '>
                    <h4 className=' mx-4'>
                    DESCARGA EL APP GRATIS
                </h4>
                </div>

                <div className=' flex-none flex gap-4 items-center'>

                    <a href='https://apps.apple.com/us/app/informativo-mxn/id6479166240'>
                        <Image
                            priority={true}
                            src={DownloadOnTheAppStoreBadge}
                            alt="Disponible en App Store"
                            width="180"
                        />
                    </a>


                    <a href='https://play.google.com/store/apps/details?id=com.informativomxn.app&utm_source=www'>
                        <Image
                            priority={true}
                            src="/google-play-badge.png"
                            width={204}
                            height={85}
                            alt="Disponible en Google Play" />
                    </a>
                </div>
            </div>
        </>
    )
}

export default BannerApps;