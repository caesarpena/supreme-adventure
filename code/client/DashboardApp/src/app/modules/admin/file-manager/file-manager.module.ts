import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileManagerComponent, FileManagerDetailsComponent, FileManagerListComponent } from './index';
import { fileManagerRoutes } from './file-manager.routing';
import { SharedModule } from '../../../shared/shared.module';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { NewFolderDialogComponent } from './list/new-folder-dialog/new-folder-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerDetailsComponent,
        FileManagerListComponent,
        NewFolderDialogComponent
    ],
    imports     : [
        RouterModule.forChild(fileManagerRoutes),
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatSidenavModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        SharedModule,
        ContextMenuModule.forRoot()
    ]
})
export class FileManagerModule
{
}
