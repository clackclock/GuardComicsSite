// Call the initialize function when the window loads
window.onload = initializeTabs;

// Function to handle tab switching
function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
// Function to set the initial active tab
function initializeTabs() {
  // Default to 'About'
  const defaultTab = 'About';
  const defaultButton = document.querySelector(`.tab button[onclick*="'${defaultTab}'"]`);
  
  // If we found the 'About' button, use it. Otherwise fall back to the first tab button.
  const triggerButton = defaultButton || document.querySelector('.tab button.tablinks');
  if (triggerButton) {
    // Call the existing openCity function with a fake event object to set the UI
    openCity({ currentTarget: triggerButton }, defaultTab);
  }
}

