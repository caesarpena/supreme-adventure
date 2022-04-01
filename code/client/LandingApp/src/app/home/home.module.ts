import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HomeComponent } from './home.component';
import { HeaderComponent, FooterComponent } from '../layout/index';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent],
  imports: [
    CommonModule,
    CarouselModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        data: {
          title: 'Home',
          description:
            'Angular starter for enterprise-grade front-end projects, built under a clean architecture that helps to scale and maintain a fast workflow.',
          robots: 'index, follow',
        },
      },
    ]),
  ],
})
export class HomeModule {}
