// Hospital Management System Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Enable tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Enable popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // File upload handling
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            const fileInput = document.getElementById('document');
            if (fileInput && fileInput.files.length > 0) {
                // Show loading state
                document.getElementById('uploadBtn').disabled = true;
                document.getElementById('uploadSpinner').classList.remove('d-none');
                document.getElementById('uploadText').textContent = 'Uploading...';
            }
        });
    }

    // Document upload drag and drop area
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('document');
    
    if (uploadArea && fileInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadArea.classList.add('bg-light');
        }
        
        function unhighlight() {
            uploadArea.classList.remove('bg-light');
        }
        
        uploadArea.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            
            // Update file name display
            const fileNameDisplay = document.getElementById('fileName');
            if (fileNameDisplay && files.length > 0) {
                fileNameDisplay.textContent = files[0].name;
            }
        }
        
        // Click on upload area to trigger file input
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Update file name display when file is selected
        fileInput.addEventListener('change', function() {
            const fileNameDisplay = document.getElementById('fileName');
            if (fileNameDisplay && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
            }
        });
    }

    // Document analysis - toggle between original and simplified content
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', function() {
            const originalContent = document.getElementById('originalContent');
            const simplifiedContent = document.getElementById('simplifiedContent');
            
            if (originalContent.classList.contains('d-none')) {
                originalContent.classList.remove('d-none');
                simplifiedContent.classList.add('d-none');
                this.textContent = 'View Simplified Version';
            } else {
                originalContent.classList.add('d-none');
                simplifiedContent.classList.remove('d-none');
                this.textContent = 'View Original';
            }
        });
    }

    // Medical terms tooltips
    const medicalTerms = document.querySelectorAll('.medical-term');
    medicalTerms.forEach(term => {
        const definition = term.getAttribute('data-definition');
        if (definition) {
            new bootstrap.Tooltip(term, {
                title: definition,
                placement: 'top',
                html: true
            });
        }
    });

    // Appointment status update
    const statusForms = document.querySelectorAll('.status-update-form');
    statusForms.forEach(form => {
        const statusSelect = form.querySelector('select[name="status"]');
        if (statusSelect) {
            statusSelect.addEventListener('change', function() {
                form.submit();
            });
        }
    });

    // Password strength meter
    const passwordInput = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    
    if (passwordInput && passwordStrength) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            // Check password length
            if (password.length >= 8) strength += 25;
            
            // Check for lowercase letters
            if (/[a-z]/.test(password)) strength += 25;
            
            // Check for uppercase letters
            if (/[A-Z]/.test(password)) strength += 25;
            
            // Check for numbers or special characters
            if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
            
            // Update progress bar
            passwordStrength.style.width = strength + '%';
            
            // Update color based on strength
            if (strength < 50) {
                passwordStrength.className = 'progress-bar bg-danger';
            } else if (strength < 75) {
                passwordStrength.className = 'progress-bar bg-warning';
            } else {
                passwordStrength.className = 'progress-bar bg-success';
            }
        });
    }

    // Password confirmation validation
    const confirmPasswordInput = document.getElementById('confirm_password');
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value !== passwordInput.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Date picker initialization
    const datePickers = document.querySelectorAll('.datepicker');
    datePickers.forEach(picker => {
        // Using native date input
        picker.setAttribute('min', new Date().toISOString().split('T')[0]);
    });
});

// Function to analyze document with progress indication
function analyzeDocument(documentId) {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const progressContainer = document.getElementById('analysisProgress');
    
    if (analyzeBtn && progressContainer) {
        // Disable button and show progress
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';
        progressContainer.classList.remove('d-none');
        
        // Submit the form
        document.getElementById('analyzeForm').submit();
    }
}

// Function to format medical term definitions in analysis results
function formatMedicalTerms() {
    const analysisContent = document.getElementById('analysisContent');
    if (!analysisContent) return;
    
    try {
        const analysisData = JSON.parse(analysisContent.getAttribute('data-analysis'));
        const keyTerms = analysisData.key_terms || [];
        
        // Find all terms in the document and add tooltips
        if (keyTerms.length > 0) {
            const textElements = document.querySelectorAll('.simplified-content p, .simplified-content li');
            textElements.forEach(element => {
                let html = element.innerHTML;
                
                keyTerms.forEach(termObj => {
                    const term = termObj.term;
                    const meaning = termObj.meaning;
                    
                    // Create a regex to find the term but avoid already tagged terms
                    const regex = new RegExp(`(?<!<[^>]*)(${term})(?![^<]*>)`, 'gi');
                    
                    // Replace with term with tooltip
                    html = html.replace(regex, `<span class="medical-term" data-bs-toggle="tooltip" title="${meaning}">$1</span>`);
                });
                
                element.innerHTML = html;
            });
            
            // Reinitialize tooltips
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('.medical-term[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function(tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    } catch (e) {
        console.error('Error formatting medical terms:', e);
    }
}

// Call format medical terms when document is ready
document.addEventListener('DOMContentLoaded', formatMedicalTerms);
