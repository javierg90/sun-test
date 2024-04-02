import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Page } from '../interfaces/page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  public pages: Page[] = [
    { title: 'Municipios', url: '/home/municipios', icon: 'map' },
    {
      title: 'Instituciones Educativas',
      url: '/home/instituciones',
      icon: 'schools',
    },
    { title: 'Sedes', url: '/home/sedes', icon: 'business' },
    { title: 'Grupos', url: '/home/grupos', icon: 'people' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.dataService.checkState();
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
