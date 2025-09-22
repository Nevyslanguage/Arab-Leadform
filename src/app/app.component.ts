import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { COUNTRIES, Country } from './countries';
import { getMaxDigitsForCountry } from './country-digit-limits';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'arableadform';
  leadForm: FormGroup;
  selectedTimeSlots: any[] = [];
  selectedCountryCode = '+963'; // Default to Syria
  showCountryDropdown = false;
  countrySearchTerm = '';
  filteredCountries: any[] = [];

  countryCodes: Country[] = COUNTRIES;

  timeSlots = {
    '9am-11am': [
      { value: '9:00-9:30', label: '9:00 - 9:30 صباحًا' },
      { value: '9:30-10:00', label: '9:30 - 10:00 صباحًا' },
      { value: '10:30-11:00', label: '10:30 - 11:00 صباحًا' },
      { value: '10:00-10:30', label: '10:00 - 10:30 صباحًا' }
    ],
    '11am-2pm': [
      { value: '11:00-11:30', label: '11:00 - 11:30 صباحًا' },
      { value: '11:30-12:00', label: '11:30 - 12:00 ظهرًا' },
      { value: '12:30-1:00', label: '12:30 - 1:00 ظهرًا' },
      { value: '12:00-12:30', label: '12:00 - 12:30 ظهرًا' },
      { value: '1:30-2:00', label: '1:30 - 2:00 ظهرًا' },
      { value: '1:00-1:30', label: '1:00 - 1:30 ظهرًا' }
    ],
    '2pm-5pm': [
      { value: '2:30-3:00', label: '2:30 - 3:00 مساءً' },
      { value: '2:00-2:30', label: '2:00 - 2:30 مساءً' },
      { value: '3:30-4:00', label: '3:30 - 4:00 مساءً' },
      { value: '3:00-3:30', label: '3:00 - 3:30 مساءً' },
      { value: '4:30-5:00', label: '4:30 - 5:00 مساءً' },
      { value: '4:00-4:30', label: '4:00 - 4:30 مساءً' }
    ],
    '5pm-9pm': [
      { value: '5:30-6:00', label: '5:30 - 6:00 مساءً' },
      { value: '5:00-5:30', label: '5:00 - 5:30 مساءً' },
      { value: '6:30-7:00', label: '6:30 - 7:00 مساءً' },
      { value: '6:00-6:30', label: '6:00 - 6:30 مساءً' },
      { value: '7:30-8:00', label: '7:30 - 8:00 مساءً' },
      { value: '7:00-7:30', label: '7:00 - 7:30 مساءً' },
      { value: '8:30-9:00', label: '8:30 - 9:00 مساءً' },
      { value: '8:00-8:30', label: '8:00 - 8:30 مساءً' }
    ]
  };

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.leadForm = this.fb.group({
      englishLessonsHistory: ['', Validators.required],
      levelPreference: ['', Validators.required],
      availability: ['', Validators.required],
      specificTimeSlot: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, this.canadianPhoneValidator]],
      whatsappSame: ['', Validators.required],
      whatsappNumber: [''],
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      province: ['', Validators.required],
      campaignName: [''],
      adsetName: [''],
      adName: [''],
      fbClickId: ['']
    });

   //changes in availability to update time slots
    this.leadForm.get('availability')?.valueChanges.subscribe(value => {
      this.updateTimeSlots(value);
      console.log("Time slot value,,....", value);
      
      // Reset specific time slot when availability changes
      this.leadForm.get('specificTimeSlot')?.setValue('');
    });

    // Listen for changes in WhatsApp same as phone to update validation
    this.leadForm.get('whatsappSame')?.valueChanges.subscribe(value => {
      this.updateWhatsAppValidation(value);
    });
  }

  ngOnInit() {
    this.extractUrlParameters();
    // Ensure the country code display is properly initialized
    this.selectedCountryCode = '+963'; // Default to Syria
  }

  extractUrlParameters() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Extract Facebook campaign parameters
    const campaignName = urlParams.get('Campaign_name') || urlParams.get('campaign_name') || '';
    const adsetName = urlParams.get('Adset_name') || urlParams.get('adset_name') || '';
    const adName = urlParams.get('Ad_name') || urlParams.get('ad_name') || '';
    const fbClickId = urlParams.get('fbclid') || '';
    
    // Auto-populate the hidden form fields
    this.leadForm.patchValue({
      campaignName: campaignName,
      adsetName: adsetName,
      adName: adName,
      fbClickId: fbClickId
    });
    
    // Log for debugging (remove in production)
    console.log('Facebook Campaign Parameters:', {
      campaignName,
      adsetName,
      adName,
      fbClickId
    });
  }

  updateTimeSlots(availability: string) {
    if (availability && this.timeSlots[availability as keyof typeof this.timeSlots]) {
      this.selectedTimeSlots = this.timeSlots[availability as keyof typeof this.timeSlots];
    } else {
      this.selectedTimeSlots = [];
    }
  }

  updateWhatsAppValidation(whatsappSame: string) {
    const whatsappNumberControl = this.leadForm.get('whatsappNumber');
    if (whatsappSame === 'no') {
      // If WhatsApp is different
      whatsappNumberControl?.setValidators([Validators.required]);
      whatsappNumberControl?.updateValueAndValidity();
    } else {
      // If WhatsApp is same
      whatsappNumberControl?.setValue('');
      whatsappNumberControl?.clearValidators();
      whatsappNumberControl?.updateValueAndValidity();
    }
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.markAllFieldsAsTouched();
    
    if (this.leadForm.valid) {
      console.log('Form submitted:', this.leadForm.value);
      
      // Get form values
      const formData = this.leadForm.value;
      
      // Send data to Zapier webhook
      this.sendToZapier(formData);
      
    } else {
      console.log('Form is invalid');
      // Don't show alert, validation errors will be displayed below fields
    }
  }

  // Mark all form fields as touched to trigger validation display
  markAllFieldsAsTouched() {
    Object.keys(this.leadForm.controls).forEach(key => {
      const control = this.leadForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  sendToZapier(formData: any) {
    // Your actual Zapier webhook URL
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/4630879/umnpnzt/';
    
    try {
      // Create URL parameters for the webhook (matching successful pattern)
      const params = new URLSearchParams();
      
      // Basic lead information (matching Salesforce format)
      params.set('first_name', formData.name || '');
      params.set('last_name', 'Nevys Student');
      params.set('company', 'Nevy\'s Language Academy');
      params.set('lead_source', 'Website Landing Page');
      params.set('status', 'New');
      
      // Contact information
      params.set('email', formData.email || '');
      params.set('phone', this.formatPhoneForSubmission(formData.phone) || '');
      params.set('whatsapp_same', formData.whatsappSame || '');
      params.set('whatsapp_number', formData.whatsappSame === 'no' ? this.getFullWhatsAppNumber() : this.formatPhoneForSubmission(formData.phone) || '');
      
      // Form responses
      params.set('english_lessons_history', formData.englishLessonsHistory || '');
      params.set('level_preference', formData.levelPreference || '');
      params.set('availability', formData.availability || '');
      params.set('specific_time_slot', formData.specificTimeSlot || '');
      params.set('province', formData.province || '');
      
      // Facebook campaign tracking data
      params.set('campaign_name', formData.campaignName || '');
      params.set('adset_name', formData.adsetName || '');
      params.set('ad_name', formData.adName || '');
      params.set('fb_click_id', formData.fbClickId || '');
      
      // Additional metadata
      params.set('submission_date', new Date().toISOString());
      params.set('source_url', window.location.href);
      
      // Formatted description for Salesforce
      params.set('description', this.formatFormDataForDescription(formData));

      console.log('=== ZAPIER WEBHOOK DEBUG ===');
      console.log('Webhook URL:', zapierWebhookUrl);
      console.log('Parameters being sent:', params.toString());

      // Send as GET request with query parameters (matching successful pattern)
      this.http.get(`${zapierWebhookUrl}?${params.toString()}`).subscribe({
        next: (response) => {
          console.log('=== ZAPIER SUCCESS ===');
          console.log('Data sent to Zapier successfully:', response);
          
          // Build confirmation URL with Facebook campaign parameters
          const confirmationUrl = this.buildConfirmationUrl(formData);
          
          // Redirect to confirmation page
          window.location.href = confirmationUrl;
        },
        error: (error) => {
          console.error('=== ZAPIER ERROR ===');
          console.error('Error sending to Zapier:', error);
          
          // Even if Zapier fails, still redirect to confirmation page
          const confirmationUrl = this.buildConfirmationUrl(formData);
          window.location.href = confirmationUrl;
        }
      });
    } catch (error) {
      console.error('Error preparing Zapier request:', error);
      
      // Even if preparation fails, still redirect to confirmation page
      const confirmationUrl = this.buildConfirmationUrl(formData);
      window.location.href = confirmationUrl;
    }
  }

  // Format form data into a readable description (matching successful pattern)
  private formatFormDataForDescription(formData: any): string {
    let description = `Arabic Lead Form Submission Details:\n\n`;
    
    description += `Name: ${formData.name || 'Not provided'}\n`;
    description += `Email: ${formData.email || 'Not provided'}\n`;
    description += `Phone: ${formData.phone || 'Not provided'}\n`;
    description += `WhatsApp Same: ${formData.whatsappSame || 'Not provided'}\n`;
    
    if (formData.whatsappSame === 'no') {
      description += `WhatsApp Number: ${this.getFullWhatsAppNumber()}\n`;
    }
    
    description += `English Lessons History: ${formData.englishLessonsHistory || 'Not provided'}\n`;
    description += `Level Preference: ${formData.levelPreference || 'Not provided'}\n`;
    description += `Availability: ${formData.availability || 'Not provided'}\n`;
    description += `Specific Time Slot: ${formData.specificTimeSlot || 'Not provided'}\n`;
    description += `Province: ${formData.province || 'Not provided'}\n`;
    
    // Facebook campaign data
    if (formData.campaignName) {
      description += `\nFacebook Campaign Data:\n`;
      description += `Campaign: ${formData.campaignName}\n`;
      description += `Adset: ${formData.adsetName || 'Not provided'}\n`;
      description += `Ad: ${formData.adName || 'Not provided'}\n`;
      description += `Click ID: ${formData.fbClickId || 'Not provided'}\n`;
    }
    
    description += `\nSubmitted on: ${new Date().toLocaleString()}`;
    
    return description;
  }

  buildConfirmationUrl(formData: any): string {
    // Base confirmation URL
    const baseUrl = 'https://arabconfirmationpage.netlify.app/';
    
    // Get form data and Facebook campaign parameters
    const name = encodeURIComponent(formData.name || '');
    const email = encodeURIComponent(formData.email || '');
    const campaignName = encodeURIComponent(formData.campaignName || '');
    const adsetName = encodeURIComponent(formData.adsetName || '');
    const adName = encodeURIComponent(formData.adName || '');
    const fbClickId = encodeURIComponent(formData.fbClickId || '');
    
    // Build URL with parameters
    const confirmationUrl = `${baseUrl}?name=${name}&email=${email}&Campaign_name=${campaignName}&Adset_name=${adsetName}&Ad_name=${adName}&fbclid=${fbClickId}`;
    
    console.log('Redirecting to confirmation URL:', confirmationUrl);
    
    return confirmationUrl;
  }

  // Email validator
  emailValidator(control: any) {
    if (!control.value) {
      return null;
    }
    
    const email = control.value.trim();
    
    // Basic email regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Check for common invalid patterns
    const invalidPatterns = [
      /^[^@]*$/, // No @ symbol
      /@[^.]*$/, // No dot after @
      /^@/, // Starts with @
      /@$/, // Ends with @
      /\.{2,}/, // Multiple consecutive dots
      /^\./, // Starts with dot
      /\.$/, // Ends with dot
      /@.*@/, // Multiple @ symbols
      /\s/ // Contains spaces
    ];
    
    // Check if email matches basic pattern
    if (!emailPattern.test(email)) {
      return { invalidEmail: true };
    }
    
    // Check for invalid patterns
    for (const pattern of invalidPatterns) {
      if (pattern.test(email)) {
        return { invalidEmail: true };
      }
    }
    
    // Check for common disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
      'temp-mail.org', 'throwaway.email', 'getnada.com', 'maildrop.cc'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      return { invalidEmail: true };
    }
    
    return null; // Valid email
  }

  // Canadian phone number validator
  canadianPhoneValidator(control: any) {
    if (!control.value) {
      return null;
    }
    
    // Remove all non-digit characters
    const phoneNumber = control.value.replace(/\D/g, '');
    
    // Canadian phone numbers should be 10 digits (without country code)
    if (phoneNumber.length === 10) {
      // Check if it starts with valid Canadian area codes
      const validAreaCodes = [
        '204', '226', '236', '249', '250', '263', '289', '306', '343', '354', '365', '367', '368', '382', '387', '403', '416', '418', '428', '431', '437', '438', '450', '468', '474', '506', '514', '519', '548', '579', '581', '584', '587', '604', '613', '639', '647', '672', '683', '705', '709', '742', '753', '778', '780', '782', '807', '819', '825', '867', '873', '879', '902', '905'
      ];
      
      const areaCode = phoneNumber.substring(0, 3);
      if (validAreaCodes.includes(areaCode)) {
        return null; // Valid Canadian phone number
      }
    }
    
    return { invalidCanadianPhone: true };
  }

  // Format phone number as user types
  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limit to 10 digits (Canadian phone number without country code)
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    // Format as (xxx) xxx-xxxx (without +1 prefix in the input field)
    if (value.length >= 6) {
      value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
    } else if (value.length >= 3) {
      value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    this.leadForm.get('phone')?.setValue(value, { emitEvent: false });
  }

  // Format WhatsApp number as user types
  formatWhatsAppNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    // Get the maximum allowed digits for the selected country
    const maxDigits = this.getMaxDigitsForCountry(this.selectedCountryCode);
    
    // Limit to the maximum allowed digits for the selected country
    if (value.length > maxDigits) {
      value = value.substring(0, maxDigits);
    }
    
    this.leadForm.get('whatsappNumber')?.setValue(value, { emitEvent: false });
  }

  // Get maximum number of digits allowed for each country code
  getMaxDigitsForCountry(countryCode: string): number {
    return getMaxDigitsForCountry(countryCode);
  }

  // Get full WhatsApp number with country code
  getFullWhatsAppNumber(): string {
    const countryCode = this.selectedCountryCode;
    const number = this.leadForm.get('whatsappNumber')?.value || '';
    return countryCode + number;
  }

  // Format phone number for submission (ensure it's in +1 (xxx) xxx-xxxx format)
  formatPhoneForSubmission(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it's 11 digits and starts with 1, format it
    if (digits.length === 11 && digits.startsWith('1')) {
      const areaCode = digits.substring(1, 4);
      const firstPart = digits.substring(4, 7);
      const secondPart = digits.substring(7, 11);
      return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
    }
    
    // If it's 10 digits, add the country code and format
    if (digits.length === 10) {
      const areaCode = digits.substring(0, 3);
      const firstPart = digits.substring(3, 6);
      const secondPart = digits.substring(6, 10);
      return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
    }
    
    // Return as is if it doesn't match expected patterns
    return phone;
  }

  // Format email (trim and lowercase)
  formatEmail(event: any) {
    const email = event.target.value.trim().toLowerCase();
    this.leadForm.get('email')?.setValue(email, { emitEvent: false });
  }

  // Get the flag for the selected country code
  getSelectedCountryFlag(): string {
    const selectedCountry = this.countryCodes.find(country => country.code === this.selectedCountryCode);
    return selectedCountry ? selectedCountry.flag : '🇸🇾';
  }

  // Toggle country dropdown
  toggleCountryDropdown() {
    this.showCountryDropdown = !this.showCountryDropdown;
    if (this.showCountryDropdown) {
      this.filteredCountries = [...this.countryCodes];
      this.countrySearchTerm = '';
    }
    console.log('Dropdown toggled, showCountryDropdown:', this.showCountryDropdown);
  }

  // Select a country
  selectCountry(country: any) {
    this.selectedCountryCode = country.code;
    this.showCountryDropdown = false;
    this.countrySearchTerm = '';
    
    // Re-format WhatsApp number if it exists and exceeds the new country's limit
    const currentWhatsAppNumber = this.leadForm.get('whatsappNumber')?.value || '';
    if (currentWhatsAppNumber) {
      const digits = currentWhatsAppNumber.replace(/\D/g, '');
      const maxDigits = this.getMaxDigitsForCountry(country.code);
      
      if (digits.length > maxDigits) {
        const trimmedDigits = digits.substring(0, maxDigits);
        this.leadForm.get('whatsappNumber')?.setValue(trimmedDigits, { emitEvent: false });
      }
    }
    
    console.log('Country selected:', country);
  }

  // Filter countries based on search term - optimized for speed
  filterCountries() {
    const searchTerm = this.countrySearchTerm?.trim() || '';
    
    // If search is empty, show all countries immediately
    if (!searchTerm) {
      this.filteredCountries = [...this.countryCodes];
      return;
    }
    
    // Fast filtering with lowercase search term
    const lowerSearchTerm = searchTerm.toLowerCase();
    this.filteredCountries = this.countryCodes.filter(country => 
      country.country.toLowerCase().includes(lowerSearchTerm) ||
      country.code.includes(searchTerm) ||
      country.flag.includes(searchTerm)
    );
  }

  // Handle search input with real-time filtering
  onCountrySearch(event: any) {
    this.countrySearchTerm = event.target.value;
    // Immediate filtering for fast response
    this.filterCountries();
  }

  // Handle when search input is cleared
  onSearchClear() {
    this.countrySearchTerm = '';
    this.filterCountries();
  }

  // Handle country code change (legacy method)
  onCountryCodeChange() {
    // This method is called when the country code dropdown changes
    // The flag and country code will automatically update due to two-way binding
    console.log('Country code changed to:', this.selectedCountryCode);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.whatsapp-prefix-container')) {
      this.showCountryDropdown = false;
    }
  }

  // Check if form is valid for submit button styling
  isFormValid(): boolean {
    return this.leadForm.valid;
  }

  // Get validation errors for display
  getFieldErrors(fieldName: string): string[] {
    const field = this.leadForm.get(fieldName);
    const errors: string[] = [];
    
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        errors.push('هذا الحقل مطلوب');
      }
      if (field.errors?.['email']) {
        errors.push('يرجى إدخال بريد إلكتروني صحيح');
      }
      if (field.errors?.['invalidEmail']) {
        errors.push('يرجى إدخال بريد إلكتروني صحيح');
      }
      if (field.errors?.['invalidCanadianPhone']) {
        errors.push('يرجى إدخال رقم هاتف كندي صحيح');
      }
    }
    
    return errors;
  }

  // Check if field has errors
  hasFieldErrors(fieldName: string): boolean {
    return this.getFieldErrors(fieldName).length > 0;
  }
}
