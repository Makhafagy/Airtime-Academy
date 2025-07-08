<template>
  <div class="company-info-container">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
      <!-- About / Terms -->
      <div>
        <h3 class="company-heading">Company</h3>
        <ul class="company-list">
          <li><a href="#" class="company-link">About Us</a></li>
          <li><a href="#" class="company-link">Terms & Conditions</a></li>
          <li><a href="#" class="company-link">Privacy Policy</a></li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div>
        <h3 class="company-heading">Contact</h3>
        <ul class="company-list">
          <li>Email: <a href="mailto:info@airtimeaviation.com" class="company-link">info@airtimeaviation.com</a></li>
          <li>Phone: <a href="tel:+5623365331" class="company-link">(562) 336-5331</a></li>
          <li>Address: 123 Sky Lane, Flight City, CA</li>
        </ul>
      </div>

      <!-- Social Media -->
      <div>
        <h3 class="company-heading">Follow Us</h3>
        <div class="flex gap-4 mt-2">
          <a href="#" class="social-icon" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="social-icon" aria-label="Facebook">
            <i class="fab fa-facebook"></i>
          </a>
          <a href="#" class="social-icon" aria-label="LinkedIn">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>

    <p class="text-center text-sm text-gray-500 mt-8">© {{ new Date().getFullYear() }} Airtime Aviation. All rights reserved.</p>
  </div>
</template>

<script setup></script>
