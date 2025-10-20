// @ts-expect-error todo
export function loadOpenCv(onloadCallback) {
  const scriptId = "opencvjs";

  if (document.getElementById(scriptId)) {
    // @ts-expect-error todo
    if (window.cv && window.cv.Mat) {
      onloadCallback();
    }
    return;
  }

  const script = document.createElement("script");
  script.id = scriptId;
  script.src = "https://docs.opencv.org/4.12.0/opencv.js";
  script.async = true;
  script.onload = () => {
    console.log("OpenCV.js script loaded");
    // @ts-expect-error todo
    window.cv["onRuntimeInitialized"] = () => {
      console.log("OpenCV.js runtime initialized");
      onloadCallback();
    };
  };
  script.onerror = () => {
    console.error("Failed to load OpenCV.js");
  };

  document.body.appendChild(script);
}
