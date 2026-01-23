import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Esto mueve el scroll a la coordenada (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Se activa cada vez que la ruta (URL) cambia

  return null;
};

export default ScrollToTop;