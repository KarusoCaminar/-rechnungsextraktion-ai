import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker - use the installed pdfjs-dist package
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFThumbnailProps {
  fileData: string;
  fileName: string;
  className?: string;
}

export function PDFThumbnail({ fileData, fileName, className = '' }: PDFThumbnailProps) {
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  function onLoadSuccess() {
    setLoading(false);
    setError(false);
  }

  function onLoadError() {
    setLoading(false);
    setError(true);
  }

  if (error) {
    return (
      <div className={`h-20 w-16 bg-muted rounded border flex items-center justify-center ${className}`}>
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`h-20 w-16 bg-muted rounded border overflow-hidden relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground animate-pulse" />
        </div>
      )}
      <Document
        file={fileData}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={null}
      >
        <Page
          pageNumber={1}
          width={64}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="pdf-thumbnail"
        />
      </Document>
    </div>
  );
}

