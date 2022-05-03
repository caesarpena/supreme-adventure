import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

     /**
     * Create New Folder
     *
     * @param folder
     */
      createNewItem(folder: createItem): Observable<any>
      {
        const apiUrl = API_UTILS.config.base+API_UTILS.config.fileManager.createItems
        const headers = { 'Authorization': 'Bearer '+ localStorage.getItem('accessToken') };
        const body = folder;

        return this._httpClient.post(apiUrl, body, { headers }).pipe(
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
        const apiUrl = API_UTILS.config.base+API_UTILS.config.fileManager.getItems
        const headers = { 'Authorization': 'Bearer '+ localStorage.getItem('accessToken') };

        return this._httpClient.get<Items>(apiUrl, { headers }).pipe(
            tap((response: any) => {
                this._items.next(response);
            })
        );
    }

    /**
     * Refresh items
     */
     refreshItems(folderId: string | null = null): Observable<Items>
     {
         const apiUrl = API_UTILS.config.base+API_UTILS.config.fileManager.getItems
         const headers = { 'Authorization': 'Bearer '+ localStorage.getItem('accessToken') };
 
         return this._httpClient.get<Items>(apiUrl, { headers }).pipe(
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
