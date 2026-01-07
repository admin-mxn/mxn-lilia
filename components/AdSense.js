import Script from "next/script";
import { useEffect } from "react";

const dataAdClient = "ca-pub-9725259631973690";

export const AdSense = () => (
    <Script
        id="adsense"
        strategy="beforeInteractive"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9725259631973690"
        crossOrigin="anonymous"
    />
);

export const AdDisplayHorizontal = () => {
    useEffect(() => {

        try {

            (window.adsbygoogle = window.adsbygoogle || []).push({});

        } catch (e) {
            console.error(e);
        }

    }, []);
    return (
        <>
            {/* <div key={Math.random().toString(36).substring(2, 15)} className="text-center"> */}
            <div className='flex justify-center my-1 bg-gray-200' >

                <ins className="adsbygoogle w-[300px] h-[50px] md:w-[728px] md:h-[90px] text-center"

                    style={{ display: "block", textAlign: "center" }}
                    data-ad-client={dataAdClient}
                    data-ad-slot="4540071034"
                // data-ad-format="auto"
                // data-full-width-responsive="true"
                ></ins>

            </div>
        </>
    )
};

export const AdInArticle1 = () => {


    useEffect(() => {

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e);
        }

    }, []);
    return (
        <>
            <div key={Math.random().toString(36).substring(2, 15)}>

                <ins className="adsbygoogle"
                    style={{ display: "block", textAlign: "center" }}
                    data-ad-layout="in-article"
                    data-ad-format="fluid"
                    data-ad-client={dataAdClient}
                    data-ad-slot="2202300855"
                ></ins>

            </div>
        </>
    )
};

export const AdFooter = () => {


    useEffect(() => {

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e);
        }

    }, []);
    return (
        <>
            {/* <div key={Math.random().toString(36).substring(2, 15)}
                className="w-[300px] h-[50px] md:w-[728px] md:h-[90px]"> */}

            <ins
                className="
                    adsbygoogle 
                    w-[300px] h-[50px] 
                    md:w-[728px] md:h-[90px] 
                    text-center
                    "
                data-ad-client={dataAdClient}
                data-ad-slot="2982682441"
            // style={{ display: "block", textAlign: "center"  }}
            // data-ad-format="auto"
            // data-full-width-responsive="true"
            >
            </ins>
            {/* </div> */}
        </>
    )
};
