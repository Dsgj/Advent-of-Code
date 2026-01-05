/**
 * Common functionality for Advent of Code visualizations
 */

const Common = {
  /**
   * Sets up a standardized Input Modal for the puzzle.
   * @param {Object} options - Configuration options
   * @param {string} options.placeholder - Placeholder text for the textarea
   * @param {string} options.exampleInput - The example input string
   * @param {Function} options.onLoad - Callback function(inputString) called when data is loaded
   * @param {string} options.storageKey - localStorage key to save/load input
   */
  setupInputModal: function (options) {
    // 1. Check if modal exists, if not inject it
    let modalOverlay = document.getElementById("inputModal");

    if (!modalOverlay) {
      const modalHTML = `
            <div class="modal-overlay" id="inputModal">
                <div class="modal">
                    <div class="modal-header">
                        PUZZLE INPUT
                        <button class="btn-modal" id="closeModalBtn">×</button>
                    </div>
                    <div class="modal-body">
                        <label>Paste your puzzle input below:</label>
                        <textarea id="modalInputArea" placeholder="${
                          options.placeholder || "Paste input here..."
                        }"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-modal" id="useExampleBtn">Use Example</button>
                        <button class="btn-modal btn-primary" id="useCustomBtn">Load Data</button>
                    </div>
                </div>
            </div>`;
      document.body.insertAdjacentHTML("beforeend", modalHTML);
      modalOverlay = document.getElementById("inputModal");
    }

    // 2. Get Elements
    const modalInputArea = document.getElementById("modalInputArea");
    const inputBtn = document.getElementById("inputBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const useExampleBtn = document.getElementById("useExampleBtn");
    const useCustomBtn = document.getElementById("useCustomBtn");

    // 3. Bind Events

    // Open Modal
    if (inputBtn) {
      inputBtn.addEventListener("click", () => {
        // Always open with empty textarea - user must paste or use example
        modalInputArea.value = "";
        modalOverlay.classList.add("active"); // Use class for display
      });
    }

    // Close Modal Helper
    const closeModal = () => {
      modalOverlay.classList.remove("active");
    };

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

    // Close on Overlay Click
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Use Example
    if (useExampleBtn && options.exampleInput) {
      useExampleBtn.addEventListener("click", () => {
        // Clear textarea to indicate we are using internal example
        modalInputArea.value = "";

        if (typeof options.onLoad === "function") {
          options.onLoad(options.exampleInput);
        }

        closeModal();

        // Update badge
        const badge = document.getElementById("inputBadge");
        if (badge) {
          badge.textContent = "EX";
          badge.classList.remove("custom");
        }
      });
    }

    // Load Custom Data
    if (useCustomBtn) {
      useCustomBtn.addEventListener("click", () => {
        const input = modalInputArea.value;
        if (!input.trim()) {
          alert("Please paste your input first.");
          return;
        }

        if (options.storageKey) {
          localStorage.setItem(options.storageKey, input);
        }

        if (typeof options.onLoad === "function") {
          options.onLoad(input);
        }

        closeModal();

        // Update badge
        const badge = document.getElementById("inputBadge");
        if (badge) {
          badge.textContent = "MY";
          badge.classList.add("custom");
        }
      });
    }
  },
  getInput: function (key, defaultValue) {
    return localStorage.getItem(key) || defaultValue;
  },
};
