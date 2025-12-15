let selectedEvent = null;

// Open booking model
function openBooking(eventId) {
  selectedEvent = events.find(e => e.id === eventId);
  document.getElementById("eventTitle").textContent = selectedEvent.name;
  document.getElementById("bookingmodel").classList.remove("hidden");
  updatePrice();
}

// Close model
document.getElementById("closemodel").onclick = () => {
  document.getElementById("bookingmodel").classList.add("hidden");
};

// Update price dynamically
document.getElementById("category").onchange = updatePrice;
function updatePrice() {
  const category = document.getElementById("category").value;
  const price = selectedEvent.categoryPrices[category];
  document.getElementById("priceDisplay").textContent = `Price: ₹${price}`;
}

// Handle booking form submit
document.getElementById("bookingForm").onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const category = document.getElementById("category").value;
  const price = selectedEvent.categoryPrices[category];

  const booking = { 
    eventName: selectedEvent.name, 
    category, 
    price, 
    userName: name, 
    userEmail: email 
  };

  saveBooking(booking);   // persist booking
  showconformation(booking);
};

// Save booking to localStorage
function saveBooking(booking) {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  updateHistory();
}

// Show conformation + QR
function showconformation(booking) {
  document.getElementById("bookingmodel").classList.add("hidden");
  document.getElementById("conformation").classList.remove("hidden");
  generateQRCode(booking);
}

// Generate QR code
function generateQRCode(booking) {
  const qrData = `Event: ${booking.eventName}\nCategory: ${booking.category}\nPrice: ₹${booking.price}\nName: ${booking.userName}`;
  QRCode.toCanvas(document.getElementById("qrcode"), qrData, function (error) {
    if (error) console.error(error);
  });
}

// Update booking history list
function updateHistory() {
  const saved = JSON.parse(localStorage.getItem("bookings")) || [];
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  saved.forEach(b => {
    const li = document.createElement("li");
    li.textContent = `${b.eventName} (${b.category}) - ₹${b.price} for ${b.userName}`;
    list.appendChild(li);
  });
}

// Clear history
document.getElementById("clearHistory").onclick = () => {
  localStorage.removeItem("bookings");
  updateHistory();
  document.getElementById("conformation").classList.add("hidden");
};

// Initialize history on load
window.onload = () => {
  updateHistory();
  const saved = JSON.parse(localStorage.getItem("bookings")) || [];
  if (saved.length > 0) {
    const lastBooking = saved[saved.length - 1];
    showconformation(lastBooking);
  }
};