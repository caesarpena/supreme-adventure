import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../project.service';

@Component({
    selector     : 'members-overview',
    templateUrl  : './members-overview.component.html',
    encapsulation: ViewEncapsulation.None
})
export class MembersOverviewComponent implements OnInit
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @Input() members: any;

    /**
     * Constructor
     */
    constructor(private _projectService: ProjectService,)
    {
    }

    ngOnInit(): void
    {
        
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
