// i18n system for German/English language switching
// Automatically detects language from browser or parent window

type Translations = {
  [key: string]: string | Translations;
};

type TranslationDict = {
  de: Translations;
  en: Translations;
};

const translations: TranslationDict = {
  de: {
    app: {
      title: "Kortex System",
      subtitle: "Rechnungsextraktion",
    },
    nav: {
      upload: "Hochladen",
      dashboard: "Dashboard",
      history: "Historie",
    },
    upload: {
      title: "Rechnung hochladen",
      description: "Laden Sie eine Rechnung hoch oder wählen Sie ein Beispiel",
      dropzoneTitle: "Datei hierher ziehen",
      dropzoneSubtitle: "oder klicken Sie zum Auswählen",
      dropzoneActive: "Hier ablegen...",
      fileUpload: "Datei hochladen",
      fileTypes: "JPG, PNG oder PDF - Maximal 10 MB",
      uploadButton: "Hochladen",
      uploading: "Wird hochgeladen...",
      preview: "Vorschau",
      sampleInvoices: "Beispielrechnungen",
      sampleDescription: "Klicken Sie auf eine Beispielrechnung zum Testen",
      pdfInvoice: "PDF-Rechnung",
      jpgInvoice: "JPG-Rechnung",
      success: "Erfolgreich hochgeladen",
      successDescription: "Die Rechnung wird jetzt verarbeitet.",
      error: "Upload fehlgeschlagen",
      fileTooLarge: "Datei zu groß",
      fileTooLargeDescription: "Die Datei ist {size} MB. Maximum sind 10 MB.",
      invalidType: "Falsches Dateiformat",
      invalidTypeDescription: "Bitte laden Sie nur JPG, PNG oder PDF Dateien hoch.",
      sampleLoaded: "Beispielrechnung geladen",
      sampleLoadedDescription: "Klicken Sie auf 'Hochladen', um fortzufahren.",
      sampleError: "Fehler",
      sampleErrorDescription: "Beispielrechnung konnte nicht geladen werden.",
    },
    dashboard: {
      title: "Dashboard",
      description: "Übersicht Ihrer Rechnungsverarbeitung",
      totalInvoices: "Gesamt Rechnungen",
      completed: "Abgeschlossen",
      processing: "In Bearbeitung",
      errors: "Fehler",
      financialOverview: "Finanzübersicht",
      totalAmount: "Gesamtsumme (abgeschlossene Rechnungen)",
      noInvoices: "Keine Rechnungen vorhanden",
      noInvoicesDescription: "Laden Sie Ihre erste Rechnung hoch, um mit der automatischen Extraktion zu beginnen.",
      deleteAll: "Alle löschen",
      deleteAllConfirm: "Alle Rechnungen löschen?",
      deleteAllDescription: "Möchten Sie wirklich alle {count} Rechnung(en) löschen? Diese Aktion kann nicht rückgängig gemacht werden. Die Rechnungen werden automatisch nach 30 Minuten gelöscht, um Ihre Privatsphäre zu schützen.",
      deleting: "Lösche...",
      deleteSuccess: "Alle Rechnungen gelöscht",
      deleteSuccessDescription: "{count} Rechnung(en) wurden erfolgreich gelöscht.",
      deleteError: "Fehler",
      deleteErrorDescription: "Rechnungen konnten nicht gelöscht werden.",
      cancel: "Abbrechen",
    },
    history: {
      title: "Historie",
      description: "Alle verarbeiteten Rechnungen",
      status: {
        completed: "Abgeschlossen",
        processing: "Verarbeitung",
        error: "Fehler",
      },
      noInvoices: "Keine Rechnungen vorhanden",
      noInvoicesDescription: "Laden Sie Ihre erste Rechnung hoch.",
      view: "Ansehen",
      delete: "Löschen",
      deleted: "Gelöscht",
      deletedDescription: "Rechnung wurde erfolgreich gelöscht.",
      deleteError: "Fehler",
      deleteErrorDescription: "Rechnung konnte nicht gelöscht werden.",
      export: "Exportieren",
      exportCSV: "CSV exportieren",
      exportJSON: "JSON exportieren",
      exportSuccess: "Exportiert",
      exportSuccessDescription: "Daten wurden erfolgreich exportiert.",
      exportError: "Fehler",
      exportErrorDescription: "Export fehlgeschlagen.",
      invoiceNumber: "Rechnungsnummer",
      date: "Datum",
      supplier: "Lieferant",
      total: "Gesamtbetrag",
      actions: "Aktionen",
      language: "de",
    },
    invoice: {
      title: "Rechnungsdetails",
      loading: "Wird verarbeitet...",
      error: "Fehler beim Laden",
      errorDescription: "Rechnung konnte nicht geladen werden.",
      invoiceNumber: "Rechnungsnummer",
      invoiceDate: "Rechnungsdatum",
      supplierName: "Lieferant",
      supplierAddress: "Lieferantenadresse",
      supplierVatId: "USt-ID",
      subtotal: "Zwischensumme",
      vatRate: "MwSt-Satz",
      vatAmount: "MwSt-Betrag",
      totalAmount: "Gesamtbetrag",
      lineItems: "Positionen",
      description: "Beschreibung",
      quantity: "Menge",
      unitPrice: "Einzelpreis",
      total: "Gesamt",
      status: "Status",
      download: "Herunterladen",
      back: "Zurück",
    },
    common: {
      cancel: "Abbrechen",
      confirm: "Bestätigen",
      delete: "Löschen",
      close: "Schließen",
      save: "Speichern",
      loading: "Wird geladen...",
      error: "Fehler",
      success: "Erfolgreich",
    },
  },
  en: {
    app: {
      title: "Kortex System",
      subtitle: "Invoice Extraction",
    },
    nav: {
      upload: "Upload",
      dashboard: "Dashboard",
      history: "History",
    },
    upload: {
      title: "Upload Invoice",
      description: "Upload an invoice or select a sample",
      dropzoneTitle: "Drag file here",
      dropzoneSubtitle: "or click to select",
      dropzoneActive: "Drop here...",
      fileUpload: "File Upload",
      fileTypes: "JPG, PNG or PDF - Maximum 10 MB",
      uploadButton: "Upload",
      uploading: "Uploading...",
      preview: "Preview",
      sampleInvoices: "Sample Invoices",
      sampleDescription: "Click on a sample invoice to test",
      pdfInvoice: "PDF Invoice",
      jpgInvoice: "JPG Invoice",
      success: "Upload Successful",
      successDescription: "The invoice is now being processed.",
      error: "Upload Failed",
      fileTooLarge: "File Too Large",
      fileTooLargeDescription: "The file is {size} MB. Maximum is 10 MB.",
      invalidType: "Invalid File Format",
      invalidTypeDescription: "Please upload only JPG, PNG or PDF files.",
      sampleLoaded: "Sample Loaded",
      sampleLoadedDescription: "Click 'Upload' to continue.",
      sampleError: "Error",
      sampleErrorDescription: "Sample invoice could not be loaded.",
    },
    dashboard: {
      title: "Dashboard",
      description: "Overview of your invoice processing",
      totalInvoices: "Total Invoices",
      completed: "Completed",
      processing: "Processing",
      errors: "Errors",
      financialOverview: "Financial Overview",
      totalAmount: "Total Amount (completed invoices)",
      noInvoices: "No Invoices",
      noInvoicesDescription: "Upload your first invoice to start automatic extraction.",
      deleteAll: "Delete All",
      deleteAllConfirm: "Delete All Invoices?",
      deleteAllDescription: "Are you sure you want to delete all {count} invoice(s)? This action cannot be undone. Invoices are automatically deleted after 30 minutes to protect your privacy.",
      deleting: "Deleting...",
      deleteSuccess: "All Invoices Deleted",
      deleteSuccessDescription: "{count} invoice(s) were successfully deleted.",
      deleteError: "Error",
      deleteErrorDescription: "Invoices could not be deleted.",
      cancel: "Cancel",
    },
    history: {
      title: "History",
      description: "All processed invoices",
      status: {
        completed: "Completed",
        processing: "Processing",
        error: "Error",
      },
      noInvoices: "No Invoices",
      noInvoicesDescription: "Upload your first invoice.",
      view: "View",
      delete: "Delete",
      deleted: "Deleted",
      deletedDescription: "Invoice was successfully deleted.",
      deleteError: "Error",
      deleteErrorDescription: "Invoice could not be deleted.",
      export: "Export",
      exportCSV: "Export CSV",
      exportJSON: "Export JSON",
      exportSuccess: "Exported",
      exportSuccessDescription: "Data was successfully exported.",
      exportError: "Error",
      exportErrorDescription: "Export failed.",
      invoiceNumber: "Invoice Number",
      date: "Date",
      supplier: "Supplier",
      total: "Total Amount",
      actions: "Actions",
      language: "en",
    },
    invoice: {
      title: "Invoice Details",
      loading: "Processing...",
      error: "Error Loading",
      errorDescription: "Invoice could not be loaded.",
      invoiceNumber: "Invoice Number",
      invoiceDate: "Invoice Date",
      supplierName: "Supplier",
      supplierAddress: "Supplier Address",
      supplierVatId: "VAT ID",
      subtotal: "Subtotal",
      vatRate: "VAT Rate",
      vatAmount: "VAT Amount",
      totalAmount: "Total Amount",
      lineItems: "Line Items",
      description: "Description",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      total: "Total",
      status: "Status",
      download: "Download",
      back: "Back",
    },
    common: {
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      close: "Close",
      save: "Save",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
  },
};

type Language = "de" | "en";

class I18n {
  private currentLanguage: Language = "de";

  constructor() {
    this.detectLanguage();
  }

  detectLanguage(): void {
    // Method 1: Check URL parameter (highest priority for webhook integration)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    if (langParam && (langParam === "de" || langParam === "en")) {
      this.currentLanguage = langParam as Language;
      // Save to localStorage for consistency
      localStorage.setItem("language", this.currentLanguage);
      document.documentElement.lang = this.currentLanguage;
      document.documentElement.setAttribute("data-lang", this.currentLanguage);
      return; // Early return if URL param found
    }

    // Method 2: Check parent window (for iframe integration)
    try {
      if (window.parent !== window) {
        // Check if parent has language info
        const parentLang = window.parent.document.documentElement.lang || 
                          window.parent.document.documentElement.getAttribute("data-lang") ||
                          window.parent.navigator.language;
        const detectedLang = this.parseLanguage(parentLang);
        if (detectedLang) {
          this.currentLanguage = detectedLang;
        }
      }
    } catch (e) {
      // Cross-origin, can't access parent
    }

    // Method 3: Check localStorage
    const storedLang = localStorage.getItem("language");
    if (storedLang === "de" || storedLang === "en") {
      this.currentLanguage = storedLang as Language;
    }

    // Method 4: Check browser language (fallback)
    if (!storedLang && !langParam) {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      this.currentLanguage = this.parseLanguage(browserLang);
    }

    // Apply language to HTML
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.setAttribute("data-lang", this.currentLanguage);
  }

  private parseLanguage(lang: string | null | undefined): Language {
    if (!lang) return "de";
    const normalized = lang.toLowerCase().split("-")[0];
    return normalized === "en" ? "en" : "de";
  }

  setLanguage(lang: Language): void {
    this.currentLanguage = lang;
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".");
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to German if key not found
        let fallback: any = translations.de;
        for (const fk of keys) {
          fallback = fallback?.[fk];
          if (fallback === undefined) {
            return key; // Return key if not found in fallback either
          }
        }
        value = fallback;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  }
}

export const i18n = new I18n();

// React hook for translations (exported separately to avoid React dependency)
export function createTranslationHook() {
  // This will be used in a React hook file
  return null;
}

// For non-React usage
export default i18n;

