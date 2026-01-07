import Head from 'next/head';
import Nav from '../layouts/Nav';
import { UserProvider } from '../lib/authContext';
import Sidebar from '../layouts/Sidebar';
import { SidebarProvider } from "../contexts/SidebarContext"

const Layout = ({ user, loading = false, children, regiones = { data: [] } }) => (
  <layout>
      <SidebarProvider>

    <UserProvider value={{ user, loading }}>
      <Head>
        <title>Informativo MXN</title>
      </Head>
      <div className="max-h-screen flex flex-col">
        <Nav />
        <div className='grid grid-cols-[auto,1fr] flex-grow-1 overflow-auto'>
          <Sidebar regiones={regiones} />
         {children}
          </div>
        </div>
    </UserProvider>
    </SidebarProvider>

  </layout>
);
export default Layout;
