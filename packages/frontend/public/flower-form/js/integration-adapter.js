/**
 * Integration adapter for Flower Form
 * This script enables communication between the Flower Form and the parent application
 */

// Listen for messages from the parent application
window.addEventListener('message', (event) => {
  // Verify the origin (should match the parent application origin)
  if (event.origin !== window.location.origin) {
    return;
  }

  // Initialize the form with client data
  if (event.data && event.data.type === 'initFlowerForm') {
    const { clientId, formType } = event.data;
    
    console.log('Initializing Flower Form with:', { clientId, formType });
    
    // Set the form type
    if (formType && window.testTypeSelect) {
      window.testTypeSelect.value = formType;
      if (typeof showTest === 'function') {
        showTest(formType);
      }
    }
    
    // You can use clientId to fetch patient data if needed
    // For now, we'll just store it for later use
    window.currentClientId = clientId;
  }
});

// Override the save button to send data to the parent application
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveJsonBtn');
  
  if (saveButton) {
    // Store the original click handler
    const originalClickHandler = saveButton.onclick;
    
    // Override the click handler
    saveButton.onclick = (e) => {
      // Call the original handler if it exists
      if (originalClickHandler) {
        originalClickHandler.call(saveButton, e);
      }
      
      // Get the form data
      let formData;
      if (typeof collectData === 'function') {
        formData = collectData();
      } else {
        console.error('collectData function not found');
        return;
      }
      
      // Send the data to the parent application
      window.parent.postMessage({
        type: 'flowerFormSubmit',
        formData
      }, window.location.origin);
      
      console.log('Form data sent to parent application:', formData);
    };
  }
  
  // Add a custom header to indicate this is running in integration mode
  const container = document.querySelector('.container');
  if (container) {
    const integrationHeader = document.createElement('div');
    integrationHeader.className = 'integration-header';
    integrationHeader.innerHTML = '<span>Running in integration mode</span>';
    integrationHeader.style.padding = '8px 16px';
    integrationHeader.style.backgroundColor = '#2f66ff';
    integrationHeader.style.color = 'white';
    integrationHeader.style.fontSize = '12px';
    integrationHeader.style.textAlign = 'center';
    
    container.insertBefore(integrationHeader, container.firstChild);
  }
});
