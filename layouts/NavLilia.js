import Link from 'next/link';
import { useState } from 'react';
import { fetcher } from '../lib/api';
import { setToken, unsetToken } from '../lib/auth';
import { useUser } from '../lib/authContext';
import { Button } from '../components/Button';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Menu, UserCircle, ArrowBigLeft, X } from 'lucide-react';

const NavLilia = ({ back }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    unsetToken();
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 shadow-md bg-white border-b border-gray-100">
        {/* Logo */}
        <div className="flex items-center gap-4">
          {back ? (
            <Button onClick={() => router.back()} variant="ghost" size="icon">
              <ArrowBigLeft />
            </Button>
          ) : (
            <Button onClick={toggleMenu} variant="ghost" size="icon" className="md:hidden">
              <Menu />
            </Button>
          )}
          <Link href="/" passHref>
            <span className="text-2xl font-bold text-lilia-primary">Lilia</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <Link href="/" className="text-gray-700 hover:text-lilia-primary transition">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/columnas" className="text-gray-700 hover:text-lilia-primary transition">
              Columnas
            </Link>
          </li>
          <li>
            <Link href="/autores" className="text-gray-700 hover:text-lilia-primary transition">
              Autores
            </Link>
          </li>
        </ul>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {!loading && !user ? (
            <Link
              className="flex justify-center py-2 px-4 text-sm font-medium border border-transparent rounded-md shadow-sm text-white bg-lilia-primary hover:bg-lilia-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lilia-primary transition"
              href="/iniciar-sesion"
            >
              Acceder
            </Link>
          ) : !back && (
            <Link href="/preferencias" passHref>
              <Button variant="ghost" size="icon">
                <UserCircle />
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={toggleMenu} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-xl font-bold text-lilia-primary">Lilia</span>
              <Button onClick={toggleMenu} variant="ghost" size="icon">
                <X />
              </Button>
            </div>
            <ul className="p-4 space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-700 hover:text-lilia-primary"
                  onClick={toggleMenu}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  href="/columnas" 
                  className="block py-2 text-gray-700 hover:text-lilia-primary"
                  onClick={toggleMenu}
                >
                  Columnas
                </Link>
              </li>
              <li>
                <Link 
                  href="/autores" 
                  className="block py-2 text-gray-700 hover:text-lilia-primary"
                  onClick={toggleMenu}
                >
                  Autores
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NavLilia;
