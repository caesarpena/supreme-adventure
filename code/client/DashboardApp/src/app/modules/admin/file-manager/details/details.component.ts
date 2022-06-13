import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerListComponent } from '../list/index';
import { FileManagerService } from '../file-manager.service';
import { Item } from '../file-manager.types';
import { MatDialog } from '@angular/material/dialog';
import { MediaPlayerDialogComponent } from 'app/shared/dialogs/media-player-dialog';

@Component({
    selector       : 'file-manager-details',
    templateUrl    : './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy
{
    item: Item;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: FileManagerListComponent,
        private _fileManagerService: FileManagerService,
        public dialog: MatDialog,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Open the drawer
        this._fileManagerListComponent.matDrawer.open();

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {

                // Open the drawer in case it is closed
                this._fileManagerListComponent.matDrawer.open();

                // Get the item
                this.item = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    openMediaPlayerDialog(): void {
        console.log(this.item);

        const dialogRef = this.dialog.open(MediaPlayerDialogComponent, 
            { 
                data: {
                    url: this.item.azureUrl,
                    type: this.item.mediaType
                }  
            });
            dialogRef.afterClosed().subscribe(result => {
          
            });
    }

    editItem(): void {
        this._fileManagerService.editItems(this.item.id)
        .subscribe(
            (result) => {
                
            },
            (error) => {
               
            }
        );
    }

    removeItem(): void {
        this._fileManagerService.editItems(this.item.id)
        .subscribe(
            (result) => {
                
            },
            (error) => {
               
            }
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._fileManagerListComponent.matDrawer.close();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
