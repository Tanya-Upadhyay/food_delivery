import { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaCheck } from "react-icons/fa";

function Order({ order, isExpanded, onToggle }) {
  const [showTracker, setShowTracker] = useState(false);
  const toggleTracker = () => setShowTracker(prev => !prev);
  const API_BASE = import.meta.env.VITE_BASE_URL;

  const {
    userName,
    phoneNumber,
    address,
    orderdate,
    status,
    orderItems,
    paymentStatus
  } = order;

  const invoiceRef = useRef();

  const handleDownload = () => {
    const doc = new jsPDF();
    const img = new Image();
    const img1 = new Image();
    img.src = "17372 [Converted] 1.png";
    img1.src = "logo.png"
    doc.addImage(img, "png", 140, 30, 50, 50);
    doc.addImage(img1, "png", 20, 30, 50, 20);
    doc.setFontSize(16);
    doc.text("Invoice", 90, 20);

    doc.setFontSize(12);
    let y = 60;
    doc.text(`Name: ${userName}`, 20, y); y += 10;
    doc.text(`Phone: ${phoneNumber}`, 20, y); y += 10;
    doc.text(`Order Date: ${orderdate}`, 20, y); y += 10;
    doc.text(`Payment Status: ${paymentStatus}`, 20, y); y += 10;
    doc.text(`Address:`, 20, y); y += 8;

    const addressLines = doc.splitTextToSize(address, 160);
    doc.text(addressLines, 30, y);
    y += addressLines.length * 7 + 4;

    const tableColumn = ["#", "Product Name", "Quantity", "Price (Rs)", "SubTotal (Rs)"];
    const tableRows = orderItems.map((item, index) => [
      index + 1,
      item.productName,
      item.quantity,
      item.price,
      item.price * item.quantity
    ]);

    autoTable(doc, {
      startY: y,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 20, right: 20 },
    });
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let deliverFee = 20;
  let taxes = subtotal * 0.005;
  let grandTotal = Math.floor(subtotal + deliverFee + taxes)

    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.text(`Delivery Fee: Rs ${deliverFee}/-`, 20, finalY);
    doc.text(`Taxes: Rs ${taxes}/-`,20, finalY+10)
    doc.text(`Grand Total: Rs ${grandTotal}/-`, 20, finalY+20);

    doc.save("invoice.pdf");
  };

  return (
    <div className="mt-[6rem]">
      <div
        className="p-4 ml-[34vw] mr-[22vw] border border-white rounded-lg shadow-md w-[60%] md:w-[50%]"
        ref={invoiceRef}>
        {isExpanded && (
          <div className="w-[70%] md:w-[50%]">
            <div><strong>Name: </strong>{userName}</div>
            <div><strong>Phone No: </strong>{phoneNumber}</div>
            <div><strong>Address: </strong>{address}</div>
            <div><strong>Order Date: </strong>{orderdate}</div>
            <div><strong>Payment Status: </strong>{paymentStatus}</div>
          </div>
        )}
        <div><strong>Status: </strong>{status[status.length - 1]}</div>
        {showTracker && (
          <div className="mt-6 px-4 py-2 bg-white/10 rounded-md shadow-md w-[92%] ml-[2rem]">
            <h2 className="text-lg font-bold mb-4 text-white">Order Status</h2>
            <div className="flex flex-col md:flex-row md:gap-8 gap-4">
              {["Order Placed", "Packed", "Out For Delivery", "Delivered"].map((stage, index) => {
                const isCompleted = order.status.includes(stage);
                const isCurrent = order.status[order.status.length - 1] === stage;

                return (
                  <div key={index} className="flex items-center gap-2">
                    {isCompleted? (<div
                      className={`w-4 h-4 rounded-full`}
                    ><FaCheck className='text-green-500' /></div>):(<div
                      className={`w-4 h-4 rounded-full bg-gray-400`}
                    ></div>)}
                    {/* <div
                      className={`w-4 h-4 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-400'}`}
                    ></div> */}
                    <span
                      className={`text-sm md:text-base ${isCurrent ? 'font-bold text-yellow-400' : ''} ${isCompleted ? 'font-bold text-yellow-400' : ''}`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 ml-[1rem] w-[95%]">
          <ul className="flex flex-col">
            {orderItems.map((item, index) => (
              <li key={index}>
                <div className="flex justify-between items-center gap-[5rem] bg-white/10 p-4 rounded-md shadow-lg m-[.5rem ">
                  <img
                    src={`${API_BASE}${item.image}`}
                    alt={item.productName}
                    className="md:w-[12rem] md:h-[8rem] w-[8rem] h-[6rem] rounded-md shadow-lg object-cover"
                  />
                  <div className="flex flex-col gap-2 md:mr-0">
                    <div className="md:text-2xl md:font-bold text-xl font-semibold">{item.productName}</div>
                    <div className="md:text-xl"><strong>Price:</strong> Rs {item.price} /-</div>
                    <div className="md:text-xl"><strong>Quantity:</strong> {item.quantity}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between m-[1rem]">

          <button
            onClick={onToggle}
            className="bg-red-400 p-[.7rem] w-[30%] md:w-[20%] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer">
            {isExpanded ? "Hide Details" : "View Details"}
          </button>

          <button
            onClick={toggleTracker}
            className="bg-blue-500 p-[.7rem] w-[30%] md:w-[20%] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500 cursor-pointer">
            Track Your Order
          </button>

          <button
            onClick={handleDownload}
            className="bg-green-500 p-[.7rem] w-[30%] md:w-[20%] rounded-md font-bold shadow-md text-white hover:scale-105 transition-all duration-500cursor-pointer">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order;
