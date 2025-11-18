(function() {
  'use strict';
  
  const API_URL = 'http://localhost:3000';
  
  const AIFormBuilder = {
    init: function(config) {
      const container = document.getElementById(config.containerId);
      if (!container) {
        console.error('Container not found:', config.containerId);
        return;
      }
      
      this.loadWidget(container, config.formId, 'inline');
    },
    
    initPopup: function(config) {
      const trigger = document.getElementById(config.triggerId);
      if (!trigger) {
        console.error('Trigger not found:', config.triggerId);
        return;
      }
      
      const self = this;
      trigger.addEventListener('click', function() {
        self.openPopup(config.formId);
      });
    },
    
    loadWidget: function(container, formId, mode) {
      const iframe = document.createElement('iframe');
      iframe.src = `${API_URL}/widget/${formId}`;
      iframe.style.width = '100%';
      iframe.style.height = mode === 'inline' ? '600px' : '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      
      container.appendChild(iframe);
    },
    
    openPopup: function(formId) {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '9999';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      
      // Create modal
      const modal = document.createElement('div');
      modal.style.width = '90%';
      modal.style.maxWidth = '600px';
      modal.style.height = '80%';
      modal.style.backgroundColor = 'white';
      modal.style.borderRadius = '12px';
      modal.style.position = 'relative';
      modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
      
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '10px';
      closeBtn.style.right = '10px';
      closeBtn.style.fontSize = '24px';
      closeBtn.style.background = 'none';
      closeBtn.style.border = 'none';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.zIndex = '10000';
      closeBtn.onclick = function() {
        document.body.removeChild(overlay);
      };
      
      // Iframe
      const iframe = document.createElement('iframe');
      iframe.src = `${API_URL}/widget/${formId}`;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '12px';
      
      modal.appendChild(closeBtn);
      modal.appendChild(iframe);
      overlay.appendChild(modal);
      
      // Close on overlay click
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
        }
      });
      
      document.body.appendChild(overlay);
    }
  };
  
  window.AIFormBuilder = AIFormBuilder;
})();

