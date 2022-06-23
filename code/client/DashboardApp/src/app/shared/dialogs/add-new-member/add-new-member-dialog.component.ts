import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewMemberDialogData } from './add-new-member-dialogData';

@Component({
    selector       : 'add-new-member-dialog',
    templateUrl    : './add-new-member-dialog.component.html',
    styleUrls  : ['./add-new-member-dialog.component.scss']
})
export class NewMemberDialogComponent implements OnInit, OnDestroy {
    @ViewChild('newMemberNgForm') newMemberNgForm: NgForm;
    newMemberForm: FormGroup;

    constructor(private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<NewMemberDialogComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: NewMemberDialogData,
      ) {}
    
    ngOnInit(): void {
         // Create the form
         this.newMemberForm = this._formBuilder.group({
            email: ['', [Validators.required]],
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    ngOnDestroy(): void {}
}