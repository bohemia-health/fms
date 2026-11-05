"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";

export default function ReportPreview({
  src,
  originalUrl,
  batchNumber,
}: {
  src: string;
  originalUrl: string;
  batchNumber: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [renderedPage, setRenderedPage] = useState(0);
  const [ratio, setRatio] = useState(1 / 1.414);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let task: PDFDocumentLoadingTask | undefined;

    async function load() {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (disposed) return;
        pdfjs.GlobalWorkerOptions.workerSrc = `/repository/pdf-worker?v=${pdfjs.version}`;
        task = pdfjs.getDocument({ url: src });
        const document = await task.promise;
        if (!disposed) setPdf(document);
      } catch {
        if (!disposed) setFailed(true);
      }
    }

    void load();
    return () => {
      disposed = true;
      void task?.destroy();
    };
  }, [src]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      // Collapsed reports remain mounted, preserving the document and page.
      if (entry.contentRect.width > 0) setWidth(Math.round(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pdf || !width) return;
    let disposed = false;
    let task: RenderTask | undefined;

    async function render() {
      try {
        const page = await pdf!.getPage(pageNumber);
        if (disposed) return;
        const natural = page.getViewport({ scale: 1 });
        const scale = (width / natural.width) * Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale });
        // Render offscreen so resizing never clears the visible page mid-render.
        const buffer = document.createElement("canvas");
        buffer.width = Math.ceil(viewport.width);
        buffer.height = Math.ceil(viewport.height);
        task = page.render({ canvas: buffer, viewport });
        await task.promise;
        const target = canvas.current;
        if (disposed || !target) return;
        target.width = buffer.width;
        target.height = buffer.height;
        target.getContext("2d")?.drawImage(buffer, 0, 0);
        setRatio(natural.width / natural.height);
        setRenderedPage(pageNumber);
      } catch {
        if (!disposed) setFailed(true);
      }
    }

    void render();
    return () => {
      disposed = true;
      task?.cancel();
    };
  }, [pdf, width, pageNumber]);

  const loading = !failed && renderedPage !== pageNumber;

  return (
    <div ref={container} className="min-w-0">
      <div
        className="relative overflow-hidden bg-white shadow-sm ring-1 ring-black/10"
        style={{ aspectRatio: ratio }}
        aria-busy={loading}
      >
        <canvas
          ref={canvas}
          role="img"
          aria-label={`Lab report for batch ${batchNumber}, page ${pageNumber}${pdf ? ` of ${pdf.numPages}` : ""}. Open the original PDF for selectable text.`}
          className={`block h-auto w-full ${loading || failed ? "invisible" : ""}`}
        />
        {loading && (
          <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-neutral-500">
            <span className="size-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-500 motion-reduce:animate-none" aria-hidden="true" />
            Loading report…
          </div>
        )}
        {failed && (
          <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-neutral-600">
            <p>The preview couldn’t load.</p>
            <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[#0065CC] hover:underline">
              Open the original PDF<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        )}
      </div>
      {pdf && pdf.numPages > 1 && !failed && (
        <nav aria-label={`Pages for batch ${batchNumber}`} className="mt-3 flex items-center justify-between gap-3 text-sm">
          <button type="button" disabled={pageNumber === 1} onClick={() => setPageNumber((page) => page - 1)} className="min-h-11 text-[#0065CC] hover:underline disabled:text-muted-foreground disabled:no-underline dark:text-[#66b0ff]">
            Previous
          </button>
          <span aria-live="polite" className="text-muted-foreground tabular-nums">Page {pageNumber} of {pdf.numPages}</span>
          <button type="button" disabled={pageNumber === pdf.numPages} onClick={() => setPageNumber((page) => page + 1)} className="min-h-11 text-[#0065CC] hover:underline disabled:text-muted-foreground disabled:no-underline dark:text-[#66b0ff]">
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
