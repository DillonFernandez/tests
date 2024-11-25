function openNav() {
    document.getElementById("myNav").style.display = "block";
}

function closeNav() {
    document.getElementById("myNav").style.display = "none";
}

/* ----------------------------------------------------------------------------------------------------*/

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const links = document.querySelectorAll('.navbar ul li a');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.scrollY > 0) {
      navbar.classList.add('scrolled'); // Add the 'scrolled' class to navbar
      links.forEach(link => link.classList.add('scrolled')); // Add 'scrolled' class to all anchor links
      if (hamburger) {
        hamburger.classList.add('scrolled'); // Add 'scrolled' class to hamburger icon
      }
    } else {
      navbar.classList.remove('scrolled'); // Remove the 'scrolled' class from navbar
      links.forEach(link => link.classList.remove('scrolled')); // Remove 'scrolled' class from all anchor links
      if (hamburger) {
        hamburger.classList.remove('scrolled'); // Remove 'scrolled' class from hamburger icon
      }
    }
  });  