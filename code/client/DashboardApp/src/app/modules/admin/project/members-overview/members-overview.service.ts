import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { API_UTILS } from 'app/core/utils/api.utils';

@Injectable({
    providedIn: 'root'
})
export class MembersOverviewService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
     
          /**
     * Send new member email
     *
     * @param folder
     */
     sendNewMemberEmail(credentials: { email: string; password: string }): Observable<any>
     {
       const apiUrl = API_UTILS.config.base+API_UTILS.config.fileManager.createItem;
       const headers = { 'Authorization': 'Bearer '+ localStorage.getItem('accessToken') };

       return this._httpClient.post(apiUrl, credentials, { headers }).pipe(
           switchMap((response: any) => {
               return of(response);
           })
       );
     }
    
    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
}
