import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker - use CDN with https
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFPreviewProps {
  fileData: string;
  fileName: string;
  className?: string;
}

export function PDFPreview({ fileData, fileName, className = '' }: PDFPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setError(false);
  }

  function onDocumentLoadError() {
    setError(true);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  }

  function zoomOut() {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 bg-muted/30 rounded-lg border ${className}`}>
        <div className="text-center max-w-md px-4">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground mb-2">PDF-Vorschau nicht verfügbar</p>
          <p className="text-xs text-muted-foreground mb-4">
            Die PDF konnte nicht geladen werden. Dies kann an Browser-Einstellungen oder AdBlockern liegen.
          </p>
          <p className="text-xs text-muted-foreground">{fileName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={pageNumber <= 1}
            aria-label="Vorherige Seite"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Seite {pageNumber} von {numPages || '...'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            aria-label="Nächste Seite"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            aria-label="Verkleinern"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={scale >= 2.0}
            aria-label="Vergrößern"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-auto bg-muted/30">
        <div className="flex justify-center p-4">
          <Document
            file={fileData}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}

