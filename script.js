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
const slideshow1Images = [
  { 
    h2: "Wallalwwa - Colombo", 
    p: "Set amidst 200-year-old tropical gardens and just 20 minutes from Sri Lanka’s main international gateway, Wallawwa is an award-winning 18-bedroom country house hotel, unlike any other airport hotel you’ve stayed at.", 
    img: "Pictures/Slide Show 1/1 - Wallalwwa.webp", 
    alt: "Wallalwwa - Colombo",
    button1Link: "",
    button2Link: ""
  },
  { 
    h2: "Fort Bazzar - Galle Fort", 
    p: "Situated within 16th century UNESCO Galle Fort, Fort Bazaar is a former merchant’s home turned boutique hotel with 18 bedrooms and suites, a first-class spa, and a vibrant culinary offering.", 
    img: "Pictures/Slide Show 1/2 - Fort Bazzar.webp", 
    alt: "Fort Bazzar - Galle Fort",
    button1Link: "",
    button2Link: ""
  },
  { 
    h2: "Kumu Beach - Balapitiya", 
    p: "Home to 10 indulgent bedrooms, this luxury, boutique spa hotel is footsteps away from sun, sand, and sea on Sri Lanka’s south-west coast.", 
    img: "Pictures/Slide Show 1/3 - Kumu Beach.webp", 
    alt: "Kumu Beach - Balapitiya",
    button1Link: "",
    button2Link: ""
  },
  { 
    h2: "Camellia Hills - Dickoya", 
    p: "Nestled within Sri Lanka’s Central Highlands, Camellia Hills is a stylish 5-bedroom tea bungalow enveloped by breathtaking tea plantations and the mirror-still Castlereagh Reservoir.", 
    img: "Pictures/Slide Show 1/4 - Camellia Hills.webp", 
    alt: "Camellia Hills - Dickoya",
    button1Link: "",
    button2Link: ""
  },
  { 
    h2: "Goatfell - Nuwara Eliya", 
    p: "Perched amongst tea bushes high up a hill near Nuwara Eliya, Goatfell is a luxurious 4-bedroom bungalow, with exceptional views of the island’s tea country.", 
    img: "Pictures/Slide Show 1/5 - Goatfell.webp", 
    alt: "Goatfell - Nuwara Eliya",
    button1Link: "",
    button2Link: ""
  },
  { 
    h2: "Nine Skies - Ella", 
    p: "With far-reaching views over Ella’s mountain range, our beautifully restored 5-bedroom tea bungalow blends the contemporary with an old-world aesthetic.", 
    img: "Pictures/Slide Show 1/6 - Nine Skies.webp", 
    alt: "Nine Skies - Ella",
    button1Link: "",
    button2Link: ""
  },
  { 
    h2: "Lunuganga - Bentota", 
    p: "Geoffrey Bawa’s soulful, country estate sits near west-coast Bentota and features 10 uniquely individual rooms spread across serendipitous 15-acre gardens, complete with a swimming pool and daily garden tours.", 
    img: "Pictures/Slide Show 1/7 - Lunuganga.webp", 
    alt: "Lunuganga - Bentota",
    button1Link: "",
    button2Link: ""
  }
];

let slideshow1CurrentIndex = 0;

function renderSlides() {
  const slideshow1SlideContainer = document.getElementById('slideshow1-slides');
  const slideshow1TotalSlidesNumber = document.getElementById('slideshow1-totalSlidesNumber');
  const slideshow1CurrentSlideNumber = document.getElementById('slideshow1-currentSlideNumber');

  slideshow1TotalSlidesNumber.textContent = slideshow1Images.length;
  slideshow1CurrentSlideNumber.textContent = slideshow1CurrentIndex + 1;

  slideshow1SlideContainer.innerHTML = '';

  // Dynamically calculate the number of images based on the window width
  let slideshow1NumImagesToShow;
  if (window.innerWidth < 850) {
    slideshow1NumImagesToShow = 1; // Show 1 image for widths less than 850px
  } else if (window.innerWidth < 1300) {
    slideshow1NumImagesToShow = 2; // Show 2 images for widths less than 1300px
  } else {
    slideshow1NumImagesToShow = 3; // Show 3 images for widths greater than 1300px
  }

  for (let i = 0; i < slideshow1NumImagesToShow; i++) {
    const slideshow1ImgIndex = (slideshow1CurrentIndex + i) % slideshow1Images.length;
    const image = slideshow1Images[slideshow1ImgIndex];
    const div = document.createElement('div');
    div.className = 'slideshow1-image-container' + (i === 0 ? ' focus' : '');
    div.innerHTML = `
      <img src="${image.img}" alt="${image.alt}">
      <div class="slideshow1-text-button-container">
        <h2>${image.h2}</h2>
        <p>${image.p}</p>
        <div class="slideshow1-buttons">
          <button onclick="window.location.href='${image.button1Link}'">Explore</button>
          <button onclick="window.location.href='${image.button2Link}'">Check Availability</button>
        </div>
      </div>
    `;
    slideshow1SlideContainer.appendChild(div);
  }
}

function nextSlide() {
  slideshow1CurrentIndex = (slideshow1CurrentIndex + 1) % slideshow1Images.length;
  renderSlides();
}

function prevSlide() {
  slideshow1CurrentIndex = (slideshow1CurrentIndex - 1 + slideshow1Images.length) % slideshow1Images.length;
  renderSlides();
}

// Initial render
renderSlides();

// Re-render slides when window is resized
window.addEventListener('resize', renderSlides);