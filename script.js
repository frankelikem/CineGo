// CineGo booking script
// This project uses browser storage for a temporary demo booking.
// It does not save bookings to a real database.

const bookingForm = document.querySelector("#bookingForm");

// Set the earliest selectable date to today.
if (bookingForm) {
  const dateInput = document.querySelector("#date");
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  dateInput.min = localToday;

  // If a movie name is included in the page URL, select it in the form.
  const pageParameters = new URLSearchParams(window.location.search);
  const movieFromLink = pageParameters.get("movie");
  const movieSelect = document.querySelector("#movie");

  if (movieFromLink) {
    movieSelect.value = movieFromLink;
  }

  bookingForm.addEventListener("submit", function (event) {
    // Stop the browser from submitting and reloading the page.
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const movie = movieSelect.value;
    const date = dateInput.value;
    const tickets = Number(document.querySelector("#tickets").value);
    const selectedTime = document.querySelector('input[name="time"]:checked');
    const selectedType = document.querySelector('input[name="type"]:checked');
    const message = document.querySelector("#formMessage");

    // Give a clear message if a required choice is missing.
    if (!selectedTime || !selectedType) {
      message.textContent = "Please choose a showtime and ticket type.";
      return;
    }

    if (date < localToday) {
      message.textContent = "Please choose today or a future date.";
      return;
    }

    if (tickets < 1 || tickets > 10) {
      message.textContent = "Choose between 1 and 10 tickets.";
      return;
    }

    const ticketType = selectedType.value;
    const ticketPrice = ticketType === "Student" ? 25 : 35;
    const totalPrice = ticketPrice * tickets;

    // Collect the booking details in one simple object.
    const booking = {
      name: name,
      movie: movie,
      date: date,
      time: selectedTime.value,
      tickets: tickets,
      ticketType: ticketType,
      total: totalPrice
    };

    // Store the details so the next page can display them.
    // sessionStorage lasts for this browser tab session.
    sessionStorage.setItem("cineGoBooking", JSON.stringify(booking));

    // Open the booking summary page.
    window.location.href = "confirmation.html";
  });
}

// Show the saved booking on the confirmation page.
const summary = document.querySelector("#bookingSummary");

if (summary) {
  const savedBooking = sessionStorage.getItem("cineGoBooking");
  const emptyMessage = document.querySelector("#emptyBooking");

  if (!savedBooking) {
    emptyMessage.hidden = false;
    summary.hidden = true;
    document.querySelector("#confirmTitle").textContent = "No booking to show";
    document.querySelector("#confirmMessage").textContent =
      "Start by choosing a movie and completing the booking form.";
  } else {
    const booking = JSON.parse(savedBooking);

    const formattedDate = new Date(booking.date + "T00:00:00").toLocaleDateString("en-GH", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    document.querySelector("#confirmTitle").textContent = "You're all set, " + booking.name + "!";
    document.querySelector("#confirmMessage").textContent =
      "Review your booking details below.";

    document.querySelector("#summaryName").textContent = booking.name;
    document.querySelector("#summaryMovie").textContent = booking.movie;
    document.querySelector("#summaryDate").textContent = formattedDate;
    document.querySelector("#summaryTime").textContent = booking.time;
    document.querySelector("#summaryTickets").textContent = booking.tickets;
    document.querySelector("#summaryType").textContent = booking.ticketType;
    document.querySelector("#summaryTotal").textContent = "GHS " + booking.total.toFixed(2);
  }
}
