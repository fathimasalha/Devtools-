import React, { useState, useRef } from 'react';
import RentReceiptForm from './RentReceiptForm';
import ReceiptPreview from './ReceiptPreview';
import './RentReceipt.css';
import { Download as DownloadIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const initialForm = {
  landlord: '',
  tenant: '',
  address: '',
  rentAmount: '',
  rentMonth: '',
  paymentMode: '',
  pan: '',
  receiptDate: new Date().toISOString().slice(0, 10),
  periodFrom: '',
  periodTo: '',
};

const RentReceiptPage = () => {
  const [form, setForm] = useState(initialForm);
  const [template, setTemplate] = useState(1);
  const previewRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const input = previewRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    // Calculate image dimensions to fit A4
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save('rent-receipt.pdf');
  };

  return (
    <div className="rent-receipt-page min-h-screen bg-black py-8 px-2 md:px-0">
      <h1 className="mt-8 md:mt-12 text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-white"
        style={{
          textShadow: '0 2px 16px rgba(0,0,0,0.18)',
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          fontWeight: 300
        }}
      >Rent Receipt Generator</h1>
      <div className="max-w-5xl mx-auto bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
        <RentReceiptForm form={form} setForm={setForm} />
        <div className="flex-1 flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            <button type="button" className={`px-4 py-2 rounded font-semibold border ${template === 1 ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-400'}`} onClick={() => setTemplate(1)}>1</button>
            <button type="button" className={`px-4 py-2 rounded font-semibold border ${template === 2 ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-400'}`} onClick={() => setTemplate(2)}>2</button>
          </div>
          <div ref={previewRef} className="w-full flex flex-col items-center">
            <ReceiptPreview form={form} template={template} />
          </div>
          <button onClick={handleDownloadPDF} className="mt-4 flex items-center gap-2 bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800 transition">
            <DownloadIcon size={18} /> Download as PDF
          </button>
        </div>
      </div>
      {/* Documentation / Info Section */}
      <div className="rrdoc-container">
        <div className="rrdoc-header">
          <h1>🏠 Rent Receipt Generator</h1>
          <p className="rrdoc-subtitle">Professional Documentation &amp; User Guide</p>
        </div>
        <div className="rrdoc-section">
          <h2>📋 What is a Rent Receipt?</h2>
          <div className="rrdoc-highlight">
            <p>A <strong>Rent Receipt</strong> is a legal document provided by the <strong>landlord</strong> to the <strong>tenant</strong> confirming that the tenant has paid the rent for a specific period.</p>
          </div>
          <p>This receipt serves multiple important purposes:</p>
          <div className="rrdoc-benefits">
            <div className="rrdoc-benefit"><span className="icon">✅</span><strong>Proof of Payment</strong><p>Legal evidence for both parties</p></div>
            <div className="rrdoc-benefit"><span className="icon">💰</span><strong>HRA Claims</strong><p>Essential for tax exemptions</p></div>
            <div className="rrdoc-benefit"><span className="icon">📊</span><strong>Record Keeping</strong><p>Transparent transaction history</p></div>
          </div>
          <p>Our <strong>Rent Receipt Generator</strong> allows you to create professional, printable rent receipts in seconds — with all necessary legal and tax-related information.</p>
        </div>
        <div className="rrdoc-divider"></div>
        <div className="rrdoc-section">
          <h2>🔧 Key Features</h2>
          <div className="rrdoc-features-grid">
            <div className="rrdoc-feature-item"><strong>✍️ Complete Information Entry</strong><p>Fill in Landlord, Tenant, and Property Address details</p></div>
            <div className="rrdoc-feature-item"><strong>💰 Financial Details</strong><p>Specify Rent Amount, Month, and Rent Period</p></div>
            <div className="rrdoc-feature-item"><strong>📆 Date Management</strong><p>Choose Receipt Date and rental periods</p></div>
            <div className="rrdoc-feature-item"><strong>💳 Payment Options</strong><p>Multiple payment modes supported</p></div>
            <div className="rrdoc-feature-item"><strong>🆔 Tax Compliance</strong><p>Optional PAN Number for HRA claims</p></div>
            <div className="rrdoc-feature-item"><strong>📤 Instant Download</strong><p>Auto-generates formatted PDF receipts</p></div>
          </div>
        </div>
        <div className="rrdoc-divider"></div>
        <div className="rrdoc-section">
          <h2>📝 How to Use</h2>
          <div className="rrdoc-steps">
            <div className="rrdoc-step"><h4>Enter Landlord Name</h4><p>This is the full legal name of the property owner who is receiving rent.</p></div>
            <div className="rrdoc-step"><h4>Enter Tenant Name</h4><p>This is the name of the person paying the rent.</p></div>
            <div className="rrdoc-step"><h4>Enter Property Address</h4><p>The address of the rented property should be complete and accurate.</p></div>
            <div className="rrdoc-step"><h4>Enter Rent Amount</h4><p>The amount paid by the tenant for the specific month.</p></div>
            <div className="rrdoc-step"><h4>Select Rent Month</h4><p>Choose the actual month for which rent is paid (e.g., July 2025).</p></div>
            <div className="rrdoc-step"><h4>Choose Payment Mode</h4><p>Select how the payment was made from available options:</p>
              <div className="rrdoc-payment-modes">
                <span className="rrdoc-payment-mode">Cash</span>
                <span className="rrdoc-payment-mode">UPI</span>
                <span className="rrdoc-payment-mode">Bank Transfer</span>
                <span className="rrdoc-payment-mode">Cheque</span>
                <span className="rrdoc-payment-mode">Others</span>
              </div>
            </div>
            <div className="rrdoc-step"><h4>Enter PAN Number (Optional)</h4><p>Landlord's PAN number is necessary for tenants who wish to claim tax exemption under HRA.</p></div>
            <div className="rrdoc-step"><h4>Choose Receipt Date</h4><p>The date when the rent was received (auto-filled as today's date by default).</p></div>
            <div className="rrdoc-step"><h4>Select Rent Period (From/To)</h4><p>This defines the exact dates the rent covers (e.g., 01/07/2025 to 31/07/2025).</p></div>
            <div className="rrdoc-step"><h4>Click Generate</h4><p>The rent receipt preview will update with your inputs.</p></div>
            <div className="rrdoc-step"><h4>Download as PDF</h4><p>Click the "Download PDF" button to save the rent receipt in a ready-to-print format.</p></div>
          </div>
        </div>
        <div className="rrdoc-divider"></div>
        <div className="rrdoc-section">
          <h2>✅ Benefits of Using This Tool</h2>
          <div className="rrdoc-benefits">
            <div className="rrdoc-benefit"><span className="icon">🔒</span><strong>Secure &amp; Private</strong><p>All data stays in your browser</p></div>
            <div className="rrdoc-benefit"><span className="icon">🖨️</span><strong>Ready-to-Print</strong><p>Professional formatted receipts</p></div>
            <div className="rrdoc-benefit"><span className="icon">📥</span><strong>Instant Download</strong><p>PDF format for easy sharing</p></div>
            <div className="rrdoc-benefit"><span className="icon">🧾</span><strong>Legal Compliance</strong><p>Suitable for tax purposes</p></div>
            <div className="rrdoc-benefit"><span className="icon">🎯</span><strong>Standardized Format</strong><p>Accurate and consistent</p></div>
          </div>
        </div>
        <div className="rrdoc-divider"></div>
        <div className="rrdoc-section">
          <h2>💡 Pro Tips</h2>
          <div className="rrdoc-tips">
            <div className="rrdoc-tip">Always enter accurate dates and amount for tax validity.</div>
            <div className="rrdoc-tip">For HRA claims, PAN of the landlord is mandatory if rent &gt; ₹1,00,000/year.</div>
            <div className="rrdoc-tip">Generate multiple receipts for different months using the same form.</div>
            <div className="rrdoc-tip">Add your physical signature after printing if needed for offline submission.</div>
          </div>
        </div>
        <div className="rrdoc-cta">
          <h3>📣 Ready to Generate Your Receipt?</h3>
          <p>Fill in the details above, preview your receipt, and click <strong>Download PDF</strong> to generate your rent receipt instantly.</p>
          <div className="rrdoc-divider"></div>
          <p className="rrdoc-cta-tagline">
            🧾 <strong>Smart. Simple. Secure.</strong><br />
            <em>Generate your rent receipt in seconds.</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RentReceiptPage; 