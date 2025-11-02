import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, FileText, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { PDFPreview } from "@/components/pdf-preview";
import { PDFThumbnail } from "@/components/pdf-thumbnail";

// Sample invoices using the new templates
const sampleInvoices = [
  { id: 1, name: "Rechnungsvorlage 1.jpg", url: "/samples/rechnung-1.jpg", type: "image/jpeg", isPDF: false },
  { id: 2, name: "Rechnungsvorlage 2.jpg", url: "/samples/rechnung-2.jpg", type: "image/jpeg", isPDF: false },
  { id: 3, name: "Rechnung Vorlage 1 (ENG).pdf", url: "/samples/rechnung-3.pdf", type: "application/pdf", isPDF: true },
  { id: 4, name: "Rechnung Vorlage 2 (DE).pdf", url: "/samples/rechnung-4.pdf", type: "application/pdf", isPDF: true },
];

export default function Upload() {
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/invoices/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Upload fehlgeschlagen");
      }
      
      return response.json();
    },
    onSuccess: (invoice) => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: t("upload.success"),
        description: t("upload.successDescription"),
      });
      
      // Notify parent window (for iframe integration)
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'invoice-uploaded',
          invoice: {
            id: invoice.id,
            fileName: invoice.fileName,
            status: invoice.status
          }
        }, '*');
      }
      
      setSelectedFile(null);
      setPreview(null);
      // Redirect directly to invoice detail page for live processing view
      setLocation(`/invoice/${invoice.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: t("upload.error"),
        description: error.message,
        variant: "destructive",
      });
      
      // Notify parent window about error
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'invoice-error',
          error: error.message
        }, '*');
      }
    },
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        toast({
          title: t("upload.fileTooLarge"),
          description: t("upload.fileTooLargeDescription", { size: (rejection.file.size / 1024 / 1024).toFixed(1) }),
          variant: "destructive",
        });
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        toast({
          title: t("upload.invalidType"),
          description: t("upload.invalidTypeDescription"),
          variant: "destructive",
        });
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Double-check file size
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("upload.fileTooLarge"),
          description: t("upload.fileTooLargeDescription", { size: (file.size / 1024 / 1024).toFixed(1) }),
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSampleClick = async (sample: typeof sampleInvoices[0]) => {
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], sample.name, { type: sample.type });
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        title: t("upload.sampleLoaded"),
        description: t("upload.sampleLoadedDescription"),
      });
    } catch (error) {
      toast({
        title: t("upload.sampleError"),
        description: t("upload.sampleErrorDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 relative">
      <div className="relative z-10">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <div className="w-1 h-8 md:h-10 bg-primary rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-[hsl(210_96%_40%)] bg-clip-text text-transparent">
            {t("upload.title")}
          </h1>
        </div>
        <p className="text-muted-foreground mt-1 md:mt-2 ml-3 md:ml-4 text-sm md:text-base">
          {t("upload.description")}
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("upload.fileUpload")}</CardTitle>
              <CardDescription>
                {t("upload.fileTypes")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer
                    transition-all duration-300 hover-elevate
                    bg-gradient-to-br from-primary/5 to-primary/10
                    backdrop-blur-sm
                    ${
                      isDragActive
                        ? "border-primary bg-primary/15 shadow-lg scale-[1.02]"
                        : "border-primary/40 hover:border-primary/60 hover:shadow-md"
                    }
                  `}
                  data-testid="dropzone-upload"
                >
                  <input {...getInputProps()} />
                  <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary/20">
                    <UploadIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  {isDragActive ? (
                    <p className="text-base md:text-lg font-semibold text-primary">{t("upload.dropzoneActive")}</p>
                  ) : (
                    <>
                      <p className="text-base md:text-lg font-semibold mb-2 text-foreground">
                        {t("upload.dropzoneTitle")}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {t("upload.dropzoneSubtitle")}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium text-sm" data-testid="text-filename">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClear}
                      disabled={uploadMutation.isPending}
                      data-testid="button-clear"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="w-full"
                    data-testid="button-upload"
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("upload.uploading")}
                      </>
                    ) : (
                      <>
                        <UploadIcon className="h-4 w-4" />
                        {t("upload.uploadButton")}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("upload.sampleInvoices")}</CardTitle>
              <CardDescription>
                {t("upload.sampleDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:gap-3">
                {sampleInvoices.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSampleClick(sample)}
                    className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border hover-elevate active-elevate-2 text-left"
                    data-testid={`button-sample-${sample.id}`}
                  >
                    <div className="flex-shrink-0">
                      {sample.isPDF ? (
                        <PDFThumbnail
                          fileData={sample.url}
                          fileName={sample.name}
                          className="h-12 w-9 md:h-16 md:w-12"
                        />
                      ) : (
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="h-12 w-9 md:h-16 md:w-12 object-cover rounded border"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs md:text-sm truncate">{sample.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sample.isPDF ? t("upload.pdfInvoice") : t("upload.jpgInvoice")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {preview && (
          <Card>
            <CardHeader>
              <CardTitle>{t("upload.preview")}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFile?.type === "application/pdf" ? (
                <PDFPreview
                  fileData={preview}
                  fileName={selectedFile.name}
                />
              ) : (
                <div className="border rounded-lg overflow-hidden bg-muted/20">
                  <img
                    src={preview}
                    alt="Vorschau"
                    className="w-full h-auto"
                    data-testid="img-preview"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
