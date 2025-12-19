import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddInflatableData {
  inflatable_insert: Inflatable_Key;
}

export interface BookingItem_Key {
  bookingId: UUIDString;
  inflatableId: UUIDString;
  __typename?: 'BookingItem_Key';
}

export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface DeleteInflatableData {
  inflatable_delete?: Inflatable_Key | null;
}

export interface DeleteInflatableVariables {
  id: UUIDString;
}

export interface Inflatable_Key {
  id: UUIDString;
  __typename?: 'Inflatable_Key';
}

export interface ListInflatablesData {
  inflatables: ({
    id: UUIDString;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    pricePerDay: number;
  } & Inflatable_Key)[];
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface UpdateInflatableData {
  inflatable_update?: Inflatable_Key | null;
}

export interface UpdateInflatableVariables {
  id: UUIDString;
  pricePerDay?: number | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddInflatableRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<AddInflatableData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<AddInflatableData, undefined>;
  operationName: string;
}
export const addInflatableRef: AddInflatableRef;

export function addInflatable(): MutationPromise<AddInflatableData, undefined>;
export function addInflatable(dc: DataConnect): MutationPromise<AddInflatableData, undefined>;

interface ListInflatablesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInflatablesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListInflatablesData, undefined>;
  operationName: string;
}
export const listInflatablesRef: ListInflatablesRef;

export function listInflatables(): QueryPromise<ListInflatablesData, undefined>;
export function listInflatables(dc: DataConnect): QueryPromise<ListInflatablesData, undefined>;

interface UpdateInflatableRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInflatableVariables): MutationRef<UpdateInflatableData, UpdateInflatableVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateInflatableVariables): MutationRef<UpdateInflatableData, UpdateInflatableVariables>;
  operationName: string;
}
export const updateInflatableRef: UpdateInflatableRef;

export function updateInflatable(vars: UpdateInflatableVariables): MutationPromise<UpdateInflatableData, UpdateInflatableVariables>;
export function updateInflatable(dc: DataConnect, vars: UpdateInflatableVariables): MutationPromise<UpdateInflatableData, UpdateInflatableVariables>;

interface DeleteInflatableRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteInflatableVariables): MutationRef<DeleteInflatableData, DeleteInflatableVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteInflatableVariables): MutationRef<DeleteInflatableData, DeleteInflatableVariables>;
  operationName: string;
}
export const deleteInflatableRef: DeleteInflatableRef;

export function deleteInflatable(vars: DeleteInflatableVariables): MutationPromise<DeleteInflatableData, DeleteInflatableVariables>;
export function deleteInflatable(dc: DataConnect, vars: DeleteInflatableVariables): MutationPromise<DeleteInflatableData, DeleteInflatableVariables>;

