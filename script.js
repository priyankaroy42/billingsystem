window.onload = function() {
  const randomOrderNumber = Math.floor(Math.random() * 300) + 1; // Generates a random number between 1 and 300
  document.getElementById("order-number").textContent = randomOrderNumber;
};


let order = [];

function addItem(name, price) {
  const existingItem = order.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.total = existingItem.quantity * existingItem.price;
  } else {
    order.push({ name, price, quantity: 1, total: price });
  }

  updateOrderSummary();
}

function removeItem(index) {
  order.splice(index, 1);
  updateOrderSummary();
}

function updateOrderSummary() {
  const summary = document.getElementById('order-summary');
  summary.innerHTML = '';

  let subtotal = 0;
  order.forEach((item, index) => {
    subtotal += item.total;

    summary.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>
          <button onclick="changeQuantity(${index}, -1)">-</button>
          ${item.quantity}
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </td>
        <td>₹${item.total.toFixed(2)}</td>
        <td><button onclick="removeItem(${index})">Remove</button></td>
      </tr>
    `;
  });

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('tax').textContent = tax.toFixed(2);
  document.getElementById('total').textContent = total.toFixed(2);
}

function changeQuantity(index, amount) {
  order[index].quantity += amount;

  if (order[index].quantity <= 0) {
    order.splice(index, 1);
  } else {
    order[index].total = order[index].quantity * order[index].price;
  }

  updateOrderSummary();
}

function clearOrder() {
  order = [];
  updateOrderSummary();
}
function generateReceipt() {
  if (order.length === 0) {
    alert('  😞Please add items to your order before generating the receipt.');
    return;
  }

  // Generate a random order number (from 1 to 300)
  const orderNumber = Math.floor(Math.random() * 300) + 1;
  const date = new Date().toLocaleString();

  // Prepare the HTML for the receipt page
  let receiptHtml = `
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f9f9f9;
          }
          h2 {
            text-align: center;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table th, table td {
            padding: 10px;
            text-align: left;
            border: 1px solid #ddd;
          }
          .total {
            font-weight: bold;
            text-align: right;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h2>Receipt</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Date:</strong> ${date}</p>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
  `;

  // Add the order items to the receipt HTML
  order.forEach(item => {
    receiptHtml += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.total.toFixed(2)}</td>
      </tr>
    `;
  });

  // Calculate subtotal, tax, and total
  const subtotal = order.reduce((acc, item) => acc + item.total, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  receiptHtml += `
          </tbody>
        </table>
        <p class="total"><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
        <p class="total"><strong>Tax:</strong> ₹${tax.toFixed(2)}</p>
        <p class="total"><strong>Total:</strong> ₹${total.toFixed(2)}</p>
        <div class="footer">
          <p>Thank you for your order!🌻 Your Order is getting prepared</p>
        </div>
      </body>
    </html>
  `;

  // Open a new window and write the receipt HTML
  const receiptWindow = window.open('', '_blank');
  receiptWindow.document.write(receiptHtml);
  receiptWindow.document.close(); // Close the document to finish rendering

  // After the page is fully loaded, trigger the print dialog
  receiptWindow.onload = function() {
    receiptWindow.print();
  };
}

