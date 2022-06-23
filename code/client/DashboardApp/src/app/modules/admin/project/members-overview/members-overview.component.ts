import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NewMemberDialogComponent } from 'app/shared/dialogs/add-new-member/add-new-member-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../project.service';
import { MembersOverviewService } from './members-overview.service';

@Component({
    selector     : 'members-overview',
    templateUrl  : './members-overview.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MembersOverviewComponent implements OnInit
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @Input() members: any;
    isLoading: boolean = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    /**
     * Constructor
     */
    constructor(private _projectService: ProjectService, 
        private dialog: MatDialog,
        private _memberOverviewService: MembersOverviewService,
        private _snackBar: MatSnackBar)
    {
    }

    ngOnInit(): void
    {
        
    }
    openNewMemberDialog(): void {
        const dialogRef = this.dialog.open(NewMemberDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                const form: FormGroup = result;
                if(form) {
                    this.sendNewMemberEmail(form.value.email)
                }
            }
        );
    }

        /*
        * Send New member email
        */
        sendNewMemberEmail(email: string): void
        {
            let credentials: any = {
                email: email,
                password: null
            }
            // Send email
            this._memberOverviewService.sendNewMemberEmail(credentials)
                .subscribe(
                    (result) => {
                        this.isLoading = false;

                            //trigger toast notification success
                        this._snackBar.open('Email was sent successfuly!', 'Close', {
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            duration: 5000,
                        });
                    },
                    (error) => {
                            //stop spinner
                        this.isLoading = false;

                        //trigger toast notification Error
                        this._snackBar.open('Error: '+error.error.message, 'Close', {
                            announcementMessage: error.error.message,
                            horizontalPosition: this.horizontalPosition,
                            verticalPosition: this.verticalPosition,
                            duration: 5000,
                        });
                    }
                );
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
