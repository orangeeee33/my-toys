import {
  useEffect
} from "react";

import type {
  RefObject
} from "react";


export function useVideoScroll(
  videoRef:
    RefObject<HTMLVideoElement | null>,

  sectionRef:
    RefObject<HTMLElement | null>
) {
  useEffect(() => {

    const videoElement =
      videoRef.current;

    const sectionElement =
      sectionRef.current;


    if (
      videoElement === null ||
      sectionElement === null
    ) {
      return;
    }


    const activeVideo:
      HTMLVideoElement =
        videoElement;

    const activeSection:
      HTMLElement =
        sectionElement;


    let animationFrame = 0;


    function updateVideo() {

      const sectionTop =
        activeSection
          .getBoundingClientRect()
          .top;


      const scrollDistance =
        activeSection.offsetHeight -
        window.innerHeight;


      if (scrollDistance <= 0) {
        return;
      }


      const currentScroll =
        Math.min(
          Math.max(
            -sectionTop,
            0
          ),
          scrollDistance
        );


      const progress =
        currentScroll /
        scrollDistance;


      if (
        Number.isFinite(
          activeVideo.duration
        ) &&
        activeVideo.duration > 0
      ) {
        activeVideo.currentTime =
          progress *
          activeVideo.duration;
      }
    }


    function requestVideoUpdate() {

      cancelAnimationFrame(
        animationFrame
      );


      animationFrame =
        requestAnimationFrame(
          updateVideo
        );
    }


    function prepareVideo() {

      activeVideo.pause();

      updateVideo();
    }


    activeVideo.addEventListener(
      "loadedmetadata",
      prepareVideo
    );


    window.addEventListener(
      "scroll",
      requestVideoUpdate,
      {
        passive: true
      }
    );


    window.addEventListener(
      "resize",
      requestVideoUpdate
    );


    if (
      activeVideo.readyState >= 1
    ) {
      prepareVideo();
    }


    return () => {

      cancelAnimationFrame(
        animationFrame
      );


      activeVideo.removeEventListener(
        "loadedmetadata",
        prepareVideo
      );


      window.removeEventListener(
        "scroll",
        requestVideoUpdate
      );


      window.removeEventListener(
        "resize",
        requestVideoUpdate
      );
    };

  }, [
    videoRef,
    sectionRef
  ]);
}