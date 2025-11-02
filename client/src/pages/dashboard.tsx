import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, CheckCircle, Clock, AlertCircle, Trash2, Upload as UploadIcon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { i18n } from "@/lib/i18n";
import type { Invoice } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  
  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices"],
  });

  const stats = {
    total: invoices.length,
    completed: invoices.filter((inv) => inv.status === "completed").length,
    processing: invoices.filter((inv) => inv.status === "processing").length,
    errors: invoices.filter((inv) => inv.status === "error").length,
  };

  const totalAmount = invoices
    .filter((inv) => inv.totalAmount && inv.status === "completed")
    .reduce((sum, inv) => sum + parseFloat(inv.totalAmount || "0"), 0);

  const statCards = [
    {
      title: t("dashboard.totalInvoices"),
      value: stats.total,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t("dashboard.completed"),
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: t("dashboard.processing"),
      value: stats.processing,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: t("dashboard.errors"),
      value: stats.errors,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/invoices");
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({
        title: t("dashboard.deleteSuccess"),
        description: t("dashboard.deleteSuccessDescription", { count: data.deletedCount || stats.total }),
      });
    },
    onError: () => {
      toast({
        title: t("dashboard.deleteError"),
        description: t("dashboard.deleteErrorDescription"),
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Simplified Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            {t("dashboard.description")}
          </p>
        </div>
        <div className="flex gap-2">
          {stats.total === 0 && (
            <Button onClick={() => setLocation("/")} className="w-full sm:w-auto">
              <UploadIcon className="h-4 w-4 mr-2" />
              {t("upload.title")}
            </Button>
          )}
          {stats.total > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("dashboard.deleteAll")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("dashboard.deleteAllConfirm")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("dashboard.deleteAllDescription", { count: stats.total })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("dashboard.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteAllMutation.mutate()}
                    disabled={deleteAllMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteAllMutation.isPending ? t("dashboard.deleting") : t("dashboard.deleteAll")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover-elevate" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-1.5 md:p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold tabular-nums" data-testid={`stat-value-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {stats.completed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.financialOverview")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.totalAmount")}
              </p>
              <p className="text-3xl md:text-4xl font-bold tabular-nums" data-testid="text-total-amount">
                {totalAmount.toLocaleString(i18n.getLanguage() === "en" ? "en-US" : "de-DE", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.total === 0 && !isLoading && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-8 md:py-12 px-4">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <FileText className="h-12 w-12 md:h-16 md:w-16 text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-center">{t("dashboard.noInvoices")}</h3>
            <p className="text-sm md:text-base text-muted-foreground text-center max-w-md mb-6">
              {t("dashboard.noInvoicesDescription")}
            </p>
            <Button onClick={() => setLocation("/")} size="lg" className="w-full sm:w-auto">
              <UploadIcon className="h-4 w-4 mr-2" />
              {t("upload.title")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
