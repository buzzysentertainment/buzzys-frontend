# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListInflatables*](#listinflatables)
- [**Mutations**](#mutations)
  - [*AddInflatable*](#addinflatable)
  - [*UpdateInflatable*](#updateinflatable)
  - [*DeleteInflatable*](#deleteinflatable)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListInflatables
You can execute the `ListInflatables` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listInflatables(): QueryPromise<ListInflatablesData, undefined>;

interface ListInflatablesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListInflatablesData, undefined>;
}
export const listInflatablesRef: ListInflatablesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listInflatables(dc: DataConnect): QueryPromise<ListInflatablesData, undefined>;

interface ListInflatablesRef {
  ...
  (dc: DataConnect): QueryRef<ListInflatablesData, undefined>;
}
export const listInflatablesRef: ListInflatablesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listInflatablesRef:
```typescript
const name = listInflatablesRef.operationName;
console.log(name);
```

### Variables
The `ListInflatables` query has no variables.
### Return Type
Recall that executing the `ListInflatables` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListInflatablesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListInflatables`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listInflatables } from '@dataconnect/generated';


// Call the `listInflatables()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listInflatables();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listInflatables(dataConnect);

console.log(data.inflatables);

// Or, you can use the `Promise` API.
listInflatables().then((response) => {
  const data = response.data;
  console.log(data.inflatables);
});
```

### Using `ListInflatables`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listInflatablesRef } from '@dataconnect/generated';


// Call the `listInflatablesRef()` function to get a reference to the query.
const ref = listInflatablesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listInflatablesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.inflatables);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.inflatables);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AddInflatable
You can execute the `AddInflatable` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addInflatable(): MutationPromise<AddInflatableData, undefined>;

interface AddInflatableRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<AddInflatableData, undefined>;
}
export const addInflatableRef: AddInflatableRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addInflatable(dc: DataConnect): MutationPromise<AddInflatableData, undefined>;

interface AddInflatableRef {
  ...
  (dc: DataConnect): MutationRef<AddInflatableData, undefined>;
}
export const addInflatableRef: AddInflatableRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addInflatableRef:
```typescript
const name = addInflatableRef.operationName;
console.log(name);
```

### Variables
The `AddInflatable` mutation has no variables.
### Return Type
Recall that executing the `AddInflatable` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddInflatableData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddInflatableData {
  inflatable_insert: Inflatable_Key;
}
```
### Using `AddInflatable`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addInflatable } from '@dataconnect/generated';


// Call the `addInflatable()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addInflatable();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addInflatable(dataConnect);

console.log(data.inflatable_insert);

// Or, you can use the `Promise` API.
addInflatable().then((response) => {
  const data = response.data;
  console.log(data.inflatable_insert);
});
```

### Using `AddInflatable`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addInflatableRef } from '@dataconnect/generated';


// Call the `addInflatableRef()` function to get a reference to the mutation.
const ref = addInflatableRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addInflatableRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inflatable_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inflatable_insert);
});
```

## UpdateInflatable
You can execute the `UpdateInflatable` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateInflatable(vars: UpdateInflatableVariables): MutationPromise<UpdateInflatableData, UpdateInflatableVariables>;

interface UpdateInflatableRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInflatableVariables): MutationRef<UpdateInflatableData, UpdateInflatableVariables>;
}
export const updateInflatableRef: UpdateInflatableRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateInflatable(dc: DataConnect, vars: UpdateInflatableVariables): MutationPromise<UpdateInflatableData, UpdateInflatableVariables>;

interface UpdateInflatableRef {
  ...
  (dc: DataConnect, vars: UpdateInflatableVariables): MutationRef<UpdateInflatableData, UpdateInflatableVariables>;
}
export const updateInflatableRef: UpdateInflatableRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateInflatableRef:
```typescript
const name = updateInflatableRef.operationName;
console.log(name);
```

### Variables
The `UpdateInflatable` mutation requires an argument of type `UpdateInflatableVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateInflatableVariables {
  id: UUIDString;
  pricePerDay?: number | null;
}
```
### Return Type
Recall that executing the `UpdateInflatable` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateInflatableData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateInflatableData {
  inflatable_update?: Inflatable_Key | null;
}
```
### Using `UpdateInflatable`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateInflatable, UpdateInflatableVariables } from '@dataconnect/generated';

// The `UpdateInflatable` mutation requires an argument of type `UpdateInflatableVariables`:
const updateInflatableVars: UpdateInflatableVariables = {
  id: ..., 
  pricePerDay: ..., // optional
};

// Call the `updateInflatable()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateInflatable(updateInflatableVars);
// Variables can be defined inline as well.
const { data } = await updateInflatable({ id: ..., pricePerDay: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateInflatable(dataConnect, updateInflatableVars);

console.log(data.inflatable_update);

// Or, you can use the `Promise` API.
updateInflatable(updateInflatableVars).then((response) => {
  const data = response.data;
  console.log(data.inflatable_update);
});
```

### Using `UpdateInflatable`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateInflatableRef, UpdateInflatableVariables } from '@dataconnect/generated';

// The `UpdateInflatable` mutation requires an argument of type `UpdateInflatableVariables`:
const updateInflatableVars: UpdateInflatableVariables = {
  id: ..., 
  pricePerDay: ..., // optional
};

// Call the `updateInflatableRef()` function to get a reference to the mutation.
const ref = updateInflatableRef(updateInflatableVars);
// Variables can be defined inline as well.
const ref = updateInflatableRef({ id: ..., pricePerDay: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateInflatableRef(dataConnect, updateInflatableVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inflatable_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inflatable_update);
});
```

## DeleteInflatable
You can execute the `DeleteInflatable` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteInflatable(vars: DeleteInflatableVariables): MutationPromise<DeleteInflatableData, DeleteInflatableVariables>;

interface DeleteInflatableRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteInflatableVariables): MutationRef<DeleteInflatableData, DeleteInflatableVariables>;
}
export const deleteInflatableRef: DeleteInflatableRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteInflatable(dc: DataConnect, vars: DeleteInflatableVariables): MutationPromise<DeleteInflatableData, DeleteInflatableVariables>;

interface DeleteInflatableRef {
  ...
  (dc: DataConnect, vars: DeleteInflatableVariables): MutationRef<DeleteInflatableData, DeleteInflatableVariables>;
}
export const deleteInflatableRef: DeleteInflatableRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteInflatableRef:
```typescript
const name = deleteInflatableRef.operationName;
console.log(name);
```

### Variables
The `DeleteInflatable` mutation requires an argument of type `DeleteInflatableVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteInflatableVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteInflatable` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteInflatableData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteInflatableData {
  inflatable_delete?: Inflatable_Key | null;
}
```
### Using `DeleteInflatable`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteInflatable, DeleteInflatableVariables } from '@dataconnect/generated';

// The `DeleteInflatable` mutation requires an argument of type `DeleteInflatableVariables`:
const deleteInflatableVars: DeleteInflatableVariables = {
  id: ..., 
};

// Call the `deleteInflatable()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteInflatable(deleteInflatableVars);
// Variables can be defined inline as well.
const { data } = await deleteInflatable({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteInflatable(dataConnect, deleteInflatableVars);

console.log(data.inflatable_delete);

// Or, you can use the `Promise` API.
deleteInflatable(deleteInflatableVars).then((response) => {
  const data = response.data;
  console.log(data.inflatable_delete);
});
```

### Using `DeleteInflatable`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteInflatableRef, DeleteInflatableVariables } from '@dataconnect/generated';

// The `DeleteInflatable` mutation requires an argument of type `DeleteInflatableVariables`:
const deleteInflatableVars: DeleteInflatableVariables = {
  id: ..., 
};

// Call the `deleteInflatableRef()` function to get a reference to the mutation.
const ref = deleteInflatableRef(deleteInflatableVars);
// Variables can be defined inline as well.
const ref = deleteInflatableRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteInflatableRef(dataConnect, deleteInflatableVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.inflatable_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.inflatable_delete);
});
```

