import { ToastController } from '@ionic/angular/standalone';

export  async function presentToast(color: 'success' | 'danger', message: string, toastcontroller: ToastController) {
    const toast = await toastcontroller.create({
      message,
      color,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }