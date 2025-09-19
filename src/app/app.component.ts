import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  countryCodes = [
    { code: '+1', country: 'Canada/USA', flag: '🇨🇦' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+51', country: 'Peru', flag: '🇵🇪' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦' },
    { code: '+968', country: 'Oman', flag: '🇴🇲' },
    { code: '+962', country: 'Jordan', flag: '🇯🇴' },
    { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
    { code: '+963', country: 'Syria', flag: '🇸🇾' },
    { code: '+964', country: 'Iraq', flag: '🇮🇶' },
    { code: '+98', country: 'Iran', flag: '🇮🇷' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+975', country: 'Bhutan', flag: '🇧🇹' },
    { code: '+93', country: 'Afghanistan', flag: '🇦🇫' }
  ];

  timeSlots = {
    morning: [
      { value: '9:00-9:30', label: '9:00 - 9:30 صباحًا' },
      { value: '9:30-10:00', label: '9:30 - 10:00 صباحًا' },
      { value: '10:30-11:00', label: '10:30 - 11:00 صباحًا' },
      { value: '10:00-10:30', label: '10:00 - 10:30 صباحًا' }
    ],
    afternoon1: [
      { value: '11:00-11:30', label: '11:00 - 11:30 صباحًا' },
      { value: '11:30-12:00', label: '11:30 - 12:00 ظهرًا' },
      { value: '12:30-1:00', label: '12:30 - 1:00 ظهرًا' },
      { value: '12:00-12:30', label: '12:00 - 12:30 ظهرًا' },
      { value: '1:30-2:00', label: '1:30 - 2:00 ظهرًا' },
      { value: '1:00-1:30', label: '1:00 - 1:30 ظهرًا' }
    ],
    afternoon2: [
      { value: '2:30-3:00', label: '2:30 - 3:00 مساءً' },
      { value: '2:00-2:30', label: '2:00 - 2:30 مساءً' },
      { value: '3:30-4:00', label: '3:30 - 4:00 مساءً' },
      { value: '3:00-3:30', label: '3:00 - 3:30 مساءً' },
      { value: '4:30-5:00', label: '4:30 - 5:00 مساءً' },
      { value: '4:00-4:30', label: '4:00 - 4:30 مساءً' }
    ],
    evening: [
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
    if (this.leadForm.valid) {
      console.log('Form submitted:', this.leadForm.value);
      
      // Get form values
      const formData = this.leadForm.value;
      
      // Send data to Zapier webhook
      this.sendToZapier(formData);
      
    } else {
      console.log('Form is invalid');
      alert('يرجى ملء جميع الحقول المطلوبة');
    }
  }

  sendToZapier(formData: any) {
    // Your actual Zapier webhook URL
    const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/4630879/umntccj/';
    
    // Prepare data for Zapier in clean JSON format
    const zapierData = {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      whatsappSame: formData.whatsappSame || '',
      whatsappNumber: formData.whatsappSame === 'no' ? this.getFullWhatsAppNumber() : (formData.phone || ''),
      englishLessonsHistory: formData.englishLessonsHistory || '',
      levelPreference: formData.levelPreference || '',
      availability: formData.availability || '',
      specificTimeSlot: formData.specificTimeSlot || '',
      province: formData.province || '',
      // Facebook campaign tracking data
      campaignName: formData.campaignName || '',
      adsetName: formData.adsetName || '',
      adName: formData.adName || '',
      fbClickId: formData.fbClickId || '',
      // Timestamp
      submittedAt: new Date().toISOString()
    };

    // Send to Zapier with proper headers to ensure JSON format
    this.http.post(zapierWebhookUrl, zapierData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).subscribe({
      next: (response) => {
        console.log('Data sent to Zapier successfully:', response);
        
        // Build confirmation URL with Facebook campaign parameters
        const confirmationUrl = this.buildConfirmationUrl(formData);
        
        // Redirect to confirmation page
        window.location.href = confirmationUrl;
      },
      error: (error) => {
        console.error('Error sending to Zapier:', error);
        
        // Even if Zapier fails, still redirect to confirmation page
        const confirmationUrl = this.buildConfirmationUrl(formData);
        window.location.href = confirmationUrl;
      }
    });
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
    
    if (value.length >= 6) {
      value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
    } else if (value.length >= 3) {
      value = value.substring(0, 3) + '-' + value.substring(3);
    }
    
    this.leadForm.get('phone')?.setValue(value, { emitEvent: false });
  }

  // Format WhatsApp number as user types
  formatWhatsAppNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limit to reasonable length (15 digits max for international numbers)
    if (value.length > 15) {
      value = value.substring(0, 15);
    }
    
    this.leadForm.get('whatsappNumber')?.setValue(value, { emitEvent: false });
  }

  // Get full WhatsApp number with country code
  getFullWhatsAppNumber(): string {
    const countryCode = this.selectedCountryCode;
    const number = this.leadForm.get('whatsappNumber')?.value || '';
    return countryCode + number;
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
}
