import React, { useState, useRef } from "react";
import "./FuelBillGenerator.css";
import BillPreviewTemplate1 from "./templates/BillPreviewTemplate1";
import BillPreviewTemplate2 from "./templates/BillPreviewTemplate2";
import BillPreviewTemplate3 from "./templates/BillPreviewTemplate3";
import bpLogo from "./logos/bp.png";
import ioLogo from "./logos/io.png";
import hpLogo from "./logos/hp.png";
import jioLogo from "./logos/jio.png";
import nayaraLogo from "./logos/nayara.png";
import essarLogo from "./logos/essar.png";
import { Download as DownloadIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

const templates = [
  { name: "Template 1", component: BillPreviewTemplate1 },
  { name: "Template 2", component: BillPreviewTemplate2 },
  { name: "Template 3", component: BillPreviewTemplate3 },
];

const initialForm = {
  companyName: "",
  address: "",
  customerName: "",
  vehicleNumber: "",
  fuelType: "",
  pricePerLiter: "",
  quantity: "",
  date: "",
  time: "",
  billNumber: "",
  gstNumber: "",
  phoneNumber: "",
  notes: "",
};

function generateBillNumber() {
  return `FB-${Date.now().toString().slice(-6)}`;
}

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

const priceMap = {
  Petrol: 105.5,
  Diesel: 92.3,
};

// Logo images (Google URLs)
const logoOptions = [
  { label: "Bharat Petroleum", value: "bp", img: bpLogo },
  { label: "Indian Oil", value: "io", img: ioLogo },
  { label: "HP", value: "hp", img: hpLogo },
  { label: "Essar Oil", value: "essar", img: essarLogo },
  { label: "Jio", value: "jio", img: jioLogo },
  { label: "Nayara", value: "nayara", img: nayaraLogo },
];

const FuelBillGenerator = () => {
  const [form, setForm] = useState({
    ...initialForm,
    date: getCurrentDate(),
    time: getCurrentTime(),
    billNumber: generateBillNumber(),
  });
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const previewRef = useRef(null);
  const [selectedLogo, setSelectedLogo] = useState("bp");
  const [logoEnabled, setLogoEnabled] = useState(true);

  // Auto-calculate total
  const total =
    parseFloat(form.pricePerLiter || 0) * parseFloat(form.quantity || 0);

  // Amount in words (simple, optional)
  function numberToWords(num) {
    // Simple version for demo
    if (!num) return "";
    return num.toLocaleString("en-IN", { maximumFractionDigits: 2 }) + " Rupees";
  }

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Auto-fill price per liter
    if (name === "fuelType" && priceMap[value]) {
      setForm((prev) => ({ ...prev, pricePerLiter: priceMap[value] }));
    }
  };

  // Template selection
  const TemplateComponent = templates[selectedTemplate].component;

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    const input = previewRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save('fuel-bill.pdf');
  };

  return (
    <motion.div
      className="fuel-bill-generator-container min-h-screen  py-8 px-2 md:px-0"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <h1 className="mt-8 md:mt-12 text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-white"
        style={{
          textShadow: '0 2px 16px rgba(0,0,0,0.18)',
          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
          fontWeight: 300
        }}
      >Fuel Bill Generator</h1>
      <div className="max-w-5xl mx-auto bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
        {/* Left: Form */}
        <form className="w-full md:w-1/2 space-y-4" autoComplete="off">
          {/* Template Selection */}
          <div className="flex gap-2 mb-2">
            {templates.map((tpl, idx) => (
              <button
                type="button"
                key={tpl.name}
                className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${
                  selectedTemplate === idx
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-green-700 border-green-400 hover:bg-green-50"
                }`}
                onClick={() => setSelectedTemplate(idx)}
              >
                {tpl.name}
              </button>
            ))}
          </div>
          {/* Logo Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Logo</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {logoOptions.map(opt => (
                <label key={opt.value} className={`flex items-center gap-1 px-2 py-1 rounded border cursor-pointer ${selectedLogo === opt.value && logoEnabled ? "border-green-600 bg-green-50" : "border-gray-300 bg-white"}`}>
                  <input
                    type="radio"
                    name="logo"
                    value={opt.value}
                    checked={selectedLogo === opt.value && logoEnabled}
                    onChange={() => { setSelectedLogo(opt.value); setLogoEnabled(true); }}
                    disabled={!logoEnabled}
                  />
                  <img src={opt.img} alt={opt.label} className="w-6 h-6 object-contain" />
                  <span className="text-xs font-medium">{opt.label}</span>
                </label>
              ))}
              <label className={`flex items-center gap-1 px-2 py-1 rounded border cursor-pointer ${!logoEnabled ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}>
                <input
                  type="radio"
                  name="logo"
                  value="none"
                  checked={!logoEnabled}
                  onChange={() => setLogoEnabled(false)}
                />
                <span className="text-xs font-medium text-red-600">Disable Logo</span>
              </label>
            </div>
          </div>
          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="companyName">Company/Outlet Name</label>
            <input type="text" id="companyName" name="companyName" placeholder="Enter company/outlet name" className="w-full input input-bordered" value={form.companyName} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="address">Address</label>
            <input type="text" id="address" name="address" placeholder="Enter address" className="w-full input input-bordered" value={form.address} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="customerName">Customer Name</label>
            <input type="text" id="customerName" name="customerName" placeholder="Enter customer name" className="w-full input input-bordered" value={form.customerName} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="vehicleNumber">Vehicle Number</label>
            <input type="text" id="vehicleNumber" name="vehicleNumber" placeholder="Enter vehicle number" className="w-full input input-bordered" value={form.vehicleNumber} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="fuelType">Fuel Type</label>
            <select id="fuelType" name="fuelType" className="w-full input input-bordered" value={form.fuelType} onChange={handleChange}>
              <option value="">Select fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="pricePerLiter">Price per Liter</label>
            <input type="number" step="0.01" id="pricePerLiter" name="pricePerLiter" placeholder="Enter price per liter" className="w-full input input-bordered" value={form.pricePerLiter} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="quantity">Quantity (Liters)</label>
            <input type="number" step="0.01" id="quantity" name="quantity" placeholder="Enter quantity in liters" className="w-full input input-bordered" value={form.quantity} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1" htmlFor="date">Date</label>
              <input type="date" id="date" name="date" className="w-full input input-bordered" value={form.date} onChange={handleChange} />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1" htmlFor="time">Time</label>
              <input type="time" id="time" name="time" className="w-full input input-bordered" value={form.time} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="billNumber">Bill Number</label>
            <input type="text" id="billNumber" name="billNumber" className="w-full input input-bordered" value={form.billNumber} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="gstNumber">GST Number (optional)</label>
            <input type="text" id="gstNumber" name="gstNumber" placeholder="Enter GST number" className="w-full input input-bordered" value={form.gstNumber} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="phoneNumber">Phone Number (optional)</label>
            <input type="text" id="phoneNumber" name="phoneNumber" placeholder="Enter phone number" className="w-full input input-bordered" value={form.phoneNumber} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="notes">Notes (optional)</label>
            <textarea id="notes" name="notes" placeholder="Enter notes" className="w-full input input-bordered" value={form.notes} onChange={handleChange} />
          </div>
        </form>
        {/* Right: Bill Preview */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div ref={previewRef} className="w-full flex flex-col items-center">
            <TemplateComponent form={form} total={total} numberToWords={numberToWords} logo={logoEnabled ? logoOptions.find(opt => opt.value === selectedLogo)?.img : null} />
            </div>
          <button onClick={handleDownloadPDF} className="mt-4 flex items-center gap-2 bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800 transition">
            <DownloadIcon size={18} /> Download as PDF
          </button>
        </div>
      </div>
    
    
    {/* BEGIN: Info Section (from user HTML) */}
    <div className="fuelbill-info-section">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="fuelbill-info-header">
            <span className="fuelbill-info-icon" role="img" aria-label="fuel">🛢️</span>
            <span className="fuelbill-info-title-gradient fuelbill-text">Fuel Bill Generator</span>
          </div>
          <p>Create professional fuel purchase receipts instantly. Perfect for petrol stations, fuel outlets, and transport businesses.</p>
        </div>
        {/* Features Section */}
        <div className="features">
          <h2 className="section-title" style={{color:'#ffff', borderBottom:'2px solid #ffff', paddingBottom:'10px'}}>🎯 Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>✅ Multiple Templates</h3>
              <p>Choose from 3 professional bill templates designed for different use cases.</p>
            </div>
            <div className="feature-item">
              <h3>🏷️ Company Logos</h3>
              <p>Select from major fuel companies or use without logo for custom branding.</p>
            </div>
            <div className="feature-item">
              <h3>🧾 Auto-Calculate</h3>
              <p>Automatic total calculation based on quantity and price per liter.</p>
            </div>
            <div className="feature-item">
              <h3>📱 Mobile Responsive</h3>
              <p>Works seamlessly on desktop, tablet, and mobile devices.</p>
            </div>
            <div className="feature-item">
              <h3>📤 PDF Export</h3>
              <p>Download professional PDF receipts ready for printing or sharing.</p>
            </div>
            <div className="feature-item">
              <h3>🔐 Privacy Focused</h3>
              <p>All data stays in your browser - no server uploads or data collection.</p>
            </div>
          </div>
        </div>
        {/* Instructions */}
        <div className="instructions">
          <h2 className="section-title" style={{color:'#ffff', borderBottom:'2px solid #ffff', paddingBottom:'10px'}}>📝 How to Use</h2>
          <ol>
            <li><strong>Select Template:</strong> Choose from 3 professional layouts</li>
            <li><strong>Pick Company Logo:</strong> Select your fuel company or disable logo</li>
            <li><strong>Fill Company Details:</strong> Enter your station name, address, and contact info</li>
            <li><strong>Add Customer Info:</strong> Input customer name and vehicle details</li>
            <li><strong>Enter Fuel Details:</strong> Select fuel type, price, and quantity</li>
            <li><strong>Set Date & Time:</strong> Choose transaction date and time</li>
            <li><strong>Preview Live:</strong> Watch the bill update in real-time</li>
            <li><strong>Download PDF:</strong> Generate and save your professional receipt</li>
          </ol>
        </div>
        <div className="fuelbill-info-section-additional">
          <div className="fuelbill-info-card">
            <h2 className="fuelbill-info-title"><span role="img" aria-label="tips">💡</span> Tips for Best Use</h2>
            <ul className="fuelbill-info-list">
              <li><span role="img" aria-label="print">🖨️</span> Use Template 1 for compact thermal print format</li>
              <li><span role="img" aria-label="mobile">📱</span> Works on mobile — ideal for on-the-go invoicing</li>
              <li><span role="img" aria-label="unique">🧾</span> Make sure the bill number is unique for tracking</li>
              <li><span role="img" aria-label="calc">🧮</span> The total is automatically calculated as Price x Quantity</li>
              <li><span role="img" aria-label="logo">🖼️</span> Upload your own company logo in the future version (feature suggestion)</li>
            </ul>
          </div>
          <div className="fuelbill-info-card">
            <h2 className="fuelbill-info-title"><span role="img" aria-label="box">📦</span> Use Cases</h2>
            <ul className="fuelbill-info-list">
              <li>Petrol pump and gas station billing</li>
              <li>Internal vehicle fuel logs</li>
              <li>Fleet fuel expense tracking</li>
              <li>Demo or mock receipts</li>
              <li>Invoice templates for workshops</li>
            </ul>
          </div>
          <div className="fuelbill-info-card">
            <h2 className="fuelbill-info-title"><span role="img" aria-label="privacy">🔐</span> Data Privacy</h2>
            <p className="fuelbill-info-paragraph">All data entered is stored only in your browser session. No information is uploaded or saved on our servers. Your customer details and billing data remain completely private.</p>
          </div>
          <div className="fuelbill-info-card">
            <h2 className="fuelbill-info-title"><span role="img" aria-label="cta">📣</span> Call to Action</h2>
            <p className="fuelbill-info-paragraph">Fill in your details above, choose your preferred style, and click <b>Download PDF</b> to generate your fuel bill instantly.<br/>
            Make your billing professional, quick, and paper-ready in seconds!</p>
            <div className="fuelbill-info-cta"><span role="img" aria-label="generate">🧾</span> Generate. Print. Deliver.</div>
          </div>
        </div>
        
      </div>
      </div>
    
    {/* END: Info Section */}

    {/* BEGIN: Additional Info Sections (as cards, styled like main info section) */}
    
    {/* END: Additional Info Sections */}

    
    </motion.div>
  );
};

export default FuelBillGenerator; 