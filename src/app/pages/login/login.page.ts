import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular/standalone';
import { presentToast } from 'src/app/helper/toast';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);
  private readonly fb = inject(FormBuilder);

  loginForm!: FormGroup;
  user = {
    email: '',
    password: ''
  }

  constructor(private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.nonNullable.group({
      email: [this.user?.email ?? '', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: [this.user?.email ?? '', Validators.required]
    });
  }

  async loginUser() {
    try {
      await this.authService.signIn(
        this.loginForm.getRawValue().email, 
        this.loginForm.getRawValue().password
        );
      presentToast('success', 'Logged in!', this.toastController);
      await this.router.navigate(['/topics']); 
    } catch (error) {
      presentToast('danger', 'Invalid Password and email combo. Please try again.', this.toastController);
    }
  }

  async forgotPassword() {
    await this.authService.sendPasswordResetEmail(this.loginForm.getRawValue().email);
    presentToast('success', 'Password retrieval email sent! Please check your inbox.', this.toastController);
  }

  async googleSignin() {
    try {
      await this.authService.googleSignIn();
      presentToast('success', 'Logged in!', this.toastController);
      await this.router.navigate(['/topics']); 
    } catch (error) {
      presentToast('danger', 'Google authentication error! Try loggin in another way.', this.toastController);
    }
  }

  async googleLogOut() {
    await this.authService.googleSignOut();
  } //TODO: remove
}
