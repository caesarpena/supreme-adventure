export interface Items
{
    folders: Item[];
    files: Item[];
    path: any[];
}

export interface Item
{
    id?: string;
    folderId?: string;
    name?: string;
    createdBy?: string;
    createdAt?: string;
    modifiedAt?: string;
    size?: string;
    type?: string;
    mediaType?: string;
    contents?: string | null;
    description?: string | null;
    azureUrl?: string | null;
}

export interface createItem
{
    Id?: string;
    folderId?: string;
    name?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    size?: string;
    type?: string;
    mediaType?: string;
    contents?: string | null;
    description?: string | null;
    azureUrl?: string | null;
}
