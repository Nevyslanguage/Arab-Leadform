import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'arableadform';
  leadForm: FormGroup;
  selectedTimeSlots: any[] = [];

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
      phone: [''],
      whatsappSame: ['', Validators.required],
      whatsappNumber: [''],
      email: ['', [Validators.required, Validators.email]],
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
    // Replace this URL with your actual Zapier webhook URL
    const zapierWebhookUrl = 'YOUR_ZAPIER_WEBHOOK_URL_HERE';
    
    // Prepare data for Zapier
    const zapierData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      whatsappSame: formData.whatsappSame,
      whatsappNumber: formData.whatsappNumber,
      englishLessonsHistory: formData.englishLessonsHistory,
      levelPreference: formData.levelPreference,
      availability: formData.availability,
      specificTimeSlot: formData.specificTimeSlot,
      province: formData.province,
      // Facebook campaign tracking data
      campaignName: formData.campaignName,
      adsetName: formData.adsetName,
      adName: formData.adName,
      fbClickId: formData.fbClickId,
      // Timestamp
      submittedAt: new Date().toISOString()
    };

    // Send to Zapier
    this.http.post(zapierWebhookUrl, zapierData).subscribe({
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
}
