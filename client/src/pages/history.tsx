import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Eye, Trash2, Download, FileText, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDFThumbnail } from "@/components/pdf-thumbnail";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { i18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Invoice } from "@shared/schema";

export default function History() {
  const { toast } = useToast();
  const { t } = useTranslation();
  
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
        title: t("history.deleted"),
        description: t("history.deletedDescription"),
      });
    },
    onError: () => {
      toast({
        title: t("history.deleteError"),
        description: t("history.deleteErrorDescription"),
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
        throw new Error(t("history.exportErrorDescription"));
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = i18n.getLanguage() === "de" 
        ? `rechnungen-export.${format}` 
        : `invoices-export.${format}`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: t("history.exportSuccess"),
        description: t("history.exportSuccessDescription"),
      });
    },
    onError: () => {
      toast({
        title: t("history.exportError"),
        description: t("history.exportErrorDescription"),
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
            {t("history.status.completed")}
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
            <Clock className="h-3 w-3" />
            {t("history.status.processing")}
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3" />
            {t("history.status.error")}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {t("history.title")}
          </h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            {t("history.description")}
          </p>
        </div>
        {invoices.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => exportMutation.mutate("csv")}
              disabled={exportMutation.isPending}
              data-testid="button-export-csv"
              className="w-full sm:w-auto"
            >
              {exportMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t("history.exportCSV")}
            </Button>
            <Button
              variant="outline"
              onClick={() => exportMutation.mutate("json")}
              disabled={exportMutation.isPending}
              data-testid="button-export-json"
              className="w-full sm:w-auto"
            >
              {exportMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t("history.exportJSON")}
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
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-8 md:py-12 px-4">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <FileText className="h-12 w-12 md:h-16 md:w-16 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-center">{t("history.noInvoices")}</h3>
            <p className="text-sm md:text-base text-muted-foreground text-center max-w-md mb-6">
              {t("history.noInvoicesDescription")}
            </p>
            <Link href="/">
              <Button data-testid="button-goto-upload" size="lg" className="w-full sm:w-auto">
                {t("upload.title")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover-elevate" data-testid={`card-invoice-${invoice.id}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
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
                        <h3 className="font-semibold text-base md:text-lg mb-1 truncate" data-testid={`text-invoice-number-${invoice.id}`}>
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
                      {invoice.invoiceDate && (
                        <div>
                          <p className="text-xs text-muted-foreground">{t("history.date")}</p>
                          <p className="text-sm font-medium">{invoice.invoiceDate}</p>
                        </div>
                      )}
                      {invoice.totalAmount && (
                        <div>
                          <p className="text-xs text-muted-foreground">{t("history.total")}</p>
                          <p className="text-sm font-medium tabular-nums">
                            {parseFloat(invoice.totalAmount).toLocaleString(i18n.getLanguage() === "en" ? "en-US" : "de-DE", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>
                      )}
                      {invoice.vatAmount && (
                        <div>
                          <p className="text-xs text-muted-foreground">{t("invoice.vatAmount")}</p>
                          <p className="text-sm font-medium tabular-nums">
                            {parseFloat(invoice.vatAmount).toLocaleString(i18n.getLanguage() === "en" ? "en-US" : "de-DE", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </p>
                        </div>
                      )}
                      {invoice.vatRate && (
                        <div>
                          <p className="text-xs text-muted-foreground">{t("invoice.vatRate")}</p>
                          <p className="text-sm font-medium">{invoice.vatRate}%</p>
                        </div>
                      )}
                    </div>

                    {invoice.status === "processing" && (
                      <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-yellow-600 dark:text-yellow-400" />
                          <p className="text-sm text-yellow-800 dark:text-yellow-400">
                            {t("invoice.loading")}
                          </p>
                        </div>
                      </div>
                    )}

                    {invoice.status === "error" && invoice.errorMessage && (
                      <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">{invoice.errorMessage}</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/invoice/${invoice.id}`} className="flex-1">
                        <Button variant="outline" size="sm" data-testid={`button-view-${invoice.id}`} className="w-full sm:w-auto">
                          <Eye className="h-4 w-4" />
                          {t("history.view")}
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(invoice.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${invoice.id}`}
                        className="w-full sm:w-auto sm:flex-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("history.delete")}
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
