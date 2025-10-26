import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Invoice } from "@shared/schema";

export default function Dashboard() {
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
      title: "Gesamt Rechnungen",
      value: stats.total,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Abgeschlossen",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "In Bearbeitung",
      value: stats.processing,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Fehler",
      value: stats.errors,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Übersicht Ihrer Rechnungsverarbeitung
        </p>
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover-elevate" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tabular-nums" data-testid={`stat-value-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
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
            <CardTitle>Finanzübersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Gesamtsumme (abgeschlossene Rechnungen)
              </p>
              <p className="text-4xl font-bold tabular-nums" data-testid="text-total-amount">
                {totalAmount.toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {stats.total === 0 && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keine Rechnungen vorhanden</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Laden Sie Ihre erste Rechnung hoch, um mit der automatischen Extraktion zu beginnen.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
