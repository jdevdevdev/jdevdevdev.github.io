import { useRef, useCallback, useState, useEffect } from "react";

interface FullscreenDocument extends Document {
  exitFullscreen: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  fullscreenElement: Element | null;
  mozFullScreenElement?: Element | null;
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
}

interface FullscreenElement extends HTMLDivElement {
  requestFullscreen: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

export function useFullscreen() {
  const fullscreenRef = useRef<FullscreenElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    const doc = document as FullscreenDocument;
    doc.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => doc.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const enterFullscreen = useCallback(() => {
    if (fullscreenRef.current) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (fullscreenRef.current.mozRequestFullScreen) {
        fullscreenRef.current.mozRequestFullScreen();
        setIsFullscreen(true);
      } else if (fullscreenRef.current.webkitRequestFullscreen) {
        fullscreenRef.current.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if (fullscreenRef.current.msRequestFullscreen) {
        fullscreenRef.current.msRequestFullscreen();
        setIsFullscreen(true);
      }
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    const doc = document as FullscreenDocument;
    if (!Boolean(document.fullscreenElement)) {
      return;
    }
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
      setIsFullscreen(false);
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
      setIsFullscreen(false);
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
      setIsFullscreen(false);
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return { fullscreenRef, isFullscreen, enterFullscreen, exitFullscreen };
}
