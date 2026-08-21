import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GarageForm from './GarageForm';
import GarageInvoicePreview from './GarageInvoicePreview';
import './PrintStyles.css';

const defaultBill = {
  company: {
    name: '', logo: '', address: '', phone: '', email: '', website: ''
  },
  invoice: {
    number: '', date: new Date().toISOString().slice(0,10), dueDate: '',
  },
  customer: {
    name: '', address: ''
  },
  vehicle: {
    regNo: '', make: '', model: '', mileage: ''
  },
  items: [
    { description: '', quantity: '', unitPrice: '', tax: '', total: '' }
  ],
  totals: {
    subtotal: 0, tax: 0, discount: 0, total: 0, paid: 0, due: 0
  },
  payment: {
    bank: '', account: '', ifsc: '', upi: '', notes: '', terms: ''
  }
};

export default function GarageBillPage() {
  const [bill, setBill] = useState(defaultBill);

  useEffect(() => {
    if (!bill.invoice.number) {
      const today = new Date();
      const dateStr = today.toISOString().slice(0,10).replace(/-/g, '');
      const rand = Math.floor(1000 + Math.random() * 9000);
      const invoiceNum = `INV${dateStr}${rand}`;
      setBill(prev => ({
        ...prev,
        invoice: { ...prev.invoice, number: invoiceNum }
      }));
    }
  }, [bill.invoice.number]);

  return (
    <motion.div
      className="min-h-screen bg-dark py-6 px-2 md:px-0"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h1 className="mt-8 md:mt-12 text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-white"
        style={{
          textShadow: '0 2px 16px rgba(0,0,0,0.18)',
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          fontWeight: 300
        }}
      >Garage Bill Generator</h1>
      <div className="max-w-5xl mx-auto bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <GarageForm bill={bill} setBill={setBill} />
        </div>
        <div className="w-full md:w-1/2">
          <GarageInvoicePreview bill={bill} />
        </div>
      </div>
      {/* Documentation / Info Section */}
    <div className="gbdoc-container">
      <div className="gbdoc-header">
        <h1>🛠️ Garage Bill Generator</h1>
        <p className="gbdoc-subtitle">Professional Invoicing Tool for Auto Service Centers</p>
      </div>
      <div className="gbdoc-section">
        <h2>Overview</h2>
        <p>The <strong>Garage Bill Generator</strong> is a professional invoicing tool designed specifically for auto service centers, car repair shops, and vehicle maintenance providers. It streamlines the billing process by helping you create branded and itemized invoices that include customer details, vehicle information, services/items, taxes, and payment details — all formatted in a clean, printable layout.</p>
        <p>Whether you're running a small garage or managing a full-service auto center, this tool provides a fast, simple way to produce reliable and professional bills that enhance your business image and improve customer satisfaction.</p>
      </div>
      <div className="gbdoc-section">
        <h2>🧰 Key Features</h2>
        <div className="gbdoc-features-grid">
          <div className="gbdoc-feature-item"><h4>🧾 Professional Invoice Generation</h4><p>Create detailed service invoices with comprehensive itemization and professional formatting.</p></div>
          <div className="gbdoc-feature-item"><h4>🏷️ Custom Branding</h4><p>Add your garage logo and branding elements to create a consistent professional image.</p></div>
          <div className="gbdoc-feature-item"><h4>🚗 Vehicle Information</h4><p>Include detailed vehicle information including type, model, and mileage for accurate record-keeping.</p></div>
          <div className="gbdoc-feature-item"><h4>🧍 Customer Management</h4><p>Comprehensive customer and invoice management fields for complete transaction records.</p></div>
          <div className="gbdoc-feature-item"><h4>➕ Multi-Item Support</h4><p>Add multiple services and items with individual tax calculations for accurate billing.</p></div>
          <div className="gbdoc-feature-item"><h4>🏦 Payment Integration</h4><p>Include payment details with bank information, UPI, and account details for easy transactions.</p></div>
          <div className="gbdoc-feature-item"><h4>💬 Custom Notes</h4><p>Add custom notes and terms &amp; conditions to provide additional information and legal clarity.</p></div>
          <div className="gbdoc-feature-item"><h4>📅 Auto-Fill Features</h4><p>Automatic invoice number generation and date filling to streamline the creation process.</p></div>
          <div className="gbdoc-feature-item"><h4>🧾 PDF Export</h4><p>Download invoices as PDF for printing, emailing, or digital record-keeping.</p></div>
          <div className="gbdoc-feature-item"><h4>🖼️ Template Selection</h4><p>Choose from three clean, professional invoice templates to match your business style.</p></div>
        </div>
      </div>
      <div className="gbdoc-section">
        <h2>📄 How to Use the Garage Bill Generator</h2>
        <div className="gbdoc-steps">
          <div className="gbdoc-step">
            <h4>🔧 Garage Information</h4>
            <p>Start by filling in your garage or business details to establish your professional identity on the invoice:</p>
            <ul>
              <li><strong>Garage Name:</strong> Your business name as it should appear on invoices</li>
              <li><strong>Logo (optional):</strong> Upload PNG or JPG format logo for branding</li>
              <li><strong>Address:</strong> Complete business address for customer reference</li>
              <li><strong>Contact Information:</strong> Phone number, email, and website for customer communication</li>
            </ul>
          </div>
          <div className="gbdoc-step">
            <h4>🧍 Customer &amp; Invoice Details</h4>
            <p>Enter the essential invoice and customer information:</p>
            <ul>
              <li><strong>Invoice Number:</strong> Auto-filled or customize with your numbering system</li>
              <li><strong>Invoice Date:</strong> Auto-filled with today's date or manually adjust</li>
              <li><strong>Due Date:</strong> Optional field for payment deadline</li>
              <li><strong>Customer Name:</strong> Full name of the customer</li>
              <li><strong>Customer Address:</strong> Complete customer address for billing purposes</li>
            </ul>
          </div>
          <div className="gbdoc-step">
            <h4>🚙 Vehicle Information</h4>
            <p>Document the vehicle details for service tracking and warranty purposes:</p>
            <ul>
              <li><strong>Registration Number:</strong> Vehicle license plate number</li>
              <li><strong>Vehicle Type:</strong> Category such as Sedan, SUV, Truck, Motorcycle</li>
              <li><strong>Model:</strong> Specific vehicle model (e.g., Toyota Fortuner, Honda Civic)</li>
              <li><strong>Mileage:</strong> Current odometer reading (e.g., 54,000 KM)</li>
            </ul>
          </div>
          <div className="gbdoc-step">
            <h4>🧾 Services &amp; Items</h4>
            <p>Add all services performed and parts used with detailed pricing:</p>
            <ul>
              <li><strong>Description:</strong> Detailed description of service or product</li>
              <li><strong>Quantity:</strong> Number of units or hours</li>
              <li><strong>Unit Price:</strong> Price per unit or hourly rate</li>
              <li><strong>Tax Percentage:</strong> Individual tax rate per item</li>
            </ul>
            <p>The system automatically calculates: <strong>Item Total = (Quantity × Unit Price) + Tax</strong></p>
            <p>Use the <strong>+ Add Item</strong> button to include multiple services or spare parts.</p>
          </div>
          <div className="gbdoc-step">
            <h4>💳 Payment &amp; Additional Information</h4>
            <p>Include payment information and additional details:</p>
            <ul>
              <li><strong>Bank Details:</strong> Bank name and account information</li>
              <li><strong>Account Number:</strong> Bank account number for transfers</li>
              <li><strong>IFSC/SWIFT Code:</strong> Banking codes for transactions</li>
              <li><strong>UPI ID:</strong> Digital payment identifier (optional)</li>
              <li><strong>Notes:</strong> Service reminders (e.g., "Next service due in 6 months")</li>
              <li><strong>Terms &amp; Conditions:</strong> Legal terms (e.g., "Labor charges are non-refundable")</li>
            </ul>
          </div>
          <div className="gbdoc-step">
            <h4>🎨 Template Selection</h4>
            <p>Choose from three professionally designed templates:</p>
            <ul>
              <li><strong>Template 1:</strong> Classic layout with clean lines</li>
              <li><strong>Template 2:</strong> Modern design with enhanced spacing</li>
              <li><strong>Template 3:</strong> Detailed format with comprehensive sections</li>
            </ul>
          </div>
          <div className="gbdoc-step">
            <h4>📤 Generate &amp; Download</h4>
            <p>Complete the process by generating your professional invoice:</p>
            <ul>
              <li>Review all entered information for accuracy</li>
              <li>Click the <strong>"Download PDF"</strong> button</li>
              <li>Save the invoice for sharing, printing, or email attachment</li>
              <li>The PDF is ready for immediate use and archival</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="gbdoc-section">
        <h2>✅ Benefits</h2>
        <div className="gbdoc-benefits">
          <div className="gbdoc-benefit-item"><h4>🚀 Quick Generation</h4><p>Fast and easy invoice creation process</p></div>
          <div className="gbdoc-benefit-item"><h4>🎨 Customizable Branding</h4><p>Personalize with your logo and business identity</p></div>
          <div className="gbdoc-benefit-item"><h4>🔍 Transparent Billing</h4><p>Clear itemization with individual tax calculations</p></div>
          <div className="gbdoc-benefit-item"><h4>💼 Professional Records</h4><p>Ideal for accounting, audit, and customer documentation</p></div>
          <div className="gbdoc-benefit-item"><h4>🖨️ Multi-Format Ready</h4><p>Print-ready, email-friendly, and tax-compliant</p></div>
          <div className="gbdoc-benefit-item"><h4>📱 Universal Compatibility</h4><p>Works on any device with a web browser</p></div>
        </div>
      </div>
      <div className="gbdoc-section">
        <h2>💡 Best Practices</h2>
        <div className="gbdoc-tips">
          <ul>
            <li><strong>Consistent Numbering:</strong> Use systematic invoice numbering (e.g., INV202507147163) for easy tracking and organization</li>
            <li><strong>Accurate Dates:</strong> Always verify invoice and due dates are correct before generating</li>
            <li><strong>Complete Contact Info:</strong> Include email and website for enhanced customer communication</li>
            <li><strong>Clear Payment Terms:</strong> Specify payment amounts and balance due clearly for partial payments</li>
            <li><strong>Professional Signature:</strong> Add handwritten or digital signature after printing when required</li>
            <li><strong>Regular Backups:</strong> Save copies of all invoices for business records and tax purposes</li>
            <li><strong>Service History:</strong> Use notes section to maintain service history and recommendations</li>
          </ul>
        </div>
      </div>
      <div className="gbdoc-section">
        <h2>🔐 Privacy &amp; Security</h2>
        <p>Your data privacy and security are our top priorities. All information entered into the Garage Bill Generator is processed <strong>locally in your browser</strong>. We do not store, upload, track, or have access to any of your personal, business, or financial data.</p>
        <p>Key security features:</p>
        <div className="gbdoc-tips">
          <ul>
            <li><strong>Local Processing:</strong> All data remains on your device throughout the entire process</li>
            <li><strong>No Data Storage:</strong> No information is saved on external servers or databases</li>
            <li><strong>No Tracking:</strong> We do not monitor or collect usage analytics</li>
            <li><strong>Complete Privacy:</strong> Your invoices and customer information are 100% private and secure</li>
          </ul>
        </div>
      </div>
      <div className="gbdoc-cta">
        <h3>📣 Ready to Get Started?</h3>
        <p>Enter your garage details, customer information, and vehicle details. Add your services and parts, then click <strong>Download PDF</strong> to generate your professional invoice instantly.</p>
        <p className="gbdoc-tagline">🧾 <strong>Service with Clarity. Invoice with Confidence.</strong></p>
      </div>
    </div>
    </motion.div>
    
  );
} 