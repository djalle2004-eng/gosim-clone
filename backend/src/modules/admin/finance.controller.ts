import { Request, Response } from 'express';
import { FinanceService } from '../../services/financeService';
import { CommissionService } from '../../services/commissionService';
import { TaxService } from '../../services/taxService';
import { InvoiceService } from '../../services/invoiceService';

export class FinanceController {
  // --- Finance Summary ---
  static async getSummary(req: Request, res: Response) {
    try {
      const summary = await FinanceService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getRevenue(req: Request, res: Response) {
    try {
      const period = req.query.period === 'monthly' ? 'monthly' : 'daily';
      const revenue = await FinanceService.getRevenue(period);
      res.json({ success: true, data: revenue });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getLTV(req: Request, res: Response) {
    try {
      const ltv = await FinanceService.getLTV();
      res.json({ success: true, data: ltv });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCohorts(req: Request, res: Response) {
    try {
      const cohorts = await FinanceService.getCohorts();
      res.json({ success: true, data: cohorts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- Commissions ---
  static async getPendingCommissions(req: Request, res: Response) {
    try {
      const pending = await CommissionService.getPendingCommissions();
      res.json({ success: true, data: pending });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async processPayout(req: Request, res: Response) {
    try {
      const { referralIds, method } = req.body;
      const result = await CommissionService.processPayout(referralIds, method);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // --- Tax ---
  static async getTaxReport(req: Request, res: Response) {
    try {
      const report = await TaxService.getMonthlyTaxReport();
      res.json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // --- Invoice ---
  static async downloadInvoice(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const pdfBytes = await InvoiceService.generateInvoice(orderId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
      res.send(Buffer.from(pdfBytes));
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
