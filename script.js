// Initialize Bootstrap components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Initialize carousel
    var carousel = new bootstrap.Carousel(document.getElementById('heroCarousel'), {
        interval: 5000,
        wrap: true
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add scroll animation for quick link cards
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.quick-link-card').forEach(card => {
        observer.observe(card);
    });

    // Handle application form submission
    function submitApplication() {
        // Get form values
        const name = document.getElementById('name').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const email = document.getElementById('email').value.trim();
        const program = document.getElementById('program').value;
        const query = document.getElementById('query').value.trim();

        // Validate form
        if (!name || !mobile || !email || !program) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all required fields marked with *'
            });
            return;
        }

        // Validate mobile number format
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Mobile Number',
                text: 'Please enter a valid 10-digit mobile number'
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address'
            });
            return;
        }

        // Hide the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('applyNowModal'));
        modal.hide();

        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Application Submitted Successfully!',
            html: `
                <p>Thank you for your interest in Vel Tech University!</p>
                <p>We have received your application and our team will get in touch with you shortly.</p>
                <p>Your application details:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Program:</strong> ${program.toUpperCase()}</li>
                    <li><strong>Reference ID:</strong> VT${Date.now().toString().slice(-6)}</li>
                </ul>
            `,
            confirmButtonText: 'OK',
            allowOutsideClick: false
        });

        // Clear form
        document.getElementById('applicationForm').reset();
    }

    // Add hover effect to campus life cards
    const cards = document.querySelectorAll('.hover-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add sticky navbar on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('sticky-top');
    } else {
        navbar.classList.remove('sticky-top');
    }
});
