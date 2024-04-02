import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Sedes } from 'src/app/interfaces/sedes';
import { State } from 'src/app/interfaces/state';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [HttpClientModule],
})
export class SedesComponent implements OnInit {
  CodInst!: string;
  CodSede!: string;
  ErrorSede: boolean = false;
  sedes: Sedes[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.currentData.subscribe((data: State) => {
      if (data.CodSede != '') {
        this.CodSede = data.CodSede;
      }

      if (data.CodInst != '') {
        this.ErrorSede = false;
        this.CodInst = data.CodInst;
        this.dataService.obtenerSedes(this.CodInst).subscribe({
          next: (respuesta) => {
            if (respuesta.login === 'Success' && respuesta.option === 'sedes') {
              this.sedes = respuesta.data;
            } else {
              console.error('Error al obtener sedes');
            }
          },
          error: (error) => console.error(error),
        });
      } else {
        this.ErrorSede = true;
      }
    });
  }

  navigateTo(daneCode: string) {
    this.dataService.updateState(
      {
        ...this.dataService.state.getValue(),
        CodSede: daneCode,
        IdGrupo: '',
      },
      'grupos'
    );
  }
}
