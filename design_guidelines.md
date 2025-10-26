# Design Guidelines: Rechnungsextraktion

## Design Approach

**Selected Approach:** Design System - Material Design 3  
**Justification:** This is a utility-focused business application requiring efficient data processing, clear information hierarchy, and professional credibility. Material Design 3's elevation system and emphasis on structured data presentation aligns perfectly with invoice management workflows.

**Key Design Principles:**
- Data clarity over decoration
- Efficient task completion workflows
- Professional, trustworthy appearance
- Scannable information architecture

---

## Typography Hierarchy

**Font Stack:** Inter (primary), system-ui (fallback)  
Load via Google Fonts CDN: `Inter:400,500,600,700`

**Text Styles:**
- Page Titles: 32px/2rem, weight 700, tracking tight
- Section Headers: 24px/1.5rem, weight 600
- Card Titles: 18px/1.125rem, weight 600
- Body Text: 16px/1rem, weight 400, line-height 1.5
- Labels/Metadata: 14px/0.875rem, weight 500
- Small Text/Captions: 12px/0.75rem, weight 400
- Data Values (amounts): 20px/1.25rem, weight 600, tabular-nums

---

## Layout System

**Spacing Scale:** Tailwind units of 2, 4, 6, 8, 12, 16, 24  
Common patterns: p-6 for cards, gap-4 for grids, mb-8 for sections

**Grid Structure:**
- Dashboard: 4-column grid for stat cards (grid-cols-1 md:grid-cols-2 xl:grid-cols-4)
- Invoice History: 1-column list with 2-column detail view split
- Max container width: max-w-7xl mx-auto px-6

---

## Core Components

### Navigation Sidebar
- Collapsible with toggle button (w-64 expanded, w-16 collapsed)
- Navigation items with icons from Heroicons (20px)
- Active state: subtle background, left border accent
- Logo area at top (h-16)
- Smooth collapse transition (300ms)

### Dashboard Stat Cards
- 4 cards in responsive grid
- Each card: p-6, rounded-lg, shadow-sm
- Icon (32px) positioned top-left
- Large numeric value (text-3xl, font-bold, tabular-nums)
- Label below (text-sm)
- Subtle hover elevation increase

### File Upload Zone
- Large dropzone area (min-h-64)
- Dashed border (border-2 border-dashed)
- Centered icon (48px upload icon from Heroicons)
- Clear instructional text: "Rechnung hochladen"
- Supported formats displayed: "JPG, PNG, PDF - Max 10MB"
- Drag-over state: border becomes solid

### Sample Invoice Gallery
- Horizontal scrollable row (flex overflow-x-auto)
- 5 sample cards side-by-side (w-48 flex-shrink-0)
- Each shows thumbnail preview (h-32 object-cover)
- Filename below thumbnail
- "Test laden" button at bottom of each card
- gap-4 between cards

### Invoice History Table
- Full-width table with alternating row backgrounds
- Columns: Thumbnail (60px), Invoice #, Date, Supplier, Amount, VAT, Status, Actions
- Sortable column headers with icons
- Row hover state with subtle background
- Action buttons: View, Download, Delete (icon buttons, 24px)
- Pagination controls at bottom (numbered + prev/next)

### Invoice Detail View
- 2-column layout (2/3 preview, 1/3 extracted data)
- Left: Full invoice preview (PDF viewer or image display)
- Right: Extracted data in labeled field groups:
  - Document Info (Invoice #, Date)
  - Supplier Details (Name, Address, VAT ID)
  - Financial Summary (Subtotal, VAT %, VAT Amount, Total)
  - Line Items (table format)
- Each field group in card with p-4, mb-4

### Data Export Controls
- Button group: "CSV exportieren" | "JSON exportieren"
- Positioned top-right of history view
- Icons from Heroicons: DocumentArrowDownIcon

### VAT Validation Indicator
- Inline with VAT number field
- Small badge component (px-2 py-1, rounded-full, text-xs)
- Shows validation status with icon
- Success/Error states

---

## Form Elements

**Input Fields:**
- Standard height: h-12
- Padding: px-4
- Border: border rounded-lg
- Focus: ring-2 offset-0
- Labels: mb-2, font-medium

**Buttons:**
- Primary: h-12, px-6, rounded-lg, font-medium
- Secondary: Same size, outlined variant
- Icon buttons: w-10 h-10, rounded-lg, centered icon
- Disabled state: reduced opacity

**File Input:**
- Hidden native input
- Custom button trigger styled as primary button
- Selected filename display next to button

---

## Data Display Patterns

**Currency Values:**
- Right-aligned in tables
- Tabular numbers font variant
- 2 decimal precision: "€ 1.234,56"
- Bold for totals

**Dates:**
- German format: "25.10.2025"
- Consistent width for alignment

**Status Badges:**
- Small pills (px-3 py-1, rounded-full, text-xs, font-medium)
- States: Processing, Completed, Error

---

## Responsive Behavior

**Mobile (< 768px):**
- Sidebar becomes slide-over overlay
- Stat cards stack (1 column)
- Table becomes card list view
- Detail view stacks (preview on top, data below)

**Tablet (768px - 1024px):**
- Stat cards 2 columns
- Table with horizontal scroll if needed
- Sidebar remains visible but narrower

**Desktop (> 1024px):**
- Full 4-column stat grid
- Sidebar expanded by default
- Detail view 2-column layout
- Full table display

---

## German Language Considerations

**Text Treatment:**
- Längere deutsche Wörter require careful truncation (use text-ellipsis)
- Button labels: Clear action verbs ("Hochladen", "Exportieren", "Löschen")
- Error messages in German with clear instructions
- Date/number formats follow German conventions (DD.MM.YYYY, 1.234,56€)

---

## Icons

**Library:** Heroicons (outline style)  
**Common icons needed:**
- DocumentTextIcon (invoices)
- ArrowUpTrayIcon (upload)
- DocumentArrowDownIcon (download)
- TrashIcon (delete)
- EyeIcon (view)
- CheckCircleIcon (validated)
- XCircleIcon (error)
- Bars3Icon (sidebar toggle)

---

## Images

**Sample Invoice Thumbnails:**
- 3 German JPG invoice images
- 2 German PDF invoice previews (first page thumbnail)
- Display as 240x320px previews in gallery
- Actual files stored in `/public/samples/` directory
- Names: `rechnung-beispiel-1.jpg`, `rechnung-beispiel-2.jpg`, `rechnung-beispiel-3.jpg`, `rechnung-beispiel-4.pdf`, `rechnung-beispiel-5.pdf`

**Placeholder States:**
- Empty state illustration for no invoices (400x300px centered)
- Upload zone icon (illustrative representation of document)

No large hero image needed - this is a functional dashboard application.