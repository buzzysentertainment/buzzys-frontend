import { AddInflatableData, ListInflatablesData, UpdateInflatableData, UpdateInflatableVariables, DeleteInflatableData, DeleteInflatableVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddInflatable(options?: useDataConnectMutationOptions<AddInflatableData, FirebaseError, void>): UseDataConnectMutationResult<AddInflatableData, undefined>;
export function useAddInflatable(dc: DataConnect, options?: useDataConnectMutationOptions<AddInflatableData, FirebaseError, void>): UseDataConnectMutationResult<AddInflatableData, undefined>;

export function useListInflatables(options?: useDataConnectQueryOptions<ListInflatablesData>): UseDataConnectQueryResult<ListInflatablesData, undefined>;
export function useListInflatables(dc: DataConnect, options?: useDataConnectQueryOptions<ListInflatablesData>): UseDataConnectQueryResult<ListInflatablesData, undefined>;

export function useUpdateInflatable(options?: useDataConnectMutationOptions<UpdateInflatableData, FirebaseError, UpdateInflatableVariables>): UseDataConnectMutationResult<UpdateInflatableData, UpdateInflatableVariables>;
export function useUpdateInflatable(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateInflatableData, FirebaseError, UpdateInflatableVariables>): UseDataConnectMutationResult<UpdateInflatableData, UpdateInflatableVariables>;

export function useDeleteInflatable(options?: useDataConnectMutationOptions<DeleteInflatableData, FirebaseError, DeleteInflatableVariables>): UseDataConnectMutationResult<DeleteInflatableData, DeleteInflatableVariables>;
export function useDeleteInflatable(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteInflatableData, FirebaseError, DeleteInflatableVariables>): UseDataConnectMutationResult<DeleteInflatableData, DeleteInflatableVariables>;
