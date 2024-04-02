import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-grupo-modal',
  templateUrl: './info-grupo-modal.component.html',
  styleUrls: ['./info-grupo-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class InfoGrupoModalComponent implements OnInit {
  @Input() id: string = '';
  @Input() nombre: string = '';
  @Input() sede: string = '';
  @Input() institucion: string = '';
  @Input() municipio: string = '';
  @Input() numGrupo: string = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async closeModel() {
    await this.modalCtrl.dismiss();
  }
}
