import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'buzzys-frontend',
  location: 'us-east4'
};

export const addInflatableRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddInflatable');
}
addInflatableRef.operationName = 'AddInflatable';

export function addInflatable(dc) {
  return executeMutation(addInflatableRef(dc));
}

export const listInflatablesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInflatables');
}
listInflatablesRef.operationName = 'ListInflatables';

export function listInflatables(dc) {
  return executeQuery(listInflatablesRef(dc));
}

export const updateInflatableRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateInflatable', inputVars);
}
updateInflatableRef.operationName = 'UpdateInflatable';

export function updateInflatable(dcOrVars, vars) {
  return executeMutation(updateInflatableRef(dcOrVars, vars));
}

export const deleteInflatableRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteInflatable', inputVars);
}
deleteInflatableRef.operationName = 'DeleteInflatable';

export function deleteInflatable(dcOrVars, vars) {
  return executeMutation(deleteInflatableRef(dcOrVars, vars));
}

