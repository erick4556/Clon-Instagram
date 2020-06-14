import { useState, useEffect } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(null);

  //Para saber si es móvil
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 576px)");

    mql.addListener(revisarSiEsMovil);

    const revisarSiEsMovil = () => {
      if (mql.matches) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };

    revisarSiEsMovil();

    //Dejar de escuchar el matchMedia
    return () => mql.removeListener(revisarSiEsMovil);
  }, []);

  return isMobile;
};

export default useIsMobile;
