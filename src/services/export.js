import { jsPDF } from 'jspdf';
import { formatInr, formatInrShorthand } from '../lib/currency.js';
import { formatDimension } from '../lib/units.js';
import { CostingServiceInstance } from './costing.js';
import { BoqServiceInstance } from './boq.js';

/**
 * Client-Side PDF & Drawing Export Service
 * Strictly adheres to PRD §23 and Spec §Export service.
 */

class ExportService {
  /**
   * Generates a multi-page client-ready Concept PDF summary
   * @param {{ project: object }} input 
   * @returns {jsPDF}
   */
  generatePdf({ project }) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const plan = project.design || { plot: project.plot, floors: [] };
    const req = project.requirements || {};
    const plot = project.plot || {};
    const estimate = CostingServiceInstance.calculateEstimate({ plan, requirements: req });
    const boqItems = BoqServiceInstance.generateBoq({ plan, requirements: req });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 18;

    // --- Header Banner ---
    doc.setFillColor(192, 133, 82); // User Primary #C08552
    doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('PLANOVA — AI HOME DESIGN COPILOT', margin + 6, y + 9);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('India-Centric Residential Architectural Concept Summary', margin + 6, y + 16);

    y += 30;

    // --- Project Meta Table ---
    doc.setTextColor(30, 38, 31);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(project.name || 'Sharma Residence', margin, y);

    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Location: ${project.location || 'Bhopal, MP'}   |   Client: ${project.clientName || 'Dr. Anand Sharma'}   |   Date: ${new Date().toLocaleDateString('en-IN')}`, margin, y);

    y += 8;
    doc.setDrawColor(220, 210, 195);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // --- Plot & Brief Specifications ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. Plot & Residential Brief Specifications', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const plotSpecs = [
      `Plot Dimensions: ${plot.width || 30} x ${plot.length || 50} ft (${(plot.width || 30) * (plot.length || 50)} sq.ft)`,
      `Configuration: ${req.bhk || 3} BHK (${plot.floors === 1 ? 'Ground Only' : `G+${(plot.floors || 2) - 1}`})`,
      `Facing / Road: ${plot.facing || 'North'} Facing / ${plot.roadSide || 'North'} Road`,
      `Vastu Preference: ${(req.vastu || 'Basic').toUpperCase()} (Directional zoning applied)`,
      `Total Built-up Area: ~${estimate.builtUpAreaSqFt} sq.ft`,
      `Client Target Budget: ${formatInr(req.budgetInr || 3500000)}`,
    ];

    plotSpecs.forEach((spec, idx) => {
      const col = idx % 2 === 0 ? margin : margin + 90;
      const rowY = y + Math.floor(idx / 2) * 5;
      doc.text(`• ${spec}`, col, rowY);
    });

    y += 20;

    // --- Room Schedule ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. Architectural Room Schedule', margin, y);
    y += 6;

    // Table Header
    doc.setFillColor(245, 240, 230);
    doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Room Label', margin + 3, y + 4.2);
    doc.text('Floor Level', margin + 55, y + 4.2);
    doc.text('Dimensions (W x L)', margin + 95, y + 4.2);
    doc.text('Usable Area (sq.ft)', margin + 145, y + 4.2);
    y += 7;

    doc.setFont('helvetica', 'normal');
    const allRooms = [];
    (plan.floors || []).forEach(f => {
      (f.rooms || []).forEach(r => {
        allRooms.push({ ...r, floorName: f.label || `Level ${f.level}` });
      });
    });

    allRooms.slice(0, 10).forEach((rm, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(252, 250, 247);
        doc.rect(margin, y - 0.8, pageWidth - margin * 2, 5, 'F');
      }
      doc.text(rm.label, margin + 3, y + 3);
      doc.text(rm.floorName, margin + 55, y + 3);
      doc.text(`${rm.width}' x ${rm.height}'`, margin + 95, y + 3);
      doc.text(`${Math.round(rm.width * rm.height)} sq.ft`, margin + 145, y + 3);
      y += 5.2;
    });

    y += 6;

    // --- Financial Summary ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('3. Indicative Cost Breakdown', margin, y);
    y += 6;

    doc.setFillColor(245, 240, 230);
    doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Category', margin + 3, y + 4.2);
    doc.text('Allocation', margin + 95, y + 4.2);
    doc.text('Estimated Cost (INR)', margin + 145, y + 4.2);
    y += 7;

    doc.setFont('helvetica', 'normal');
    estimate.breakdown.forEach((cat, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(252, 250, 247);
        doc.rect(margin, y - 0.8, pageWidth - margin * 2, 5, 'F');
      }
      doc.text(cat.label, margin + 3, y + 3);
      doc.text(`${cat.percentage}%`, margin + 95, y + 3);
      doc.text(formatInr(cat.amount), margin + 145, y + 3);
      y += 4.8;
    });

    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Indicative Construction Cost (@ ₹${estimate.ratePerSqFt}/sq.ft): ${formatInr(estimate.totalEstimatedCost)}`, margin + 3, y + 4);
    y += 12;

    // --- Legal & Professional Review Disclaimer ---
    doc.setFillColor(247, 242, 235);
    doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');
    doc.setDrawColor(192, 133, 82);
    doc.rect(margin, y, pageWidth - margin * 2, 22, 'S');

    doc.setTextColor(140, 75, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('MANDATORY CONCEPTUAL DESIGN / PROFESSIONAL REVIEW DISCLAIMER', margin + 4, y + 5);

    doc.setTextColor(60, 70, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(
      'Planova is an AI-assisted architectural copilot for preliminary ideation. All room drawings, spatial coordinates, structural representations, Vastu alignments, and cost/BOQ estimates are indicative approximations and must be vetted by a licensed architect, structural engineer, and local municipal authority prior to construction or financial commitment.',
      margin + 4,
      y + 10,
      { maxWidth: pageWidth - margin * 2 - 8 }
    );

    return doc;
  }

  /**
   * Downloads the generated PDF directly to the browser
   * @param {{ project: object }} input 
   */
  downloadPdf({ project }) {
    const doc = this.generatePdf({ project });
    const filename = `${(project.name || 'Planova-Concept').replace(/\s+/g, '-').toLowerCase()}-summary.pdf`;
    doc.save(filename);
  }
}

export const ExportServiceInstance = new ExportService();
