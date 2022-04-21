import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from '../file-manager.service';
import { Item, Items } from '../file-manager.types';
import { ContextMenuComponent, ContextMenuService } from '@perfectmemory/ngx-contextmenu';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialogComponent } from './new-folder-dialog/new-folder-dialog.component';
import { FormGroup } from '@angular/forms';
@Component({
    selector       : 'file-manager-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild('itemList', {static: false}) itemList: ElementRef;
    @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
 
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: Items;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private contextMenuService: ContextMenuService,
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
        // Get the items
        this._fileManagerService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Items) => {
                this.items = items;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.selectedItem = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {

                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

     /**
     * Create new folder api call
     */
      createNewFolder(folderName: string): void
      {
        const currentDate = new Date().toJSON("yyyy/MM/dd HH:mm");
        let folder: Item = null;
        if(this.items.path.length > 0) {
            const folderId = this.items.path[this.items.path.length-1].id;
            folder = {
                id: '',
                folderId: folderId,
                name: folderName,
                createdBy: '',
                createdAt: currentDate,
                modifiedAt: currentDate,
                size: '0',
                type: 'folder',
                contents: '0',
                description: ''
            };
          }
          else {
            folder = {
                id: '',
                folderId: '',
                name: folderName,
                createdBy: '',
                createdAt: currentDate,
                modifiedAt: currentDate,
                size: '0',
                type: 'folder',
                contents: '0',
                description: ''
            };
          }
          // Create folder
          this._fileManagerService.createNewFolder(folder)
              .subscribe(
                  (result) => {
                    console.log(result);
                  },
                  (error) => {
                    console.log(error);
                  }
              );
      }

    showMessage(message: any) {
        console.log(message);
    }
    onContextMenu($event: KeyboardEvent): void {
        this.contextMenuService.show.next({
          anchorElement: $event.target,
          // Optional - if unspecified, all context menu components will open
          contextMenu: this.basicMenu,
          event: <any>$event,
          item: this.itemList,
        });
        $event.preventDefault(); 
        $event.stopPropagation();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(NewFolderDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            const form: FormGroup = result;
          if(form.value.folderName) {
             this.createNewFolder(form.value.folderName);
          }
        });
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
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
