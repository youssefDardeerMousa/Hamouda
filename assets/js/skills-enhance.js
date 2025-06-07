/**
 * Enhanced Skills Section with Colored Progress Bars
 */

document.addEventListener('DOMContentLoaded', function() {
  // Set up animation observer
  setupProgressBarAnimation();
  
  // Handle window view
  document.addEventListener('sectionDisplayed', function(e) {
    if (e.detail && e.detail.sectionId === 'skills') {
      setTimeout(() => animateWindowSkills(e.detail.container), 200);
    }
  });
  
  // Add skill icons
  addSkillIcons();
});

/**
 * Set up intersection observer to animate progress bars when visible
 */
function setupProgressBarAnimation() {
  if (!window.IntersectionObserver) {
    // Fallback for browsers without IntersectionObserver
    animateAllProgressBars();
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateProgressBars(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe the skills section
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

/**
 * Animate all progress bars in container
 */
function animateProgressBars(container) {
  const progressBars = container.querySelectorAll('.progress-bar');
  
  progressBars.forEach((bar, index) => {
    // Start with width 0
    bar.style.width = '0%';
    
    // Animate to the proper width after a slight delay
    setTimeout(() => {
      const percentage = bar.textContent.trim();
      bar.style.width = percentage;
      
      // Add the appropriate color class based on percentage value
      const percentValue = parseInt(percentage);
      updateProgressBarColor(bar, percentValue);
    }, index * 100);
  });
}

/**
 * Animate all progress bars (fallback)
 */
function animateAllProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  progressBars.forEach((bar, index) => {
    // Start with width 0
    bar.style.width = '0%';
    
    // Animate to the proper width after a slight delay
    setTimeout(() => {
      const percentage = bar.textContent.trim();
      bar.style.width = percentage;
      
      // Add the appropriate color class based on percentage value
      const percentValue = parseInt(percentage);
      updateProgressBarColor(bar, percentValue);
    }, index * 100);
  });
}

/**
 * Update progress bar color based on percentage
 */
function updateProgressBarColor(progressBar, percentage) {
  // Remove existing color classes
  progressBar.classList.remove('text-bg-success', 'text-bg-info', 'text-bg-warning', 'text-bg-danger');
  
  // Add appropriate color class based on percentage
  if (percentage >= 95) {
    progressBar.classList.add('text-bg-success');
  } else if (percentage >= 90) {
    progressBar.classList.add('text-bg-info');
  } else if (percentage >= 80) {
    progressBar.classList.add('text-bg-warning');
  } else {
    progressBar.classList.add('text-bg-danger');
  }
}

/**
 * Animate progress bars in window view
 */
function animateWindowSkills(container) {
  if (!container) return;
  
  setTimeout(() => {
    animateProgressBars(container);
  }, 300);
}

/**
 * Add icons to skill names based on skill type
 */
function addSkillIcons() {
  const skillNames = document.querySelectorAll('.skill-name');
  
  skillNames.forEach(name => {
    const text = name.textContent.trim().toLowerCase();
    let iconClass = '';
    
    if (text.includes('icdl')) {
      iconClass = '\uF538'; // computer
    } else if (text.includes('microsoft') || text.includes('office')) {
      iconClass = '\uF3FA'; // microsoft
    } else if (text.includes('maintenance')) {
      iconClass = '\uF5B2'; // tools
    } else if (text.includes('engineering') || text.includes('mastercam')) {
      iconClass = '\uF5FC'; // gear
    } else if (text.includes('photoshop')) {
      iconClass = '\uF39D'; // pencil
    } else if (text.includes('cattia')) {
      iconClass = '\uF15B'; // file
    } else if (text.includes('solid') || text.includes('work')) {
      iconClass = '\uF61F'; // 3d
    } else if (text.includes('dynaform')) {
      iconClass = '\uF265'; // diagram
    } else if (text.includes('lingo')) {
      iconClass = '\uF1AE'; // translate
    } else if (text.includes('endnote') || text.includes('x7')) {
      iconClass = '\uF46D'; // book
    }
    
    if (iconClass) {
      name.setAttribute('data-icon', iconClass);
    }
  });
}

// Hook into window.js if it exists
if (typeof window.originalOpenSectionContent === 'undefined' && typeof openSectionContent === 'function') {
  window.originalOpenSectionContent = openSectionContent;
  
  window.openSectionContent = function(sectionId) {
    window.originalOpenSectionContent(sectionId);
    
    if (sectionId === 'skills') {
      setTimeout(() => {
        const container = document.querySelector('.window-expanded-content');
        animateWindowSkills(container);
      }, 300);
    }
  };
}
