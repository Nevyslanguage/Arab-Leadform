import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
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

  constructor(private fb: FormBuilder) {
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
      campaignName: ['', Validators.required],
      adsetName: ['', Validators.required],
      adName: ['', Validators.required],
      fbClickId: ['', Validators.required]
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
      
      alert('تم إرسال النموذج بنجاح!');
    } else {
      console.log('Form is invalid');
      alert('يرجى ملء جميع الحقول المطلوبة');
    }
  }
}
