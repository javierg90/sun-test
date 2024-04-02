import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Municipios } from 'src/app/interfaces/municipios';
import { State } from 'src/app/interfaces/state';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [HttpClientModule],
})
export class MunicipiosComponent implements OnInit {
  CodMun!: string;
  municipios: Municipios[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.currentData
      .subscribe((data: State) => {
        if (data.CodMun != '') {
          this.CodMun = data.CodMun;
        }
      })
      .unsubscribe();

    this.dataService.obtenerMunicipios().subscribe({
      next: (respuesta) => {
        if (
          respuesta.login === 'Success' &&
          respuesta.option === 'municipios'
        ) {
          this.municipios = respuesta.data;
        } else {
          console.error('Error al obtener municipios');
        }
      },
      error: (error) => console.error(error),
    });
  }

  navigateTo(daneCode: string) {
    this.dataService.updateState(
      {
        CodMun: daneCode,
        CodInst: '',
        CodSede: '',
        IdGrupo: '',
      },
      'instituciones'
    );
  }
}
