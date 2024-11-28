// Page Transitions
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

/* ----------------------------------------------------------------------------------------------------*/

// Full menue nav bar(in small screens)
function openNav() {
    document.getElementById("myNav").style.display = "block";
}

function closeNav() {
    document.getElementById("myNav").style.display = "none";
}

/* ----------------------------------------------------------------------------------------------------*/

// See through nav bar when scroll
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  const links = document.querySelectorAll('.navbar ul li a');
  const hamburger = document.querySelector('.hamburger');
  
  if (window.scrollY > 0) {
    navbar.classList.add('scrolled');
    links.forEach(link => link.classList.add('scrolled'));
    if (hamburger) {
      hamburger.classList.add('scrolled');
    }
  } else {
    navbar.classList.remove('scrolled');
    links.forEach(link => link.classList.remove('scrolled'));
    if (hamburger) {
      hamburger.classList.remove('scrolled');
    }
  }
});

/* ----------------------------------------------------------------------------------------------------*/

// Scroll to top
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

scrollToTopBtn.style.display = "none";

window.onscroll = function () {
  if (window.innerWidth < 481) {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  } else {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  }
};

scrollToTopBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

/* ----------------------------------------------------------------------------------------------------*/

// Search Engine
const journeyButton = document.querySelector(".journey-button");
const journeyDropdown = document.querySelector(".journey-dropdown");
const journeyDropdownMenu = document.querySelector(".journey-dropdown-menu");
const journeyOptions = document.querySelectorAll(".journey-option");

const whoButton = document.querySelector(".who-button");
const dropdown = document.querySelector(".who-dropdown");
const dropdownMenu = document.querySelector(".who-dropdown-menu");

// Helper function to close all dropdowns
const closeAllDropdowns = () => {
  journeyDropdown.classList.remove("active");
  dropdown.classList.remove("active");
};

// Highlight the active journey option
const setActiveJourneyOption = (option) => {
  journeyOptions.forEach((opt) => opt.classList.remove("active"));
  option.classList.add("active");
};

// Journey dropdown toggle
journeyButton.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!journeyDropdown.classList.contains("active")) {
    closeAllDropdowns();
  }
  journeyDropdown.classList.toggle("active");
});

journeyDropdownMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

journeyOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    const selectedOption = e.target;
    journeyButton.textContent = selectedOption.textContent;
    setActiveJourneyOption(selectedOption);
    journeyDropdown.classList.remove("active");
  });
});

// Who dropdown toggle
whoButton.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!dropdown.classList.contains("active")) {
    closeAllDropdowns();
  }
  dropdown.classList.toggle("active");
});

dropdownMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Increment and decrement passenger count with validation for infants
document.querySelectorAll(".who-increment, .who-decrement").forEach((button) => {
  button.addEventListener("click", (e) => {
    const countSpan = e.target.closest(".who-passenger-type").querySelector(".who-count");
    const passengerType = countSpan.dataset.type; // Get passenger type (e.g., adult, young-adult, child, infant)
    let currentCount = parseInt(countSpan.textContent);

    // Flag to check if an alert was shown
    let alertShown = false;

    // Handle increment and decrement for all passenger types
    if (e.target.classList.contains("who-increment")) {
      countSpan.textContent = currentCount + 1;
    } else if (e.target.classList.contains("who-decrement") && currentCount > 0) {
      countSpan.textContent = currentCount - 1;
    }

    // After updating counts, check if the conditions for infants and children are met
    const adultsCount = parseInt(document.querySelector(".who-count[data-type='adult']").textContent);
    const youngAdultsCount = parseInt(document.querySelector(".who-count[data-type='young-adult']").textContent);
    const childrenCount = parseInt(document.querySelector(".who-count[data-type='child']").textContent);
    const infantsCount = parseInt(document.querySelector(".who-count[data-type='infant']").textContent);

    // Case 1: If adding infants, ensure there is at least one adult
    if (passengerType === "infant" && infantsCount > adultsCount) {
      if (!alertShown) {
        showAlert("You cannot have more infants than adults.");
        alertShown = true;  // Set alertShown to true to prevent further alerts
      }
      countSpan.textContent = currentCount;  // Revert the increment
    }

    // Case 2: If adding children, ensure there are enough adults or young adults
    if (passengerType === "child" && childrenCount > (adultsCount + youngAdultsCount)) {
      if (!alertShown) {
        showAlert("You cannot have more children than adults or young adults combined.");
        alertShown = true;  // Set alertShown to true to prevent further alerts
      }
      countSpan.textContent = currentCount;  // Revert the increment
    }

    // Case 3: If all adults or young adults are removed, remove infants and children as well
    if (adultsCount + youngAdultsCount === 0 && (infantsCount > 0 || childrenCount > 0)) {
      if (!alertShown) {
        document.querySelector(".who-count[data-type='infant']").textContent = 0;
        document.querySelector(".who-count[data-type='child']").textContent = 0;
        showAlert("You must have at least one adult or young adult to have infants or children. They have been removed.");
        alertShown = true;
      }
    }

    // Case 4: If infants or children exceed the number of available adults or young adults, adjust them
    const totalAdultsYoungAdults = adultsCount + youngAdultsCount;

    if (infantsCount > totalAdultsYoungAdults) {
      if (!alertShown) {
        document.querySelector(".who-count[data-type='infant']").textContent = totalAdultsYoungAdults;
        showAlert("Infants count has been adjusted to match the available adults.");
        alertShown = true;
      }
    }

    if (childrenCount > totalAdultsYoungAdults) {
      if (!alertShown) {
        document.querySelector(".who-count[data-type='child']").textContent = totalAdultsYoungAdults;
        showAlert("Children count has been adjusted to match the available adults and young adults.");
        alertShown = true;
      }
    }

    updateWhoText();
  });
});

// Update the "Who" button text
const updateWhoText = () => {
  let totalPassengers = 0;
  document.querySelectorAll(".who-count").forEach((count) => {
    totalPassengers += parseInt(count.textContent);
  });
  whoButton.textContent = `${totalPassengers} ${totalPassengers > 1 ? "people" : "person"}`;
};

// Helper function to show an alert message
const showAlert = (message) => {
  alert(message);
};

// Close all dropdowns when clicking outside
document.addEventListener("click", () => {
  closeAllDropdowns();
});

// Set default active journey option
setActiveJourneyOption(document.querySelector(".journey-option.active"));

// Set the minimum date to today for the date input
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('search-engine-when');
  const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  dateInput.setAttribute('min', today); // Set the 'min' attribute to today's date
});

/* ----------------------------------------------------------------------------------------------------*/

// Carousel
// This script will add clones dynamically to create the infinite loop
const carouselContent = document.querySelector('.carousel-content');
const carouselItems = document.querySelectorAll('.carousel-item');
const itemCount = carouselItems.length;

// Clone the items and append them to the carousel to create the seamless loop
for (let i = 0; i < itemCount; i++) {
  const clonedItem = carouselItems[i].cloneNode(true);
  carouselContent.appendChild(clonedItem);
}

// Adjust the width of the carousel content dynamically (Optional)
carouselContent.style.width = `${carouselItems.length * 350}px`; /* Adjust width to match the new item size */

/* ----------------------------------------------------------------------------------------------------*/

// Slide Show 1
const slideshow1bigLeft = document.querySelectorAll('.slideshow1big-left .slideshow1big-slide');
const slideshow1bigRight = document.querySelectorAll('.slideshow1big-right .slideshow1big-slide');

let activeIndex = 0;

function setActiveSlide(index) {
    slideshow1bigRight.forEach((slide, i) => {
        slide.classList.toggle('visible', i === index);
    });

    slideshow1bigLeft.forEach((slide, i) => {
        slide.style.transform = i === index ? 'scale(1)' : 'scale(1)';
        slide.style.opacity = i === index ? '1' : '0.6';
    });

    activeIndex = index;
}

slideshow1bigLeft.forEach((slide, index) => {
    slide.addEventListener('click', () => setActiveSlide(index));
});

setActiveSlide(activeIndex);