import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload as UploadIcon, FileText, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

// Import sample invoices (3 JPG images + 2 PDF files)
import sampleInvoice1 from "@assets/generated_images/German_invoice_sample_1_de4bee7c.png";
import sampleInvoice2 from "@assets/generated_images/German_invoice_sample_2_7415d5e0.png";
import sampleInvoice3 from "@assets/generated_images/German_invoice_sample_3_882689e3.png";

const sampleInvoices = [
  { id: 1, name: "Beispielrechnung 1.jpg", url: sampleInvoice1, type: "image/jpeg", isPDF: false },
  { id: 2, name: "Beispielrechnung 2.jpg", url: sampleInvoice2, type: "image/jpeg", isPDF: false },
  { id: 3, name: "Beispielrechnung 3.jpg", url: sampleInvoice3, type: "image/jpeg", isPDF: false },
  { id: 4, name: "Geschäftsrechnung.pdf", url: "/samples/rechnung-beispiel-4.pdf", type: "application/pdf", isPDF: true },
  { id: 5, name: "Beratungsrechnung.pdf", url: "/samples/rechnung-beispiel-5.pdf", type: "application/pdf", isPDF: true },
];

export default function Upload() {
  const [, setLocation] = useLocation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Erfolgreich hochgeladen",
        description: "Die Rechnung wird jetzt verarbeitet.",
      });
      setSelectedFile(null);
      setPreview(null);
      setLocation("/history");
    },
    onError: (error: Error) => {
      toast({
        title: "Upload fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

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
        title: "Beispielrechnung geladen",
        description: "Klicken Sie auf 'Hochladen', um fortzufahren.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beispielrechnung konnte nicht geladen werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Rechnung hochladen
        </h1>
        <p className="text-muted-foreground mt-2">
          Laden Sie eine Rechnung hoch oder wählen Sie ein Beispiel
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datei hochladen</CardTitle>
              <CardDescription>
                JPG, PNG oder PDF - Maximal 10 MB
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                    transition-all duration-200 hover-elevate
                    ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }
                  `}
                  data-testid="dropzone-upload"
                >
                  <input {...getInputProps()} />
                  <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-lg font-medium">Hier ablegen...</p>
                  ) : (
                    <>
                      <p className="text-lg font-medium mb-2">
                        Datei hierher ziehen
                      </p>
                      <p className="text-sm text-muted-foreground">
                        oder klicken Sie zum Auswählen
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
                        Wird hochgeladen...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="h-4 w-4" />
                        Hochladen
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Beispielrechnungen</CardTitle>
              <CardDescription>
                Klicken Sie auf eine Beispielrechnung zum Testen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {sampleInvoices.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSampleClick(sample)}
                    className="flex items-center gap-3 p-3 rounded-lg border hover-elevate active-elevate-2 text-left"
                    data-testid={`button-sample-${sample.id}`}
                  >
                    <div className="flex-shrink-0">
                      {sample.isPDF ? (
                        <div className="h-16 w-12 bg-muted rounded border flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      ) : (
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="h-16 w-12 object-cover rounded border"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sample.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {sample.isPDF ? "PDF-Rechnung" : "JPG-Rechnung"}
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
              <CardTitle>Vorschau</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-muted/20">
                {selectedFile?.type === "application/pdf" ? (
                  <div className="flex items-center justify-center h-96 bg-muted/30">
                    <div className="text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        PDF-Vorschau nicht verfügbar
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={preview}
                    alt="Vorschau"
                    className="w-full h-auto"
                    data-testid="img-preview"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
