import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, empty, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { createItem, Item, Items } from './file-manager.types';
import { API_UTILS } from 'app/core/utils/api.utils';

@Injectable({
    providedIn: 'root'
})
export class FileManagerService
{
    // Private
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);
    itemId: string = "";

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
     * Getter for items
     */
    get items$(): Observable<Items>
    {
        return this._items.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Item>
    {
        return this._item.asObservable();
    }

    private _getHeaders() : HttpHeaders {
        let headers = new HttpHeaders();
        headers.append('content-type', 'x-www-form-urlencoded'); 
        headers.append('Authorization', 'Bearer '+ localStorage.getItem('accessToken'));
     
        return headers;
     }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Upload file to azure
     *
     * @param formData
     */
    uploadFile(formData: FormData) {
        const apiUrl = API_UTILS.config.base+API_UTILS.config.UploadEncodeAndStreamFiles.uploadFile;
        var headers = this._getHeaders();
       
        return this._httpClient.post<{ path: string }>(
            apiUrl,
            formData,
            {headers: headers}
        ).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
      }


     /**
     * Create New Folder
     *
     * @param folder
     */
      createNewItem(item: any): Observable<any>
      {
        const apiUrl = API_UTILS.config.base+API_UTILS.config.fileManager.createItem;
        const headers = { 'Authorization': 'Bearer '+ localStorage.getItem('accessToken') };

        return this._httpClient.post(apiUrl, item, { headers }).pipe(
            switchMap((response: any) => {
                return of(response);
            })
        );
      }

    /**
     * Get items
     */

    getItems(folderId: string | null = null): Observable<Item[]>
    {
        this.itemId = folderId;
        const apiUrl = API_UTILS.config.base+API_UTILS.config.fileManager.getItems
        const headers = { 
            'Authorization': 'Bearer '+ localStorage.getItem('accessToken') 
          };
        const options = folderId? {headers, params: {folderId}} : {headers, params: {}};

        return this._httpClient.get<Items>(apiUrl, options).pipe(
            tap((response: any) => {
                this._items.next(response);
            })
        );
    }

    /**
     * edit item
     */

     editItems(folderId: string): Observable<Item[]>
     {
         const apiUrl = API_UTILS.config.base+API_UTILS.config.fileManager.getItems
         const headers = { 
             'Authorization': 'Bearer '+ localStorage.getItem('accessToken') 
           };
         const options = {headers, params: {folderId}};
 
         return this._httpClient.post(apiUrl, options).pipe(
             tap((response: any) => {
                 this._items.next(response);
             })
         );
     }

    /**
     * Refresh items
     */
     refreshItems(): Observable<Items>
     {
         const apiUrl = API_UTILS.config.base+API_UTILS.config.fileManager.getItems
         const headers = { 'Authorization': 'Bearer '+ localStorage.getItem('accessToken') };
         const folderId = this.itemId;
         const options = folderId? {headers, params: {folderId}} : {headers, params: {}};
         return this._httpClient.get<Items>(apiUrl, options).pipe(
            switchMap((response: Items) => {
                return of(response);
            })
        );
     }

    /**
     * Get item by id
     */
    getItemById(id: string): Observable<Item>
    {
        return this._items.pipe(
            take(1),
            map((items) => {

                // Find within the folders and files
                const item = [...items.folders, ...items.files].find(value => value.id === id) || null;

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
            }),
            switchMap((item) => {

                if ( !item )
                {
                    return throwError('Could not found the item with id of ' + id + '!');
                }

                return of(item);
            })
        );
    }
}
