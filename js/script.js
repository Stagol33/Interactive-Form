// script.js - Full Stack Conference Registration Form

// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
	// Test the connection between HTML and JS
	console.log('Test');

	// DOM Elements - Store frequently used elements
	const form = document.querySelector('form');
	const nameInput = document.getElementById('name');
	const emailInput = document.getElementById('email');
	const titleSelect = document.getElementById('title');
	const otherJobRole = document.getElementById('other-job-role');
	const designSelect = document.getElementById('design');
	const colorSelect = document.getElementById('color');
	const activitiesFieldset = document.getElementById('activities');
	const activitiesBox = document.getElementById('activities-box');
	const activitiesCheckboxes = document.querySelectorAll('#activities-box input[type="checkbox"]');
	const activitiesCost = document.getElementById('activities-cost');
	const paymentSelect = document.getElementById('payment');
	const creditCardDiv = document.getElementById('credit-card');
	const paypalDiv = document.getElementById('paypal');
	const bitcoinDiv = document.getElementById('bitcoin');
	const ccNum = document.getElementById('cc-num');
	const zipCode = document.getElementById('zip');
	const cvv = document.getElementById('cvv');

	// Set focus on the name field when the page loads
	nameInput.focus();

	// Hide "Other job role" field by default
	otherJobRole.style.display = 'none';

	// Job Role Section - Show/hide other job field based on selection
	titleSelect.addEventListener('change', (e) => {
		if (e.target.value === 'other') {
			otherJobRole.style.display = 'block';
		} else {
			otherJobRole.style.display = 'none';
		}
	});

	// T-Shirt Info Section
	// Disable color select until a design is chosen
	colorSelect.disabled = true;

	// Function to filter color options based on selected design
	designSelect.addEventListener('change', (e) => {
		colorSelect.disabled = false;
		
		const selectedTheme = e.target.value;
		const colorOptions = colorSelect.querySelectorAll('option');
		
		// Hide the default option
		colorOptions[0].hidden = true;
		
		// Filter color options based on selected theme
		colorOptions.forEach(option => {
		const optionTheme = option.getAttribute('data-theme');
		
		if (optionTheme === selectedTheme) {
			option.hidden = false;
			// Select the first available color for the theme
			if (!colorSelect.value || colorSelect.value === colorOptions[0].value) {
				option.selected = true;
			}
		} else if (optionTheme) { // Skip the default option which has no data-theme
			option.hidden = true;
			option.selected = false;
		}
		});
	});

	// Activities Section - Calculate and update total cost
	let totalCost = 0;

	activitiesFieldset.addEventListener('change', (e) => {
		const clicked = e.target;
		
		// Only process if a checkbox was clicked
		if (clicked.type === 'checkbox') {
		const dataCost = parseInt(clicked.getAttribute('data-cost'));
		
		// Update total cost based on checkbox state
		if (clicked.checked) {
			totalCost += dataCost;
		} else {
			totalCost -= dataCost;
		}
		
		// Update cost display
		activitiesCost.textContent = `Total: $${totalCost}`;
		}
	});

	// Payment Info Section
	// Set credit card as default payment method
	paymentSelect.value = 'credit-card';
	paypalDiv.style.display = 'none';
	bitcoinDiv.style.display = 'none';

	// Show selected payment method only
	paymentSelect.addEventListener('change', (e) => {
		// Hide all payment sections
		creditCardDiv.style.display = 'none';
		paypalDiv.style.display = 'none';
		bitcoinDiv.style.display = 'none';
		
		// Show only the selected payment method
		const selectedPayment = e.target.value;
		if (selectedPayment === 'credit-card') {
			creditCardDiv.style.display = 'block';
		} else if (selectedPayment === 'paypal') {
			paypalDiv.style.display = 'block';
		} else if (selectedPayment === 'bitcoin') {
			bitcoinDiv.style.display = 'block';
		}
	});

	// Form validation helper functions

	// Validate name field - can't be blank
	const isValidName = () => {
		return nameInput.value.trim() !== '';
	};

	// Validate email with regex
	const isValidEmail = () => {
		const emailRegex = /^[^@]+@[^@.]+\.[a-z]+$/i;
		return emailRegex.test(emailInput.value);
	};

	// Validate at least one activity is selected
	const isValidActivities = () => {
		return totalCost > 0;
	};

	// Credit card validation functions
	const isValidCardNumber = () => {
		const ccRegex = /^\d{13,16}$/;
		return ccRegex.test(ccNum.value.trim());
	};

	const isValidZip = () => {
		const zipRegex = /^\d{5}$/;
		return zipRegex.test(zipCode.value.trim());
	};

	const isValidCVV = () => {
		const cvvRegex = /^\d{3}$/;
		return cvvRegex.test(cvv.value.trim());
	};

	// Helper functions to show/hide validation errors
	const showValidationError = (element, show) => {
		const parentElement = element.parentElement;
		if (show) {
			parentElement.classList.add('not-valid');
			parentElement.classList.remove('valid');
			parentElement.lastElementChild.style.display = 'block';
		} else {
			parentElement.classList.add('valid');
			parentElement.classList.remove('not-valid');
			parentElement.lastElementChild.style.display = 'none';
		}
	};

	// For activities fieldset, the structure is different
	const showActivitiesError = (show) => {
		if (show) {
			activitiesBox.classList.add('not-valid');
			activitiesBox.classList.remove('valid');
			document.getElementById('activities-hint').style.display = 'block';
		} else {
			activitiesBox.classList.add('valid');
			activitiesBox.classList.remove('not-valid');
			document.getElementById('activities-hint').style.display = 'none';
		}
	};

	// Real-time validation for better user experience
	nameInput.addEventListener('blur', () => {
		showValidationError(nameInput, !isValidName());
	});

	emailInput.addEventListener('blur', () => {
		showValidationError(emailInput, !isValidEmail());
	});

	// Add accessibility features to activities checkboxes
	activitiesCheckboxes.forEach(checkbox => {
		// Focus event adds focus class to parent label
		checkbox.addEventListener('focus', (e) => {
			e.target.parentElement.classList.add('focus');
		});
		
		// Blur event removes focus class
		checkbox.addEventListener('blur', (e) => {
			e.target.parentElement.classList.remove('focus');
		});
	});

	// Form submission validation
	form.addEventListener('submit', (e) => {
		// Validate each required field
		let formValid = true;
		
		// Name validation
		if (!isValidName()) {
			showValidationError(nameInput, true);
			formValid = false;
		} else {
			showValidationError(nameInput, false);
		}
		
		// Email validation
		if (!isValidEmail()) {
			showValidationError(emailInput, true);
			formValid = false;
		} else {
			showValidationError(emailInput, false);
		}
		
		// Activities validation
		if (!isValidActivities()) {
			showActivitiesError(true);
			formValid = false;
		} else {
			showActivitiesError(false);
		}
		
		// Credit card validation (only if credit card is selected)
		if (paymentSelect.value === 'credit-card') {
			// Card number validation
			if (!isValidCardNumber()) {
				showValidationError(ccNum, true);
				formValid = false;
			} else {
				showValidationError(ccNum, false);
			}
			
			// Zip code validation
			if (!isValidZip()) {
				showValidationError(zipCode, true);
				formValid = false;
			} else {
				showValidationError(zipCode, false);
			}
			
			// CVV validation
			if (!isValidCVV()) {
				showValidationError(cvv, true);
				formValid = false;
			} else {
				showValidationError(cvv, false);
			}
		}
		
		// If form is not valid, prevent submission
		if (!formValid) {
			e.preventDefault();
		}
	});
});