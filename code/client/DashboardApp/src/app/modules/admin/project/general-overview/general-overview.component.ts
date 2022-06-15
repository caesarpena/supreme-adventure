import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService } from '../project.service';

@Component({
    selector     : 'general-overview',
    templateUrl  : './general-overview.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GeneralOverviewComponent implements OnInit
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @Input() data: any;

    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};

    /**
     * Constructor
     */
    constructor(private _projectService: ProjectService,)
    {
    }

    ngOnInit(): void
    {
        this._prepareChartData();
    }

      /**
     * Prepare the chart data from the data
     *
     * @private
     */
       private _prepareChartData(): void
       {
           // Github issues
           this.chartGithubIssues = {
               chart      : {
                   fontFamily: 'inherit',
                   foreColor : 'inherit',
                   height    : '100%',
                   type      : 'line',
                   toolbar   : {
                       show: false
                   },
                   zoom      : {
                       enabled: false
                   }
               },
               colors     : ['#64748B', '#94A3B8'],
               dataLabels : {
                   enabled        : true,
                   enabledOnSeries: [0],
                   background     : {
                       borderWidth: 0
                   }
               },
               grid       : {
                   borderColor: 'var(--fuse-border)'
               },
               labels     : this.data.githubIssues.labels,
               legend     : {
                   show: false
               },
               plotOptions: {
                   bar: {
                       columnWidth: '50%'
                   }
               },
               series     : this.data.githubIssues.series,
               states     : {
                   hover: {
                       filter: {
                           type : 'darken',
                           value: 0.75
                       }
                   }
               },
               stroke     : {
                   width: [3, 0]
               },
               tooltip    : {
                   followCursor: true,
                   theme       : 'dark'
               },
               xaxis      : {
                   axisBorder: {
                       show: false
                   },
                   axisTicks : {
                       color: 'var(--fuse-border)'
                   },
                   labels    : {
                       style: {
                           colors: 'var(--fuse-text-secondary)'
                       }
                   },
                   tooltip   : {
                       enabled: false
                   }
               },
               yaxis      : {
                   labels: {
                       offsetX: -16,
                       style  : {
                           colors: 'var(--fuse-text-secondary)'
                       }
                   }
               }
           };
   
           // Task distribution
           this.chartTaskDistribution = {
               chart      : {
                   fontFamily: 'inherit',
                   foreColor : 'inherit',
                   height    : '100%',
                   type      : 'polarArea',
                   toolbar   : {
                       show: false
                   },
                   zoom      : {
                       enabled: false
                   }
               },
               labels     : this.data.taskDistribution.labels,
               legend     : {
                   position: 'bottom'
               },
               plotOptions: {
                   polarArea: {
                       spokes: {
                           connectorColors: 'var(--fuse-border)'
                       },
                       rings : {
                           strokeColor: 'var(--fuse-border)'
                       }
                   }
               },
               series     : this.data.taskDistribution.series,
               states     : {
                   hover: {
                       filter: {
                           type : 'darken',
                           value: 0.75
                       }
                   }
               },
               stroke     : {
                   width: 2
               },
               theme      : {
                   monochrome: {
                       enabled       : true,
                       color         : '#93C5FD',
                       shadeIntensity: 0.75,
                       shadeTo       : 'dark'
                   }
               },
               tooltip    : {
                   followCursor: true,
                   theme       : 'dark'
               },
               yaxis      : {
                   labels: {
                       style: {
                           colors: 'var(--fuse-text-secondary)'
                       }
                   }
               }
           };
   
           // Budget distribution
           this.chartBudgetDistribution = {
               chart      : {
                   fontFamily: 'inherit',
                   foreColor : 'inherit',
                   height    : '100%',
                   type      : 'radar',
                   sparkline : {
                       enabled: true
                   }
               },
               colors     : ['#818CF8'],
               dataLabels : {
                   enabled   : true,
                   formatter : (val: number): string | number => `${val}%`,
                   textAnchor: 'start',
                   style     : {
                       fontSize  : '13px',
                       fontWeight: 500
                   },
                   background: {
                       borderWidth: 0,
                       padding    : 4
                   },
                   offsetY   : -15
               },
               markers    : {
                   strokeColors: '#818CF8',
                   strokeWidth : 4
               },
               plotOptions: {
                   radar: {
                       polygons: {
                           strokeColors   : 'var(--fuse-border)',
                           connectorColors: 'var(--fuse-border)'
                       }
                   }
               },
               series     : this.data.budgetDistribution.series,
               stroke     : {
                   width: 2
               },
               tooltip    : {
                   theme: 'dark',
                   y    : {
                       formatter: (val: number): string => `${val}%`
                   }
               },
               xaxis      : {
                   labels    : {
                       show : true,
                       style: {
                           fontSize  : '12px',
                           fontWeight: '500'
                       }
                   },
                   categories: this.data.budgetDistribution.categories
               },
               yaxis      : {
                   max       : (max: number): number => parseInt((max + 10).toFixed(0), 10),
                   tickAmount: 7
               }
           };
   
           // Weekly expenses
           this.chartWeeklyExpenses = {
               chart  : {
                   animations: {
                       enabled: false
                   },
                   fontFamily: 'inherit',
                   foreColor : 'inherit',
                   height    : '100%',
                   type      : 'line',
                   sparkline : {
                       enabled: true
                   }
               },
               colors : ['#22D3EE'],
               series : this.data.weeklyExpenses.series,
               stroke : {
                   curve: 'smooth'
               },
               tooltip: {
                   theme: 'dark'
               },
               xaxis  : {
                   type      : 'category',
                   categories: this.data.weeklyExpenses.labels
               },
               yaxis  : {
                   labels: {
                       formatter: (val): string => `$${val}`
                   }
               }
           };
   
           // Monthly expenses
           this.chartMonthlyExpenses = {
               chart  : {
                   animations: {
                       enabled: false
                   },
                   fontFamily: 'inherit',
                   foreColor : 'inherit',
                   height    : '100%',
                   type      : 'line',
                   sparkline : {
                       enabled: true
                   }
               },
               colors : ['#4ADE80'],
               series : this.data.monthlyExpenses.series,
               stroke : {
                   curve: 'smooth'
               },
               tooltip: {
                   theme: 'dark'
               },
               xaxis  : {
                   type      : 'category',
                   categories: this.data.monthlyExpenses.labels
               },
               yaxis  : {
                   labels: {
                       formatter: (val): string => `$${val}`
                   }
               }
           };
   
           // Yearly expenses
           this.chartYearlyExpenses = {
               chart  : {
                   animations: {
                       enabled: false
                   },
                   fontFamily: 'inherit',
                   foreColor : 'inherit',
                   height    : '100%',
                   type      : 'line',
                   sparkline : {
                       enabled: true
                   }
               },
               colors : ['#FB7185'],
               series : this.data.yearlyExpenses.series,
               stroke : {
                   curve: 'smooth'
               },
               tooltip: {
                   theme: 'dark'
               },
               xaxis  : {
                   type      : 'category',
                   categories: this.data.yearlyExpenses.labels
               },
               yaxis  : {
                   labels: {
                       formatter: (val): string => `$${val}`
                   }
               }
           };
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
