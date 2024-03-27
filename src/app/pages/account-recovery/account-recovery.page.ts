import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { presentToast } from 'src/app/helper/toast';

@Component({
  selector: 'app-account-recovery',
  templateUrl: './account-recovery.page.html',
  styleUrls: ['./account-recovery.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class AccountRecoveryPage implements OnInit {
  private readonly toastController = inject(ToastController);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  recoveryForm!: FormGroup;
  user = {
    email: '',
  }

  constructor(private router: Router) { }

  ngOnInit() {
    this.recoveryForm = this.fb.nonNullable.group({
      email: [this.user?.email ?? '', Validators.compose([
        Validators.required,
        Validators.email
      ])]
    });
  }

  async recoverUser() {
    try {
      await this.authService.sendPasswordResetEmail(
        this.recoveryForm.getRawValue().email
        )
      presentToast('success', 'Account recovery Email sent! Please check your inbox.', this.toastController);
      await this.router.navigate(['']);
    } catch (error) {
      presentToast('danger', 'Unknown Email Address!', this.toastController);
    }
  }


}
