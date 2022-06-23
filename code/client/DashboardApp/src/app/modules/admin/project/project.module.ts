import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectComponent } from './project.component';
import { projectRoutes } from './project.routing';
import { MembersOverviewComponent } from './members-overview/members-overview.component';
import { BillingOverviewComponent } from './billing-overview/billing-overview.component';
import { GeneralOverviewComponent } from './general-overview/general-overview.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SearchModule } from 'app/layout/common/search/search.module';
import { DialogsModule } from 'app/shared/dialogs/dialogs.module';

@NgModule({
    declarations: [
        ProjectComponent,
        MembersOverviewComponent,
        BillingOverviewComponent,
        GeneralOverviewComponent
    ],
    imports     : [
        RouterModule.forChild(projectRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatFormFieldModule,
        NgApexchartsModule,
        TranslocoModule,
        SearchModule,
        DialogsModule,
        SharedModule
    ]
})
export class ProjectModule
{
}
