import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, Observable, throwError, BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { LoginModalComponent } from '../components/login-modal/login-modal.component';
import * as CryptoJS from 'crypto-js';
import { State } from '../interfaces/state';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private ENC = 'bf3c199c2470cb477d907b1e0917c17b';
  private apiUrl = 'https://www.php.engenius.com.co/DatabaseIE.php';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private userData = {
    User: '',
    Password: '',
  };
  public stateData: State = {
    CodMun: '',
    CodInst: '',
    CodSede: '',
    IdGrupo: '',
  };
  public state = new BehaviorSubject<any>(this.stateData);
  currentData = this.state.asObservable();

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  checkState() {
    if (localStorage.getItem('authToken')) {
      this.getUserData();
      this.updateState({ ...JSON.parse(localStorage.getItem('state')!) });
    } else {
      this.openModal();
    }
  }

  updateState(data: any, route?: string) {
    this.state.next(data);
    localStorage.setItem('state', JSON.stringify(this.state.getValue()));
    console.log(this.state.getValue());
    if (route) {
      this.router.navigate(['/home/' + route]);
    }
  }

  private realizarPeticion(body: any): Observable<any> {
    return this.http.post(this.apiUrl, body, { headers: this.headers });
  }

  login(user: string, password: string) {
    const body = {
      User: user,
      Password: password,
    };
    return this.realizarPeticion(body).pipe(
      map((response) => {
        if (response.login === 'Success') {
          this.userData = { ...body };
          localStorage.setItem(
            'authToken',
            this.encrypt(JSON.stringify(this.userData))
          );
          localStorage.setItem('state', JSON.stringify(this.state.getValue()));
        } else {
          throw new Error('Login failed'); // Forza un error si la respuesta no es exitosa
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Maneja el error HTTP y otros errores potenciales
        console.error('Error de autenticación:', error.message);
        return throwError(() => new Error('Usuario o contraseña incorrecta.')); // Re-throw el error para los suscriptores
      })
    );
  }

  getUserData() {
    this.userData = {
      ...JSON.parse(this.decrypt(localStorage.getItem('authToken')!)),
    };
  }

  obtenerMunicipios(): Observable<any> {
    const body = {
      User: this.userData.User,
      Password: this.userData.Password,
      option: 'municipios',
    };
    return this.realizarPeticion(body);
  }

  obtenerInstituciones(codMun: string): Observable<any> {
    const body = {
      User: this.userData.User,
      Password: this.userData.Password,
      option: 'instituciones',
      CodMun: codMun,
    };
    return this.realizarPeticion(body);
  }

  obtenerSedes(codInst: string): Observable<any> {
    const body = {
      User: this.userData.User,
      Password: this.userData.Password,
      option: 'sedes',
      CodInst: codInst,
    };
    return this.realizarPeticion(body);
  }

  obtenerGrupos(codSede: string): Observable<any> {
    const body = {
      User: this.userData.User,
      Password: this.userData.Password,
      option: 'grupos',
      CodSede: codSede,
    };
    return this.realizarPeticion(body);
  }

  obtenerInfoGrupo(idGrupo: string): Observable<any> {
    const body = {
      User: this.userData.User,
      Password: this.userData.Password,
      option: 'infoGrupo',
      IdGrupo: idGrupo,
    };
    return this.realizarPeticion(body);
  }

  encrypt(text: string) {
    let encrypted = CryptoJS.AES.encrypt(text, this.ENC).toString();
    return encrypted;
  }

  decrypt(text: string) {
    let decrypted = CryptoJS.AES.decrypt(text, this.ENC).toString(
      CryptoJS.enc.Utf8
    );
    return decrypted;
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: LoginModalComponent,
      backdropDismiss: false,
      showBackdrop: true,
      keyboardClose: false,
    });
    modal.present();
  }
}
