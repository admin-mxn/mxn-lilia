import Link from 'next/link';
import { fetcher } from '../lib/api';
import useSWR from 'swr';

import { useState, Children, ElementType, ReactNode, } from 'react';
import { Button } from '../components/Button';
import { PageHeaderFirstSection } from "./PageHeader"
import { buttonStyles } from '../components/Button';
import {
    ChevronDown,
    ChevronUp,
    ChevronRight,
    Clapperboard,
    Clock,
    Home,
    Library,
    PlaySquare,
    Repeat,
    History,
    ListVideo,
    Flame,
    ShoppingBag,
    Music2,
    Film,
    Radio,
    Gamepad2,
    Newspaper,
    Trophy,
    Lightbulb,
    Shirt,
    Podcast,
    Mail,
} from "lucide-react"

import { twMerge } from 'tailwind-merge';
import { useSidebarContext } from '../contexts/SidebarContext';

const Sidebar = ({ regiones }) => {
    //console.log({ regiones })
    // const { data } = useSWR(
    //     `${process.env.NEXT_PUBLIC_STRAPI_URL}/region-estados?sort=nombre_completo:ASC`,
    //     fetcher,
    //     {
    //         fallbackData: regiones,
    //     }
    // );
    const { isLargeOpen, isSmallOpen, close } = useSidebarContext()
    const secciones = [
        "Agua, Clima y Medio Ambiente",
        "Cultura y Tradiciones Mexicanas",
        "Curiosidades",
        "Destacados en Deportes",
        "Economía",
        "Educación",
        "Espectáculos",
        "Fiestas",
        "Innovación y tecnología",
        "Inclusión",
        "Información que ayuda",
        "Mascotas y más animales",
        "Mexicanos en el mundo",
        "Movilidad Humana",
        "Negocios",
        "Politica",
        "Sociales ",
        "Salud",
        "Turismo"
    ]

    return (
        <>
            <div className={` bg-white flex flex-col  py-4 z-30 `}>
                {/* Prueba {isLargeOpen ? "LO O" : "LO C"}<br />
                Prueba {isSmallOpen ? "SO O" : "SO C"}<br />
                Prueba {close ? "Abierto" : "Cerrado"}<br /> */}
                {/* <aside className="sticky top-0 overflow-y-auto  scrollbar-hidden  pb-4 flex flex-col ml-1 md:hidden ">
                <SmallSidebarItem Icon={Newspaper} title="Portada" url="/" />
            </aside> */}

                <aside className={` overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-4  ${isLargeOpen || isSmallOpen ? "flex" : "hidden"}`}>
                    {/* <div className="pt-2 pb-4 px-2 sticky top-0 bg-gray-300">
                    <PageHeaderFirstSection />
                </div> */}
                    <LargeSidebarSection >
                        <LargeSidebarItem isActive Icon={Newspaper} title="Portada" url="/" />
                        <LargeSidebarItem Icon={Mail} title="Newsletter" url="/notas" />
                    </LargeSidebarSection>
                    <LargeSidebarSection title={"Estados"} visibleItemCount={7} >
                        {regiones.data.map((region, index) => {

                            return (
                                <LargeSidebarItem key={index} Icon={ChevronRight} title={region.attributes.nombre_completo} url={`/estado/${region.attributes.nombre_completo}`} />
                            )
                        })}
                    </LargeSidebarSection>
                    <LargeSidebarSection title={"Secciones"} visibleItemCount={7} >
                        {secciones.map((seccion, index) => {

                            return (
                                <LargeSidebarItem key={index} Icon={ChevronRight} title={seccion} url={`/seccion/${seccion}`} />
                            )
                        })}
                    </LargeSidebarSection>
                </aside>
                <div className={`px-2 text-sm  flex flex-col justify-end ${isLargeOpen || isSmallOpen ? "flex" : "hidden"}`} >
                    {/* <Link href="/acerca">Acerca de</Link> */}
                    <Link className='hover:underline' href="/politicaprivacidad">Política de Privacidad</Link>
                    {/* <Link  className='font-bold text-red-600 hover:underline' href="https://www.informativomayar.com">© 2024 INFORMATIVO MAYAR S.A DE C.V</Link> */}
                    <br />

                </div>

            </div>

        </>
    )
}

function SmallSidebarItem({ Icon, title, url }) {
    return (
        <Link href={url}
            className={twMerge(
                buttonStyles({ variant: "ghost" }),
                "py-4 px-1 flex flex-col items-center rounded-lg gap-1")}    >
            <Icon className="w-6 h-6" />
            <div className="text-sm">{title}</div>
        </Link>
    )
}



function LargeSidebarSection({
    children,
    title,
    visibleItemCount = Number.POSITIVE_INFINITY,
}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const childrenArray = Children.toArray(children).flat()
    const showExpandButton = childrenArray.length > visibleItemCount
    const visibleChildren = isExpanded
        ? childrenArray
        : childrenArray.slice(0, visibleItemCount)
    const ButtonIcon = isExpanded ? ChevronUp : ChevronDown

    return (
        <div>
            {title && <div className="ml-4 mt-2 text-lg mb-1">{title}</div>}
            {visibleChildren}
            {showExpandButton && (
                <Button
                    onClick={() => setIsExpanded(e => !e)}
                    variant="ghost"
                    className="flex items-center rounded-lg gap-4 p-3"
                >
                    <ButtonIcon className="w-6 h-6" />
                    <div>{isExpanded ? "Mostrar Menos" : "Mostrar Más"}</div>
                </Button>
            )}
        </div>
    )
}


function LargeSidebarItem({
    Icon,
    title,
    url,
    isActive,
}) {
    return (
        <a
            href={url}
            className={twMerge(
                buttonStyles({ variant: "ghost" }),
                `flex items-center rounded-lg gap-4 p-3 ${isActive ? "font-bold hover:bg-secondary" : undefined}`)}
        >
            <Icon className="w-6 h-6" />
            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                {title}
            </div>
        </a>
    )
}
export default Sidebar;