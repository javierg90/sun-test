import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginModalComponent implements OnInit {
  user!: string;
  password!: string;
  error!: string;
  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.dataService.login(this.user, this.password).subscribe({
      next: (data) => {
        this.modalCtrl.dismiss().then(() => {
          this.router.navigate(['/home/municipios']);
          this.dataService.getUserData();
        });
        // Cierra el modal si el inicio de sesión es exitoso
      },
      error: (error) => {
        this.error = error;
        // Maneja el error de inicio de sesión
      },
    });
  }
}
