import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from '../file-manager.service';
import { createItem, Item, Items } from '../file-manager.types';
import { ContextMenuComponent, ContextMenuService } from '@perfectmemory/ngx-contextmenu';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
  } from '@angular/material/snack-bar';
import { result } from 'lodash';
import { NewFolderDialogComponent } from 'app/shared/dialogs/new-folder-dialog';
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
    currentItem: string;
    items: Items;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    isLoading: boolean = false;
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
        private _snackBar: MatSnackBar

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
    
    openFileDialog() {
        document.querySelector('input').click()
    }

    getfile(files: FormData) {
        const formData = new FormData();
        if (files[0]) {
            const isFile = this.items.files.some(e => e.name == files[0].name.toString());
            if(isFile) {
                this._snackBar.open('Error: A file with the same same already exist in this directory', 'Close', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    duration: 5000,
                });
                return;
            }
            if(files[0].size >= 134217728) {
                this._snackBar.open('Error: The file has exceeded the size limit of 128 MB \n TIP: please consider uploading the content in different videos of no more than 30 seconds each', 'Close', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    duration: 5000,
                });
                return
            }

            formData.append(files[0].name, files[0]);
            this._fileManagerService.uploadFile(formData)
            .subscribe(
                (azureUrl) => {
                    this.createNewItem(
                        files[0].name.toString(), 
                        'file',
                        files[0].type,
                        files[0].size.toString(), 
                        new Date(files[0].lastModifiedDate.toString()),
                        azureUrl.toReturn
                    );
                },
                (error) => {
                        //stop spinner
                    this.isLoading = false;
                    //trigger toast notification Error
                    this._snackBar.open('Error: '+error.error.message, 'Close', {
                        announcementMessage: error,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 5000,
                    });
                }
            );
        }
    }

    openFolderDialog(): void {
        let folderName = "new folder"
        let isFolder;
        let folderNumber = "";
        let index = 0

        do {
            isFolder = this.items.folders.find(e => e.name.includes(folderName));
            if(isFolder) {
                index = index+1;
                folderName = 'new folder '+index;
            }
            
        }while(isFolder);

        const dialogRef = this.dialog.open(NewFolderDialogComponent, 
            { 
                data: {
                    folderName: folderName
                }  
            });
            dialogRef.afterClosed().subscribe(result => {
                const form: FormGroup = result;
              if(form.value) {
                const currentDate = new Date();
                this.createNewItem(
                    form.value.folderName, 
                    'folder', 
                    null, 
                    '0', 
                    currentDate, 
                    null);
              }
            });
    }

    /**
 * Create new folder api call
 */
    createNewItem(name: string, type: string, mediaType: string, size: string, modifiedAt: Date, azureUrl): void
    {
        this.isLoading = true;
        const folderId = this._fileManagerService.itemId;
        const currentDate = new Date();
        const item: createItem = {
            Id: '',
            folderId: folderId,
            name: name,
            createdAt: currentDate,
            modifiedAt: modifiedAt,
            size: size,
            type: type,
            mediaType: mediaType,
            contents: '0',
            description: null,
            azureUrl: azureUrl
        };
        // Create item
        this._fileManagerService.createNewItem(item)
            .subscribe(
                (result) => {
                    // refresh items
                    this._fileManagerService.refreshItems()
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((items: Items) => {
                        this.items = items;
                        this._changeDetectorRef.markForCheck();
                        console.log(this.items);
                    });
                    
                    this.isLoading = false;
                    //trigger toast notification success
                    if(type == 'folder'){
                        this._snackBar.open('Folder created successfuly!', 'Close', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            duration: 5000,
                        });
                    }
                    else {
                        this._snackBar.open('File uploaded successfuly!', 'Close', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            duration: 5000,
                        });
                    }
                    
                },
                (error) => {
                        //stop spinner
                    this.isLoading = false;
                    //trigger toast notification Error
                    console.log(error.error.message);
                    this._snackBar.open('Error: '+error.error.message, 'Close', {
                        announcementMessage: error.error.message,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition,
                        duration: 5000,
                    });
                }
            );
    }

    checkItem(itemId) {
        console.log(itemId);
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
