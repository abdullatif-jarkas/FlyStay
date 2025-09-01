import * as XLSX from "xlsx";
import { AdminPayment, AdminPaymentExportData } from "../types/payment";

export class PaymentExportService {
  /**
   * Format date for display in Excel
   */
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Format amount with proper currency formatting
   */
  private formatAmount(amount: number): string {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }

  /**
   * Get booking type name from payable_type
   */
  private getBookingTypeName(type: string): string {
    if (type.includes("Hotel")) return "Hotel Booking";
    if (type.includes("Flight")) return "Flight Booking";
    return "Booking";
  }

  /**
   * Get payment method display name
   */
  private getPaymentMethodName(method: string): string {
    switch (method.toLowerCase()) {
      case "cash":
        return "Cash";
      case "stripe":
        return "Credit Card (Stripe)";
      default:
        return method;
    }
  }

  /**
   * Get payment status display name
   */
  private getPaymentStatusName(status: string): string {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  }

  /**
   * Get verification status display name
   */
  private getVerificationStatus(
    verified: boolean,
    verifierName?: string
  ): string {
    if (verified && verifierName) {
      return `Verified by ${verifierName}`;
    } else if (verified) {
      return "Verified";
    } else {
      return "Not Verified";
    }
  }

  /**
   * Transform AdminPayment data to export format
   */
  private transformPaymentData(
    payments: AdminPayment[]
  ): AdminPaymentExportData[] {
    return payments.map((payment) => ({
      id: payment.id,
      user_name: payment.user?.name || "N/A",
      user_email: payment.user?.email || "N/A",
      booking_type: this.getBookingTypeName(payment.payable_type),
      booking_id: payment.payable_id,
      amount: parseFloat(payment.amount.toString()),
      method: this.getPaymentMethodName(payment.method),
      status: this.getPaymentStatusName(payment.status),
      transaction_id: payment.transaction_id || "N/A",
      verified: this.getVerificationStatus(
        payment.verified,
        payment.verifier?.name
      ),
      verified_by: payment.verifier?.name || "N/A",
      created_at: this.formatDate(payment.created_at),
    }));
  }

  /**
   * Create Excel worksheet with proper formatting
   */
  private createWorksheet(data: AdminPaymentExportData[]): XLSX.WorkSheet {
    // Define column headers
    const headers = [
      "Payment ID",
      "Customer Name",
      "Customer Email",
      "Booking Type",
      "Booking ID",
      "Amount",
      "Payment Method",
      "Status",
      "Transaction ID",
      "Verification Status",
      "Verified By",
      "Created Date",
    ];

    // Create worksheet data with headers
    const worksheetData = [
      headers,
      ...data.map((payment) => [
        payment.id,
        payment.user_name,
        payment.user_email,
        payment.booking_type,
        payment.booking_id,
        this.formatAmount(payment.amount),
        payment.method,
        payment.status,
        payment.transaction_id,
        payment.verified,
        payment.verified_by,
        payment.created_at,
      ]),
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 12 }, // Payment ID
      { wch: 20 }, // Customer Name
      { wch: 25 }, // Customer Email
      { wch: 15 }, // Booking Type
      { wch: 12 }, // Booking ID
      { wch: 12 }, // Amount
      { wch: 18 }, // Payment Method
      { wch: 12 }, // Status
      { wch: 20 }, // Transaction ID
      { wch: 20 }, // Verification Status
      { wch: 15 }, // Verified By
      { wch: 18 }, // Created Date
    ];

    worksheet["!cols"] = columnWidths;

    // Style the header row
    const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    return worksheet;
  }

  /**
   * Generate filename with current date
   */
  private generateFilename(): string {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD format
    return `payments_export_${dateStr}.xlsx`;
  }

  /**
   * Export payments data to Excel file
   */
  public async exportPayments(payments: AdminPayment[]): Promise<void> {
    try {
      if (!payments || payments.length === 0) {
        throw new Error("No payment data available to export");
      }

      // Transform data for export
      const exportData = this.transformPaymentData(payments);

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = this.createWorksheet(exportData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

      // Generate filename
      const filename = this.generateFilename();

      // Write and download file
      XLSX.writeFile(workbook, filename);

      return Promise.resolve();
    } catch (error) {
      console.error("Error exporting payments:", error);
      throw error;
    }
  }

  /**
   * Validate browser support for file download
   */
  private validateBrowserSupport(): boolean {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false;
    }

    // Check for basic File API support
    return !!(
      window.File &&
      window.FileReader &&
      window.FileList &&
      window.Blob
    );
  }

  /**
   * Export payments with additional metadata
   */
  public async exportPaymentsWithMetadata(
    payments: AdminPayment[],
    metadata: {
      totalRecords: number;
      exportedBy: string;
      exportDate: string;
      filters?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      // Validate browser support
      if (!this.validateBrowserSupport()) {
        throw new Error("Your browser does not support file downloads");
      }

      if (!payments || payments.length === 0) {
        throw new Error("No payment data available to export");
      }

      // Transform data for export
      const exportData = this.transformPaymentData(payments);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Create main data worksheet
      const dataWorksheet = this.createWorksheet(exportData);
      XLSX.utils.book_append_sheet(workbook, dataWorksheet, "Payments");

      // Create metadata worksheet
      const metadataData = [
        ["Export Information"],
        [""],
        ["Export Date:", metadata.exportDate],
        ["Exported By:", metadata.exportedBy],
        ["Total Records:", metadata.totalRecords],
        ["Records in Export:", payments.length],
        [""],
        ["Applied Filters:"],
      ];

      // Add filter information if available
      if (metadata.filters) {
        Object.entries(metadata.filters).forEach(([key, value]) => {
          if (value && value !== "") {
            metadataData.push([`${key}:`, value.toString()]);
          }
        });
      }

      const metadataWorksheet = XLSX.utils.aoa_to_sheet(metadataData);
      metadataWorksheet["!cols"] = [{ wch: 20 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(workbook, metadataWorksheet, "Export Info");

      // Generate filename
      const filename = this.generateFilename();

      // Write and download file
      XLSX.writeFile(workbook, filename);

      return Promise.resolve();
    } catch (error) {
      console.error("Error exporting payments with metadata:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentExportService = new PaymentExportService();
export default paymentExportService;
