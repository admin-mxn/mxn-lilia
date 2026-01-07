import Image from 'next/image';
import Link from 'next/link';

const Banner = ({ data }) => {
    const banner = data[Math.floor(Math.random() * data.length)]
    return (
        <Link href={banner.link} >
            <Image src={banner.imagen.data.attributes.url}
                alt={banner.imagen.data.attributes.alternativeText}
                width={banner.imagen.data.attributes.width}
                height={banner.imagen.data.attributes.height}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
            />
        </Link>
    );
}
export default Banner;