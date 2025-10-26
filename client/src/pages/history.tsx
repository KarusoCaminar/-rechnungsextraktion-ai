import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Eye, Trash2, Download, FileText, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDFThumbnail } from "@/components/pdf-thumbnail";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Invoice } from "@shared/schema";

export default function History() {
  const { toast } = useToast();
  
  // Check if there are any invoices being processed
  const hasProcessingInvoices = (invoices: Invoice[]) => 
    invoices.some(inv => inv.status === 'processing');
  
  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
    refetchInterval: (query) => {
      const data = query.state.data as Invoice[] | undefined;
      // Auto-refresh every 3 seconds if there are processing invoices
      return data && hasProcessingInvoices(data) ? 3000 : false;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: "Gelöscht",
        description: "Rechnung wurde erfolgreich gelöscht.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Rechnung konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (format: "csv" | "json") => {
      const response = await fetch(`/api/invoices/export?format=${format}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Export fehlgeschlagen");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rechnungen-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Exportiert",
        description: "Daten wurden erfolgreich exportiert.",
      });
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Export fehlgeschlagen.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
            <CheckCircle className="h-3 w-3" />
            Abgeschlossen
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
            <Clock className="h-3 w-3" />
            Verarbeitung
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3" />
            Fehler
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Rechnungshistorie
          </h1>
          <p className="text-muted-foreground mt-2">
            Alle verarbeiteten Rechnungen
          </p>
        </div>
        {invoices.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportMutation.mutate("csv")}
              disabled={exportMutation.isPending}
              data-testid="button-export-csv"
            >
              {exportMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              CSV Export
            </Button>
            <Button
              variant="outline"
              onClick={() => exportMutation.mutate("json")}
              disabled={exportMutation.isPending}
              data-testid="button-export-json"
            >
              {exportMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              JSON Export
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-16 bg-muted rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keine Rechnungen vorhanden</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              Laden Sie Ihre erste Rechnung hoch, um die Historie zu sehen.
            </p>
            <Link href="/upload">
              <Button data-testid="button-goto-upload">
                Rechnung hochladen
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover-elevate" data-testid={`card-invoice-${invoice.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {invoice.fileType.startsWith("image/") ? (
                      <img
                        src={invoice.fileData}
                        alt={invoice.fileName}
                        className="h-20 w-16 object-cover rounded border"
                      />
                    ) : invoice.fileType === "application/pdf" ? (
                      <PDFThumbnail
                        fileData={invoice.fileData}
                        fileName={invoice.fileName}
                      />
                    ) : (
                      <div className="h-20 w-16 bg-muted rounded border flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1" data-testid={`text-invoice-number-${invoice.id}`}>
                          {invoice.invoiceNumber || invoice.fileName}
                        </h3>
                        {invoice.supplierName && (
                          <p className="text-sm text-muted-foreground">
                            {invoice.supplierName}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {invoice.invoiceDate && (
                        <div>
                          <p className="text-xs text-muted-foreground">Datum</p>
                          <p className="text-sm font-medium">{invoice.invoiceDate}</p>
                        </div>
                      )}
                      {invoice.totalAmount && (
                        <div>
                          <p className="text-xs text-muted-foreground">Gesamt</p>
                          <p className="text-sm font-medium tabular-nums">
                            {parseFloat(invoice.totalAmount).toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>
                      )}
                      {invoice.vatAmount && (
                        <div>
                          <p className="text-xs text-muted-foreground">MwSt.</p>
                          <p className="text-sm font-medium tabular-nums">
                            {parseFloat(invoice.vatAmount).toLocaleString("de-DE", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>
                      )}
                      {invoice.vatRate && (
                        <div>
                          <p className="text-xs text-muted-foreground">MwSt.-Satz</p>
                          <p className="text-sm font-medium">{invoice.vatRate}%</p>
                        </div>
                      )}
                    </div>

                    {invoice.status === "processing" && (
                      <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-yellow-600 dark:text-yellow-400" />
                          <p className="text-sm text-yellow-800 dark:text-yellow-400">
                            KI extrahiert Rechnungsdaten... Wird automatisch aktualisiert.
                          </p>
                        </div>
                      </div>
                    )}

                    {invoice.status === "error" && invoice.errorMessage && (
                      <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">{invoice.errorMessage}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/invoice/${invoice.id}`}>
                        <Button variant="outline" size="sm" data-testid={`button-view-${invoice.id}`}>
                          <Eye className="h-4 w-4" />
                          Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(invoice.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${invoice.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Löschen
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
