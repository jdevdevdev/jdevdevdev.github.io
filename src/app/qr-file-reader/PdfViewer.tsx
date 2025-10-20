"use client";
import React, { useRef, useState, useEffect } from "react";
import { loadOpenCv } from "./components/LoadOpenCV";

const PdfJsViewer = ({ fileUrl }: { fileUrl: string }) => {
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [qrValue, setQrValue] = useState<string[]>([]);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [CVready, setCVRead] = useState<boolean>(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    const main = async () => {
      const pdfjs = (await import("pdfjs-dist"));
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      loadOpenCv(() => { setCVRead(true); });
    };
    main();
  }, [fileUrl]);
  // @ts-expect-error todo 
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async function () {
        // @ts-expect-error todo
        const typedArray = new Uint8Array(reader.result);
        // @ts-expect-error todo
        const loadingTask = pdfjsLib.getDocument({ data: typedArray });
        // @ts-expect-error todo
        loadingTask.promise.then(pdf => {
          pdfRef.current = pdf;
          setNumPages(pdf.numPages);
          setPdfDoc(pdf);
          renderPage(pdf, pageNumber);
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };
  // @ts-expect-error todo
  const detectQRCode = (canvas) => {
    // @ts-expect-error todo
    const cv = window.cv;
    const src = cv.imread(canvas);
    const qrDecoder = new cv.QRCodeDetector();
    const decodedStrings = new cv.StringVector();
    const points = new cv.Mat();
    const straightQRCodes = new cv.MatVector();
    const result = [];
    try {
      const success = qrDecoder.detectAndDecodeMulti(src, decodedStrings, points, straightQRCodes);
      console.log(success);
      if (success) {
        for (let i = 0; i < decodedStrings.size(); i++) {
          const decodedText = decodedStrings.get(i);
          console.log(`QR ${i}: ${decodedText}`);

          result.push(`QR ${i}: ${decodedText}`);
          const cornerData = points.data32F.subarray(i * 8, (i + 1) * 8);

          for (let j = 0; j < 4; j++) {
            const x1 = cornerData[j * 2];
            const y1 = cornerData[j * 2 + 1];
            const x2 = cornerData[((j + 1) % 4) * 2];
            const y2 = cornerData[((j + 1) % 4) * 2 + 1];

            cv.line(
              src,
              new cv.Point(x1, y1),
              new cv.Point(x2, y2),
              new cv.Scalar(0, 255, 0, 255),
              2
            );
          }

          const font = cv.FONT_HERSHEY_SIMPLEX;
          const customText = ` ${i} `;
          const org = new cv.Point(cornerData[0], cornerData[1] - 10);
          const fontScale = 0.9;
          const color = new cv.Scalar(0, 0, 0, 255);
          const thickness = 2;
          function estimateTextSize(text: string, thickness: number) {
            const approxWidth = text.length * 16;
            const approxHeight = 20 + thickness;
            return { width: approxWidth, height: approxHeight };
          }

          const textSize = estimateTextSize(customText, thickness);
          const textWidth = textSize.width;
          const textHeight = textSize.height;

          const x = cornerData[0];
          const y = cornerData[1] - 10;

          cv.rectangle(
            src,
            new cv.Point(x, y - textHeight),
            new cv.Point(x + textWidth, y + 5),
            new cv.Scalar(0, 255, 0, 255),
            cv.FILLED
          );

          cv.putText(src, customText, org, font, fontScale, color, thickness);
        }

        cv.imshow(canvas, src);
        setQrValue([...result]);
      } else {
        setQrValue([...qrValue, "No QR code found."]);
      }
    } catch (err) {
      console.error("QR detection error:", err);
      setQrValue([...qrValue, "Error detecting QR code."]);
    } finally {
      src.delete();
      points.delete();
      decodedStrings.delete();
      straightQRCodes.delete();
    }
  };
  // @ts-expect-error todo
  const renderPage = async (pdf, num) => {
    const page = await pdf
      .getPage(num);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    // @ts-expect-error todo
    const context = canvas.getContext("2d");
    // @ts-expect-error todo
    canvas.height = viewport.height;
    // @ts-expect-error todo
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    const renderTask = page.render(renderContext);
    await renderTask.promise;
  };

  const goToPrevPage = () => {
    if (pageNumber <= 1) return;
    const newPage = pageNumber - 1;
    setPageNumber(newPage);
    renderPage(pdfRef.current, newPage);
  };

  const goToNextPage = () => {
    if (pageNumber >= numPages) return;
    const newPage = pageNumber + 1;
    setPageNumber(newPage);
    renderPage(pdfRef.current, newPage);
  };
  const readAll = async () => {
    detectQRCode(canvasRef.current);
  };
  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <canvas ref={canvasRef}></canvas>
      <div>
        <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
          Next
        </button>
        <button disabled={!CVready || !pdfDoc} onClick={readAll}>
          read all
        </button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <p>{JSON.stringify(qrValue)}</p>
      </div>
    </div>
  );
};

export default PdfJsViewer;
