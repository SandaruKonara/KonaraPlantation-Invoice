import React from "react";
import { jsPDF } from "jspdf";
import './index.css';
import KonaraLogo from "./images/Konara.png"; 

import { Layout, FilePlus, FileText, Printer, Trash2 } from "lucide-react";

const QuotationDashboard = () => {
  const [activeMenu, setActiveMenu] = React.useState("quotation");
  const [quotationData, setQuotationData] = React.useState({
    quotationNumber: "",
    date: "",
    clientName: "",
    clientAddress: "",
    contactNumber: "",
    items: [{ description: "", quantity: 0, unitPrice: 0, total: 0 }],
    tax: 0,
    total: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuotationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateSubtotal = () => {
    return quotationData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * 0.1; 
    return { subtotal, tax, total: subtotal + tax };
  };
  const downloadInvoice = () => {
    const { subtotal, tax, total } = calculateTotal();
    const doc = new jsPDF();
  
    // Set global styles
    const primaryColor = "#007bff";
    const textColor = "#333333";
    const headerBgColor = "#f2f2f2";
  
    // Title Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    doc.text("Invoice", 20, 20);
  
    // General Details Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor);
    doc.text(`Quotation Number: ${quotationData.quotationNumber}`, 20, 35);
    doc.text(`Date: ${quotationData.date}`, 20, 45);
    doc.text(`Client Name: ${quotationData.clientName}`, 20, 55);
    doc.text(`Client Address: ${quotationData.clientAddress}`, 20, 65);
    doc.text(`Contact Number: ${quotationData.contactNumber}`, 20, 75);
  
    // Add Logo
    const imgData = KonaraLogo;
    const logoSize = 30; // Logo size
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPosition = pageWidth - logoSize - 10; // Align logo to the right
    const yPosition = 10;
    doc.addImage(imgData, "PNG", xPosition, yPosition, logoSize, logoSize);
  
    // Items Section
    let y = 95;
    doc.setFillColor(headerBgColor);
    doc.rect(20, y - 10, pageWidth - 40, 10, "F"); // Header background
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor);
    doc.text("Items", 20, y - 2);
  
    // Table Headers
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    y += 10;
    doc.text("Description", 20, y);
    doc.text("Qty", 90, y);
    doc.text("Unit Price", 120, y);
    doc.text("Total", 160, y);
  
    // Table Data
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor);
    quotationData.items.forEach((item, index) => {
      y += 10;
      doc.text(item.description, 20, y);
      doc.text(item.quantity.toString(), 90, y);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 120, y);
      doc.text(`$${item.total.toFixed(2)}`, 160, y);
    });
  
    // Summary Section
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Summary", 20, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 20, y);
    doc.text(`Tax (10%): $${tax.toFixed(2)}`, 20, y + 10);
    doc.text(`Total: $${total.toFixed(2)}`, 20, y + 20);
  
    // Footer Section
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, doc.internal.pageSize.height - 30, pageWidth - 20, doc.internal.pageSize.height - 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Thank you for choosing KONARA PLANTATIONS! For inquiries, please contact us. ",
      20,
      doc.internal.pageSize.height - 20
    );
  
    // Save the PDF
    doc.save("quotation.pdf");
  };
  
  const addItem = () => {
    setQuotationData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 0, unitPrice: 0, total: 0 }],
    }));
  };

  const removeItem = (indexToRemove) => {
    if (quotationData.items.length > 1) {
      setQuotationData((prev) => ({
        ...prev,
        items: prev.items.filter((_, index) => index !== indexToRemove),
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        

        <div className="p-4 flex items-center space-x-4 border-b">
  <img src={KonaraLogo} alt="Konara Logo" className="w-10 h-10 object-contain" />
  <span className="font-semibold text-lg">KONARA PLANTATIONS</span>
</div>


        <nav className="p-4">
          <button
            className={`w-full flex items-center space-x-2 p-2 rounded-lg mb-2 ${
              activeMenu === "quotation"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveMenu("quotation")}
          >
            <FilePlus className="w-5 h-5" />
            <span>INVOICE</span>
          </button>
          
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeMenu === "quotation" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Create Invoice</h1>
              <div className="flex space-x-4">
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print invoice</span>
                </button>
                <button
                  onClick={downloadInvoice}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Download PDF
                </button>
              </div>
            </div>

            {/* Quotation Form */}
            <div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block font-medium mb-2">Quotation Number</label>
                  <input
                    type="text"
                    name="quotationNumber"
                    value={quotationData.quotationNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={quotationData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={quotationData.clientName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Home Address</label>
                  <textarea
                    name="clientAddress"
                    value={quotationData.clientAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="2"
                  />
                </div>
                
              

                <div>
                  <label className="block font-medium mb-2">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={quotationData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Quantity</th>
                      <th className="border p-2">Unit Price</th>
                      <th className="border p-2">Total</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotationData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...quotationData.items];
                              newItems[index].description = e.target.value;
                              setQuotationData({ ...quotationData, items: newItems });
                            }}
                            className="w-full p-1"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...quotationData.items];
                              newItems[index].quantity = parseFloat(e.target.value) || 0;
                              newItems[index].total =
                                newItems[index].quantity * newItems[index].unitPrice;
                              setQuotationData({ ...quotationData, items: newItems });
                            }}
                            className="w-full p-1"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const newItems = [...quotationData.items];
                              newItems[index].unitPrice = parseFloat(e.target.value) || 0;
                              newItems[index].total =
                                newItems[index].quantity * newItems[index].unitPrice;
                              setQuotationData({ ...quotationData, items: newItems });
                            }}
                            className="w-full p-1"
                          />
                        </td>
                        <td className="border p-2">
                          Rs:{(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  onClick={addItem}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 text-right">
              <p>Subtotal: Rs:{calculateSubtotal().toFixed(2)}</p>
              <p>Tax (10%): Rs:{(calculateTotal().tax).toFixed(2)}</p>
              <p>Total: Rs:{(calculateTotal().total).toFixed(2)}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuotationDashboard;
