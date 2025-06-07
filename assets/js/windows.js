document.addEventListener("DOMContentLoaded", function () {
  // This function will be called when the DOM is fully loaded
  setupWindowInteractions();
});

function setupWindowInteractions() {
  // Get all window sections
  const windowSections = document.querySelectorAll(".window-section");

  // Add click event to each window section
  windowSections.forEach((section) => {
    section.addEventListener("click", function () {
      const sectionId = this.getAttribute("data-section");
      console.log("Window section clicked:", sectionId); // Debug log
      if (sectionId) {
        openSectionContent(sectionId);
      }
    });
  });

  // Handle navbar links
  const navLinks = document.querySelectorAll(".navmenu a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      if (document.getElementById(targetId) && targetId !== "hero") {
        e.preventDefault(); // Prevent default hash navigation
        console.log("Nav link clicked:", targetId); // Debug log
        openSectionContent(targetId);
      }
    });
  });
}

// Function to open section content in a window
function openSectionContent(sectionId) {
  console.log("Opening section content for:", sectionId); // Debug log

  // Get the original section content
  const originalSection = document.getElementById(sectionId);

  if (originalSection) {
    // Find section title
    let sectionTitle = capitalizeFirstLetter(sectionId);
    const titleElement = originalSection.querySelector(".section-title h2");
    if (titleElement) {
      sectionTitle = titleElement.textContent;
    }

    // Find section icon
    let sectionIcon = "bi bi-window";

    // Map sections to their icons
    const iconMap = {
      about: "bi bi-person",
      stats: "bi bi-bar-chart",
      skills: "bi bi-tools",
      resume: "bi bi-file-earmark-text",
      portfolio: "bi bi-images",
      videos: "bi bi-camera-video",
      supervision: "bi bi-people",
      "course-lectures": "bi bi-mortarboard",
      hero: "bi bi-house",
    };

    sectionIcon = iconMap[sectionId] || sectionIcon;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "window-overlay";
    overlay.id = `overlay-${sectionId}`;
    overlay.style.display = "flex";

    // Create expanded window
    const expandedWindow = document.createElement("div");
    expandedWindow.className = "window-expanded";

    // Create header
    const header = document.createElement("div");
    header.className = "window-expanded-header";

    // Add title with icon
    const title = document.createElement("h3");
    const icon = document.createElement("i");
    icon.className = sectionIcon;
    title.appendChild(icon);
    title.appendChild(document.createTextNode(" " + sectionTitle));
    header.appendChild(title);

    // Add control buttons group
    const controlsGroup = document.createElement("div");
    controlsGroup.className = "window-controls-group";

    // Add minimize button
    const minBtn = document.createElement("button");
  

    // Add maximize button
    const maxBtn = document.createElement("button");
    maxBtn.className = "window-max-btn";
    maxBtn.innerHTML = '';
    maxBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      expandedWindow.classList.toggle("maximized");
      if (expandedWindow.classList.contains("maximized")) {
      } else {
      }
    });

    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "window-close-btn";
    closeBtn.innerHTML = '<i class="bi bi-x"></i>';
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      document.body.removeChild(overlay);
      document.body.style.overflow = "";
    });

    // Add buttons to controls group
    controlsGroup.appendChild(maxBtn);
    controlsGroup.appendChild(closeBtn);

    // Add controls to header
    header.appendChild(controlsGroup);

    // Add content
    const content = document.createElement("div");
    content.className = "window-expanded-content";

    // Clone the content to avoid modifying the original
    const clonedContent = originalSection.cloneNode(true);

    // Remove the section-title div from the cloned content if it exists
    const sectionTitleDiv = clonedContent.querySelector(".section-title");
    if (sectionTitleDiv) {
      clonedContent.removeChild(sectionTitleDiv);
    }

    content.innerHTML = clonedContent.innerHTML;

    // Special handling for videos section
    if (sectionId === "videos") {
      fixVideoButtons(content);
    }

    // Special handling for skills section
    if (sectionId === "skills") {
      setTimeout(() => {
        animateSkillBars(content);
      }, 300);
    }

    // Special handling for portfolio section
    if (sectionId === "portfolio") {
      // Enhance portfolio items
      enhancePortfolioItems(content);
    }

    // Build the expanded window
    expandedWindow.appendChild(header);
    expandedWindow.appendChild(content);
    overlay.appendChild(expandedWindow);

    // Remove any existing overlays
    const existingOverlay = document.querySelector(".window-overlay");
    if (existingOverlay) {
      document.body.removeChild(existingOverlay);
    }

    // Add to body
    document.body.appendChild(overlay);

    // Close on outside click
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        document.body.style.overflow = "";
      }
    });

    // Prevent scroll on body when overlay is open
    document.body.style.overflow = "hidden";

    // Update active class in navigation
    updateActiveNavLink(sectionId);
  }
}

// Function to fix video buttons
function fixVideoButtons(contentElement) {
  const videoButtons = contentElement.querySelectorAll(
    'button[data-bs-toggle="modal"]'
  );

  videoButtons.forEach((button) => {
    // Replace with direct click handler
    const videoUrl = button.getAttribute("data-video");

    // Keep the button working with the existing modal
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Find the existing modal and player
      const videoModal = document.getElementById("videoModal");
      const videoPlayer = document.getElementById("videoPlayer");

      // Set the video URL
      if (videoPlayer && videoUrl) {
        videoPlayer.src = videoUrl;
      }

      // Show the modal using Bootstrap
      if (videoModal && typeof bootstrap !== "undefined") {
        const modal = new bootstrap.Modal(videoModal);
        modal.show();
      } else {
        // Fallback for when Bootstrap is not available
        const modalElement = document.getElementById("videoModal");
        if (modalElement) {
          modalElement.style.display = "block";
          modalElement.classList.add("show");
          document.body.classList.add("modal-open");

          // Create backdrop
          const backdrop = document.createElement("div");
          backdrop.className = "modal-backdrop fade show";
          document.body.appendChild(backdrop);
        }
      }
    });
  });
}

// Function to animate skill bars
function animateSkillBars(contentElement) {
  const progressBars = contentElement.querySelectorAll(".progress-bar");

  progressBars.forEach((bar) => {
    const value = bar.getAttribute("aria-valuenow") || "0";
    bar.style.width = "0%";

    setTimeout(() => {
      bar.style.width = value + "%";
      bar.parentElement.parentElement.classList.add("animate-progress");
    }, 100);
  });
}

// Function to enhance portfolio items
function enhancePortfolioItems(contentElement) {
  // Get portfolio items container
  const portfolioContainer = contentElement.querySelector(".isotope-container");
  if (!portfolioContainer) return;

  // Get all portfolio items
  const portfolioItems = portfolioContainer.querySelectorAll(".portfolio-item");
  if (portfolioItems.length === 0) return;

  // Create enhanced portfolio layout
  const portfolioLayout = document.createElement("div");
  portfolioLayout.className = "enhanced-portfolio";

  // Create portfolio filters
  const filtersContainer = document.createElement("div");
  filtersContainer.className = "portfolio-filters-container text-center mb-4";

  const filtersList = document.createElement("ul");
  filtersList.className = "portfolio-filters list-inline";

  // Add "All" filter
  const allFilterLi = document.createElement("li");
  allFilterLi.className = "list-inline-item filter-active";
  allFilterLi.setAttribute("data-filter", "*");
  allFilterLi.textContent = "All";
  filtersList.appendChild(allFilterLi);

  // Add other filters based on existing classes
  const filterClasses = new Set();
  portfolioItems.forEach((item) => {
    item.classList.forEach((cls) => {
      if (cls.startsWith("filter-") && cls !== "filter-active") {
        filterClasses.add(cls);
      }
    });
  });

  // Create filter items
  filterClasses.forEach((filterClass) => {
    const filterName = filterClass.replace("filter-", "");
    const filterLi = document.createElement("li");
    filterLi.className = "list-inline-item";
    filterLi.setAttribute("data-filter", `.${filterClass}`);
    filterLi.textContent =
      filterName.charAt(0).toUpperCase() + filterName.slice(1);
    filtersList.appendChild(filterLi);
  });

  filtersContainer.appendChild(filtersList);

  // Create portfolio grid
  const portfolioGrid = document.createElement("div");
  portfolioGrid.className = "row g-4 portfolio-grid";

  // Add each portfolio item to the grid
  portfolioItems.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 enhanced-portfolio-item";

    // Add filter classes
    item.classList.forEach((cls) => {
      if (cls.startsWith("filter-")) {
        col.classList.add(cls);
      }
    });

    // Get item content
    const img = item.querySelector("img");
    const title = item.querySelector(".portfolio-info h4")?.textContent || "";
    const description =
      item.querySelector(".portfolio-info p")?.textContent || "";
    const imgSrc = img?.getAttribute("src") || "";

    // Create portfolio card
    col.innerHTML = `
      <div class="portfolio-card">
        <div class="portfolio-img">
          <img src="${imgSrc}" alt="${title}" class="img-fluid">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="bi bi-plus fs-1"></i>
            </div>
          </div>
        </div>
        <div class="portfolio-caption">
          <h4>${title}</h4>
          <p class="text-muted">${description}</p>
        </div>
      </div>
    `;

    // Add lightbox functionality
    col.querySelector(".portfolio-img").addEventListener("click", function () {
      createLightbox(imgSrc, title, description);
    });

    portfolioGrid.appendChild(col);
  });

  // Add filters and grid to layout
  portfolioLayout.appendChild(filtersContainer);
  portfolioLayout.appendChild(portfolioGrid);

  // Replace the original content with enhanced layout
  contentElement.querySelector(".isotope-layout").innerHTML = "";
  contentElement.querySelector(".isotope-layout").appendChild(portfolioLayout);

  // Add filter functionality
  const filterButtons = contentElement.querySelectorAll(
    ".portfolio-filters li"
  );
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("filter-active"));

      // Add active class to clicked button
      this.classList.add("filter-active");

      // Get filter value
      const filterValue = this.getAttribute("data-filter");

      // Show/hide items based on filter
      const items = contentElement.querySelectorAll(".enhanced-portfolio-item");
      items.forEach((item) => {
        if (filterValue === "*") {
          item.style.display = "block";
        } else {
          if (item.classList.contains(filterValue.substring(1))) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        }
      });
    });
  });
}

// Function to create a lightbox for portfolio items
function createLightbox(imgSrc, title, description) {
  // Create lightbox element if it doesn't exist
  let lightbox = document.getElementById("portfolio-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "portfolio-lightbox";
    lightbox.className = "portfolio-lightbox";
    lightbox.innerHTML = `
      <div class="lightbox-container">
        <div class="lightbox-content">
          <img src="" alt="" class="lightbox-image">
          <div class="lightbox-caption">
            <h3></h3>
            <p></p>
          </div>
        </div>
        <button class="lightbox-close"><i class="bi bi-x-lg"></i></button>
      </div>
    `;
    document.body.appendChild(lightbox);

    // Add close functionality
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) {
        lightbox.style.display = "none";
      }
    });
  }

  // Set content
  const lightboxImg = lightbox.querySelector(".lightbox-image");
  lightboxImg.src = imgSrc;
  lightboxImg.alt = title;

  const lightboxTitle = lightbox.querySelector(".lightbox-caption h3");
  lightboxTitle.textContent = title;

  const lightboxDesc = lightbox.querySelector(".lightbox-caption p");
  lightboxDesc.textContent = description;

  // Show lightbox
  lightbox.style.display = "flex";
}

// Function to enhance the skills section with better visualization
function enhanceSkillsSection(contentElement) {
  // Get all skill items
  const progressBars = contentElement.querySelectorAll(".progress");

  if (progressBars.length > 0) {
    // Create category containers
    const technicalSkillsContainer = document.createElement("div");
    technicalSkillsContainer.className = "skill-category";
    const categoryTitle = document.createElement("h3");
    categoryTitle.className = "skill-category-title";
    categoryTitle.textContent = "Technical & Software Skills";
    technicalSkillsContainer.appendChild(categoryTitle);

    // Create grid for skill items
    const skillsGrid = document.createElement("div");
    skillsGrid.className = "skills-grid";

    // Enhance each skill item
    progressBars.forEach((progressBar) => {
      // Extract skill data
      const skillElement = progressBar.querySelector(".skill");
      const skillNameElement = skillElement.querySelector("span");
      const skillValueElement = skillElement.querySelector(".val");

      if (skillNameElement && skillValueElement) {
        const skillName = skillNameElement.textContent.trim();
        const skillValue = skillValueElement.textContent.trim();
        const percentage = parseInt(skillValue) || 0;

        // Create new skill card
        const skillCard = document.createElement("div");
        skillCard.className = "skill-card";

        // Add icon based on skill name
        let iconClass = "bi bi-tools";

        if (skillName.toLowerCase().includes("office")) {
          iconClass = "bi bi-microsoft";
        } else if (skillName.toLowerCase().includes("photoshop")) {
          iconClass = "bi bi-brush";
        } else if (skillName.toLowerCase().includes("maintenance")) {
          iconClass = "bi bi-wrench-adjustable";
        } else if (skillName.toLowerCase().includes("icdl")) {
          iconClass = "bi bi-pc-display";
        } else if (
          skillName.toLowerCase().includes("engineering") ||
          skillName.toLowerCase().includes("works") ||
          skillName.toLowerCase().includes("cattia")
        ) {
          iconClass = "bi bi-layers";
        } else if (skillName.toLowerCase().includes("dynaform")) {
          iconClass = "bi bi-boxes";
        } else if (skillName.toLowerCase().includes("endnote")) {
          iconClass = "bi bi-journal-text";
        } else if (skillName.toLowerCase().includes("lingo")) {
          iconClass = "bi bi-code-square";
        }

        // Build skill card content
        skillCard.innerHTML = `
          <i class="${iconClass} skill-icon"></i>
          <div class="skill-title">${skillName}</div>
          <div class="skill-name">
            <span>Proficiency</span>
            <span class="skill-percentage">${skillValue}</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" style="width: ${percentage}%"></div>
          </div>
        `;

        // Add card to grid
        skillsGrid.appendChild(skillCard);
      }
    });

    // Add grid to category container
    technicalSkillsContainer.appendChild(skillsGrid);

    // Replace original content with enhanced version
    const skillsContentDiv = contentElement.querySelector(".skills-content");
    if (skillsContentDiv) {
      skillsContentDiv.innerHTML = "";
      skillsContentDiv.appendChild(technicalSkillsContainer);

      // Add animation trigger
      setTimeout(() => {
        const progressBars = contentElement.querySelectorAll(".skill-progress");
        progressBars.forEach((bar) => {
          bar.style.width = bar.style.width;
        });
      }, 300);
    }
  }
}

// Function to enhance the portfolio section
function enhancePortfolioSection(contentElement) {
  // Get the isotope container and items
  const container = contentElement.querySelector(".isotope-container");
  const items = contentElement.querySelectorAll(".portfolio-item");

  if (container && items.length > 0) {
    // Create a new portfolio grid
    const portfolioGrid = document.createElement("div");
    portfolioGrid.className = "portfolio-grid";

    // Create filters
    const filters = document.createElement("div");
    filters.className = "portfolio-filters";

    // Add "All" filter
    const allFilter = document.createElement("div");
    allFilter.className = "portfolio-filter active";
    allFilter.setAttribute("data-filter", "*");
    allFilter.textContent = "All";
    filters.appendChild(allFilter);

    // Track unique categories
    const categories = new Set();

    // Process each portfolio item
    items.forEach((item) => {
      // Extract item data
      const category = item.classList.contains("filter-app")
        ? "Universities"
        : item.classList.contains("filter-branding")
        ? "Organizations"
        : item.classList.contains("filter-books")
        ? "Institutes"
        : "Other";

      // Add to categories set
      categories.add(category);

      // Extract image info
      const imgElement = item.querySelector("img");
      const title =
        item.querySelector(".portfolio-info h4")?.textContent || "Project";
      const description =
        item.querySelector(".portfolio-info p")?.textContent || "";
      const imgSrc = imgElement?.getAttribute("src") || "";

      // Create card
      const card = document.createElement("div");
      card.className = "portfolio-item-card";
      card.setAttribute("data-category", category);

      // Build card content
      card.innerHTML = `
        <img src="${imgSrc}" alt="${title}" class="portfolio-img">
        <div class="portfolio-content">
          <span class="portfolio-category">${category}</span>
          <h3 class="portfolio-title">${title}</h3>
          <p class="portfolio-description">${description}</p>
          <div class="portfolio-buttons">
            <button class="portfolio-btn view-btn" data-img="${imgSrc}" data-title="${title}">
              <i class="bi bi-eye"></i> View
            </button>
          </div>
        </div>
      `;

      // Add to grid
      portfolioGrid.appendChild(card);
    });

    // Add filters for each category
    categories.forEach((category) => {
      const filter = document.createElement("div");
      filter.className = "portfolio-filter";
      filter.setAttribute("data-filter", category);
      filter.textContent = category;
      filters.appendChild(filter);
    });

    // Replace original content
    container.parentElement.innerHTML = "";
    container.parentElement.appendChild(filters);
    container.parentElement.appendChild(portfolioGrid);

    // Add event listeners for filters
    const filterButtons =
      container.parentElement.querySelectorAll(".portfolio-filter");
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        this.classList.add("active");

        // Get filter value
        const filterValue = this.getAttribute("data-filter");

        // Filter items
        const cards = container.parentElement.querySelectorAll(
          ".portfolio-item-card"
        );
        cards.forEach((card) => {
          if (
            filterValue === "*" ||
            card.getAttribute("data-category") === filterValue
          ) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });

    // Add lightbox functionality
    const viewButtons = container.parentElement.querySelectorAll(".view-btn");

    // Create lightbox elements
    const lightbox = document.createElement("div");
    lightbox.className = "portfolio-lightbox";
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <img src="" class="lightbox-img" alt="">
        <div class="lightbox-close"><i class="bi bi-x"></i></div>
        <div class="lightbox-caption"></div>
      </div>
    `;
    container.parentElement.appendChild(lightbox);

    // Add click event to view buttons
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const imgSrc = this.getAttribute("data-img");
        const title = this.getAttribute("data-title");

        // Set lightbox content
        const lightboxImg = lightbox.querySelector(".lightbox-img");
        const lightboxCaption = lightbox.querySelector(".lightbox-caption");

        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = title;

        // Show lightbox
        lightbox.classList.add("active");
      });
    });

    // Close lightbox on click
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) {
        lightbox.classList.remove("active");
      }
    });
  }
}

// Function to enhance videos section
function enhanceVideosSection(contentElement) {
  // Get all video cards
  const videoCards = contentElement.querySelectorAll(".video-card");

  if (videoCards.length > 0) {
    videoCards.forEach((card) => {
      // Get video button
      const videoButton = card.querySelector('button[data-bs-toggle="modal"]');
      if (videoButton) {
        // Replace modal attribute with direct click handler
        const videoUrl = videoButton.getAttribute("data-video");
        videoButton.removeAttribute("data-bs-toggle");
        videoButton.removeAttribute("data-bs-target");

        // Add new click event
        videoButton.addEventListener("click", function (e) {
          e.preventDefault();

          // Get video title and description
          const videoTitle = card.querySelector(".card-title").textContent;
          const videoDesc = card.querySelector(".card-text").textContent;

          // Create and show an enhanced video modal
          showEnhancedVideoModal(videoUrl, videoTitle, videoDesc);
        });
      }
    });
  }
}

// Function to show enhanced video modal
function showEnhancedVideoModal(videoUrl, title, description) {
  // Check if modal exists, if not create it
  let videoModal = document.getElementById("enhancedVideoModal");

  if (!videoModal) {
    // Create new modal
    videoModal = document.createElement("div");
    videoModal.className = "modal fade enhanced-video-modal";
    videoModal.id = "enhancedVideoModal";
    videoModal.tabIndex = "-1";
    videoModal.setAttribute("aria-labelledby", "enhancedVideoModalLabel");
    videoModal.setAttribute("aria-hidden", "true");

    videoModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="enhancedVideoModalLabel">
              <i class="bi bi-play-circle"></i> <span></span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="ratio ratio-16x9">
              <iframe id="enhancedVideoPlayer" src="" frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
            </div>
            <div class="video-info">
              <p class="video-description"></p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(videoModal);

    // Initialize Bootstrap modal
    const bsVideoModal = new bootstrap.Modal(videoModal);

    // Add event listener to stop video when modal is hidden
    videoModal.addEventListener("hidden.bs.modal", function () {
      document.getElementById("enhancedVideoPlayer").src = "";
    });
  }

  // Set video properties
  document.querySelector("#enhancedVideoModalLabel span").textContent = title;
  document.querySelector(".video-description").textContent = description;
  document.getElementById("enhancedVideoPlayer").src = videoUrl;

  // Show modal
  bootstrap.Modal.getInstance(videoModal) || new bootstrap.Modal(videoModal);
  bootstrap.Modal.getInstance(videoModal).show();
}

// Function to update active navigation link
function updateActiveNavLink(sectionId) {
  // Remove active class from all nav links
  document.querySelectorAll(".navmenu a").forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to current section's nav link
  const activeLink = document.querySelector(`.navmenu a[href="#${sectionId}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).replace(/-/g, " ");
}

// Function to initialize window layout
function initWindowLayout() {
  console.log("Initializing window layout"); // Debug log

  // Get all sections to convert
  const sections = [
    {
      id: "about",
      title: "About",
      icon: "bi bi-person",
      description: "Professional background and personal information",
    },
    {
      id: "stats",
      title: "Statistics",
      icon: "bi bi-bar-chart",
      description: "Academic achievements and affiliations",
    },
    {
      id: "skills",
      title: "Skills",
      icon: "bi bi-tools",
      description: "Professional competencies and expertise",
    },
    {
      id: "resume",
      title: "Resume",
      icon: "bi bi-file-earmark-text",
      description: "Professional experience and education",
    },
    {
      id: "portfolio",
      title: "Portfolio",
      icon: "bi bi-images",
      description: "Academic projects and research work",
    },
    {
      id: "videos",
      title: "Videos",
      icon: "bi bi-camera-video",
      description: "Educational and research videos",
    },
    {
      id: "supervision",
      title: "Supervision",
      icon: "bi bi-people",
      description: "Student supervision and mentorship",
    },
    {
      id: "course-lectures",
      title: "Course Lectures",
      icon: "bi bi-mortarboard",
      description: "Educational materials and lectures",
    },
  ];

  // Check if window container already exists
  if (document.getElementById("section-windows")) {
    console.log("Window container already exists, skipping initialization");
    return;
  }

  // Create window container
  const windowContainer = document.createElement("div");
  windowContainer.className = "container window-container";
  windowContainer.id = "section-windows";

  // Add title for the window container
  const containerTitle = document.createElement("h2");
  containerTitle.className = "text-center mb-4";
  windowContainer.appendChild(containerTitle);

  // Create window sections
  sections.forEach((section) => {
    if (document.getElementById(section.id)) {
      const windowSection = document.createElement("div");
      windowSection.className = "window-section";
      windowSection.setAttribute("data-section", section.id);

      // Window header
      const header = document.createElement("div");
      header.className = "window-header";

      const title = document.createElement("h3");
      title.textContent = section.title;

      const controls = document.createElement("div");
      controls.className = "window-controls";

      const close = document.createElement("div");
      close.className = "window-control window-close";

      const minimize = document.createElement("div");
      minimize.className = "window-control window-minimize";

      const maximize = document.createElement("div");
      maximize.className = "window-control window-maximize";

      controls.appendChild(close);
      controls.appendChild(minimize);
      controls.appendChild(maximize);

      header.appendChild(title);
      header.appendChild(controls);

      // Window preview
      const preview = document.createElement("div");
      preview.className = "window-preview";

      const icon = document.createElement("i");
      icon.className = section.icon;

      const previewTitle = document.createElement("h4");
      previewTitle.textContent = section.title;

      const previewText = document.createElement("p");
      previewText.textContent = section.description;

      preview.appendChild(icon);
      preview.appendChild(previewTitle);
      preview.appendChild(previewText);

      // Build window section
      windowSection.appendChild(header);
      windowSection.appendChild(preview);

      windowContainer.appendChild(windowSection);
    }
  });

  // Add window container to page
  const main = document.querySelector(".main");
  const hero = document.getElementById("hero");

  if (main && hero) {
    main.insertBefore(windowContainer, hero.nextSibling);
    console.log("Window container added to page");
  } else {
    console.error("Could not find main or hero section");
  }

  // Hide original sections (but keep them for content)
  sections.forEach((section) => {
    const sectionElement = document.getElementById(section.id);
    if (sectionElement) {
      sectionElement.style.display = "none";
    }
  });

  // Setup interactions after window layout is initialized
  setupWindowInteractions();
}

// Initialize window layout after page loads
window.addEventListener("load", initWindowLayout);

// Add animation for skills when section becomes visible
document.addEventListener("DOMContentLoaded", function () {
  // Original setupWindowInteractions function remains unchanged

  // Add observer to animate skills when they come into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBars = entry.target.querySelectorAll(".skill-progress");
          if (skillBars.length > 0) {
            skillBars.forEach((bar, index) => {
              setTimeout(() => {
                const percentage = bar.getAttribute("data-percentage");
                bar.style.width = percentage + "%";
              }, index * 100);
            });
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  // Observe skills sections
  const skillsSections = document.querySelectorAll(".skills-content");
  skillsSections.forEach((section) => {
    observer.observe(section);
  });
});
