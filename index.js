let isFormInitialized = false;

function showRegisterForm() {
    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.register-form').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetForm();
}

function hideRegisterForm() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.register-form').style.display = 'none';
    document.body.style.overflow = '';
    // Don't reset form when hiding, keep the message if needed
    // resetForm();
}

function resetForm() {
    const fileInput = document.getElementById('image');
    const fileName = document.getElementById('fileName');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const form = document.querySelector('.form-container');
    const messageDiv = document.getElementById('form-message');
    
    fileInput.value = '';
    fileName.textContent = 'Click to upload image';
    imagePreview.innerHTML = '';
    imagePreviewContainer.style.display = 'none';
    
    if (form) form.reset();
    
    // Only clear message on form reset if not showing success
    if (messageDiv) {
        const currentMessage = messageDiv.querySelector('.message');
        if (!currentMessage || !currentMessage.classList.contains('success')) {
            messageDiv.innerHTML = '';
            messageDiv.className = '';
        }
    }
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
    }
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];
    
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.innerHTML = '';
        messageDiv.className = '';
    }
    
    if (!name) {
        showMessage('Please enter your full name', 'error');
        document.getElementById('name').focus();
        return false;
    }
    
    if (!email) {
        showMessage('Please enter your email', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        document.getElementById('email').focus();
        return false;
    }
    
    if (!file) {
        showMessage('Please select a profile image', 'error');
        document.getElementById('uploadTrigger').focus();
        return false;
    }
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        showMessage('Please select a valid image (JPEG, PNG, GIF, or WebP)', 'error');
        return false;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showMessage('Image size must be less than 5MB', 'error');
        return false;
    }
    
    return true;
}

function showMessage(text, type = 'info') {
    const messageDiv = document.getElementById('form-message');
    if (!messageDiv) return;
    
    messageDiv.innerHTML = `
        <div class="message ${type}">
            ${type === 'success' ? '✅' : '❌'} ${text}
        </div>
    `;
    
    // Don't auto-clear success messages, they'll be cleared when form opens again
    // if (type === 'success') {
    //     setTimeout(() => {
    //         if (messageDiv.innerHTML.includes(text)) {
    //             messageDiv.innerHTML = '';
    //         }
    //     }, 5000);
    // }
}

function handleServerResponse(response, status) {
    const messageDiv = document.getElementById('form-message');
    if (!messageDiv) return;
    
    try {
        const data = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (status >= 200 && status < 300) {
            if (data.success) {
                showMessage('Your application has been submitted successfully!', 'success');
                setTimeout(() => {
                    hideRegisterForm();
                    // Reset form after hiding
                    setTimeout(() => resetForm(), 100);
                }, 3000);
            } else {
                const errorMsg = data.message || data.error || 'Application failed';
                showMessage(errorMsg, 'error');
            }
        } else {
            const errorMsg = data.message || data.error || `Server error (${status})`;
            showMessage(errorMsg, 'error');
        }
    } catch (error) {
        console.error('Failed to parse response:', error);
        showMessage('Unexpected server response', 'error');
    }
}

function initializeRegisterForm() {
    if (isFormInitialized) {
        console.log('Form already initialized, skipping...');
        return;
    }
    
    console.log('Initializing register form with HTMX...');
    
    const overlay = document.querySelector('.overlay');
    const fileInput = document.getElementById('image');
    const fileName = document.getElementById('fileName');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const form = document.querySelector('.form-container');
    const closeBtn = document.querySelector('.close-btn');
    const registerForm = document.querySelector('.register-form');
    
    overlay.addEventListener('click', function(e) {
        e.preventDefault();
        hideRegisterForm();
        setTimeout(() => resetForm(), 100);
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideRegisterForm();
            setTimeout(() => resetForm(), 100);
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    const uploadTrigger = document.getElementById('uploadTrigger');
    const newUploadTrigger = uploadTrigger.cloneNode(true);
    uploadTrigger.parentNode.replaceChild(newUploadTrigger, uploadTrigger);
    
    const fixedUploadTrigger = newUploadTrigger;
    
    fixedUploadTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imagePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    removeImageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.value = '';
        fileName.textContent = 'Click to upload image';
        imagePreview.innerHTML = '';
        imagePreviewContainer.style.display = 'none';
    });
    
    if (form) {
        form.addEventListener('htmx:beforeRequest', function(e) {
            const messageDiv = document.getElementById('form-message');
            if (messageDiv) {
                // Clear any existing messages
                messageDiv.innerHTML = '';
                messageDiv.className = '';
                
                // Show loading message
                messageDiv.innerHTML = `
                    <div class="message info">
                        ⏳ Submitting your application...
                    </div>
                `;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn?.querySelector('.btn-text');
            const indicator = submitBtn?.querySelector('.htmx-indicator');
            
            if (btnText && indicator) {
                btnText.style.display = 'none';
                indicator.style.display = 'inline-block';
                submitBtn.disabled = true;
            }
        });
        
        form.addEventListener('htmx:beforeSwap', function(e) {
            const xhr = e.detail.xhr;
            const response = xhr.responseText;
            const status = xhr.status;
            
            const contentType = xhr.getResponseHeader('Content-Type') || '';
            if (contentType.includes('application/json')) {
                handleServerResponse(response, status);
                
                e.detail.shouldSwap = false;
                
                const submitBtn = document.getElementById('submitBtn');
                const btnText = submitBtn?.querySelector('.btn-text');
                const indicator = submitBtn?.querySelector('.htmx-indicator');
                
                if (btnText && indicator) {
                    btnText.style.display = 'inline-block';
                    indicator.style.display = 'none';
                    submitBtn.disabled = false;
                }
            }
        });
        
        form.addEventListener('htmx:sendError', function(e) {
            console.error('HTMX Send Error:', e.detail);
            
            const messageDiv = document.getElementById('form-message');
            if (messageDiv) {
                messageDiv.innerHTML = `
                    <div class="message error">
                        ❌ Network error. Please check your connection.
                    </div>
                `;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn?.querySelector('.btn-text');
            const indicator = submitBtn?.querySelector('.htmx-indicator');
            
            if (btnText && indicator) {
                btnText.style.display = 'inline-block';
                indicator.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
        
        form.addEventListener('htmx:timeout', function(e) {
            const messageDiv = document.getElementById('form-message');
            if (messageDiv) {
                messageDiv.innerHTML = `
                    <div class="message error">
                        ❌ Request timeout. Please try again.
                    </div>
                `;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn?.querySelector('.btn-text');
            const indicator = submitBtn?.querySelector('.htmx-indicator');
            
            if (btnText && indicator) {
                btnText.style.display = 'inline-block';
                indicator.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
    
    isFormInitialized = true;
    console.log('Register form with HTMX initialized successfully');
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeRegisterForm();
    }, 100);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideRegisterForm();
            setTimeout(() => resetForm(), 100);
        }
    });
});

window.showRegisterForm = showRegisterForm;
window.hideRegisterForm = hideRegisterForm;
window.resetRegisterForm = resetForm;


document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeBtn = document.querySelector('.mobile-nav .close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const mobileContactBtn = document.querySelector('.mobile-contact-btn');
    
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (mobileNavLinks) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    

    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            hamburgerBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (mobileNav) {
        mobileNav.addEventListener('click', function(e) {
            if (e.target === mobileNav) {
                mobileNav.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

