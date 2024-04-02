import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Grupos } from 'src/app/interfaces/grupos';
import { State } from 'src/app/interfaces/state';
import { DataService } from 'src/app/services/data.service';
import { InfoGrupoModalComponent } from '../info-grupo-modal/info-grupo-modal.component';
import { InfoGrupo } from 'src/app/interfaces/info-grupo';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [HttpClientModule],
})
export class GruposComponent implements OnInit {
  CodSede!: string;
  IdGrupo!: string;
  ErrorGrupos: boolean = false;
  grupos: Grupos[] = [];
  infoGrupo: InfoGrupo = {
    id: '',
    nombre: '',
    sede: '',
    institucion: '',
    municipio: '',
    numGrupo: '',
  };

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.dataService.currentData.subscribe((data: State) => {
      if (data.IdGrupo != '') {
        this.IdGrupo = data.IdGrupo;
      }

      if (data.CodSede != '') {
        this.ErrorGrupos = false;
        this.CodSede = data.CodSede;
        this.dataService.obtenerGrupos(this.CodSede).subscribe({
          next: (respuesta) => {
            if (
              respuesta.login === 'Success' &&
              respuesta.option === 'grupos'
            ) {
              this.grupos = respuesta.data;
              console.log(this.grupos);
            } else {
              console.error('Error al obtener información de grupos');
            }
          },
          error: (error) => console.error(error),
        });
      } else {
        this.ErrorGrupos = true;
      }
    });
  }

  openModal(IdGroup: string) {
    this.dataService.obtenerInfoGrupo(IdGroup).subscribe({
      next: async (respuesta) => {
        if (respuesta.login === 'Success' && respuesta.option === 'infoGrupo') {
          this.infoGrupo = {
            ...respuesta.data[0],
            institucion: respuesta.data[0].institución,
          };
          console.log(this.infoGrupo);
          const modal = await this.modalCtrl.create({
            component: InfoGrupoModalComponent,
            backdropDismiss: true,
            showBackdrop: true,
            keyboardClose: true,
            cssClass: 'modal-sun',
            componentProps: {
              ...this.infoGrupo,
            },
          });
          modal.present();
        } else {
          console.error('Error al obtener información del grupo');
        }
      },
      error: (error) => console.error(error),
    });
  }
}
