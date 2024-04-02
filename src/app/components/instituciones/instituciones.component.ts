import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Instituciones } from 'src/app/interfaces/instituciones';
import { State } from 'src/app/interfaces/state';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [HttpClientModule],
})
export class InstitucionesComponent implements OnInit {
  CodMun!: string;
  CodInst!: string;
  ErrorInst: boolean = false;
  instituciones: Instituciones[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.currentData.subscribe((data: State) => {
      if (data.CodInst != '') {
        this.CodInst = data.CodInst;
      }

      if (data.CodMun != '') {
        this.ErrorInst = false;
        this.CodMun = data.CodMun;
        this.dataService.obtenerInstituciones(this.CodMun).subscribe({
          next: (respuesta) => {
            if (
              respuesta.login === 'Success' &&
              respuesta.option === 'instituciones'
            ) {
              this.instituciones = respuesta.data;
            } else {
              console.error('Error al obtener instituciones');
            }
          },
          error: (error) => console.error(error),
        });
      } else {
        this.ErrorInst = true;
      }
    });
  }

  navigateTo(daneCode: string) {
    this.dataService.updateState(
      {
        ...this.dataService.state.getValue(),
        CodInst: daneCode,
        CodSede: '',
        IdGrupo: '',
      },
      'sedes'
    );
  }
}
