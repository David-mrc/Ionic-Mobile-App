import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule , FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular/standalone';
import { presentToast } from 'src/app/helper/toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  private readonly toastController = inject(ToastController);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  registerForm!: FormGroup;
  user = {
    email: '',
    password: ''
  }

  constructor(private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.nonNullable.group({
      email: [this.user?.email ?? '', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: [this.user?.email ?? '', Validators.required]
    });
  }

  async registerUser() {
    try {
      await this.authService.createUser(
        this.registerForm.getRawValue().email, 
        this.registerForm.getRawValue().password
        );
      presentToast('success', 'Succesfully Registered!', this.toastController);
      await this.router.navigate(['']);
    } catch (error) {
      presentToast('danger', 'User already exists, please try again.', this.toastController);
    }
  }

}
