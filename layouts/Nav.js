import Link from 'next/link';
import { useState } from 'react';
import { fetcher } from '../lib/api';
import { setToken, unsetToken } from '../lib/auth';
import { useUser } from '../lib/authContext';
import { Button } from '../components/Button';
import { useSidebarContext } from '../contexts/SidebarContext';
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Menu, UserCircle, ArrowBigLeft } from 'lucide-react';
import youtubeIcon from '../public/youtube.svg'
import instagramIcon from '../public/instagram.svg'
import tiktokIcon from '../public/tiktok-outline-svgrepo-com.svg'

const Nav = ({ back }) => {
  const router = useRouter()
  const [data, setData] = useState({
    identifier: '',
    password: '',
  });
  const { toggle } = useSidebarContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { user, loading } = useUser();

  const handleMenu = () => {

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const responseData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
      }
    );
    setToken(responseData);
  };

  const logout = () => {
    unsetToken();
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div
      className="
          flex
          items-center
          justify-between
          mx-2
          md:px-4
          py-3
          shadow-md
          mb-1
          bg-white
        "
    >
      <div className='flex items-center gap-2'>
        {
          back ? (
            <>
              <Button onClick={() => router.back()} variant="ghost" size="icon">
                <ArrowBigLeft />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={toggle} variant="ghost" size="icon">
                <Menu />
              </Button>
            </>
          )
        }
        <Link href="/" passHref>
          <Image src="/logo-light.png" alt="Informativo MXN Logo" width={100} height={50} />
        </Link>
      </div>
      <ul className="flex items-center gap-2">
        <li>
          <Link href="https://www.tiktok.com/@infomxn/" passHref>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Image src={tiktokIcon} alt="TikTok" />
            </Button>
          </Link>
        </li>
        <li>
          <Link href="https://www.youtube.com/@InformativoMXN" passHref>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Image src={youtubeIcon} alt="YouTube" />
            </Button>
          </Link>

        </li>
        <li>
          <Link href="https://instagram.com/informativomxn" passHref>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Image className='' src={instagramIcon} alt="Instagram" />
            </Button>
          </Link>

        </li>
        <li>
          {!loading && !user ? (

            <AccederBtn />

          ) : !back && (
            <>
              <Link href="/preferencias" passHref>
                <Button variant="ghost" size="icon">
                  <UserCircle />
                </Button>
              </Link>
            </>
          )}
        </li>
      </ul>

    </div>
  );
};

const AccederBtn = () => {
  return (
    <Link className="
    flex justify-center 
    py-2 
    px-2 md:px-4 
    
    text-sm 
    md:text-base
    font-medium 
    border border-transparent 
    rounded-md shadow-sm 
    text-white 
    bg-red-600 hover:bg-red-700 
    focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-red-500
    "
      href="/iniciar-sesion">
      Acceder
    </Link>
  );
};
export default Nav;
