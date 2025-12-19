const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'buzzys-frontend',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const addInflatableRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddInflatable');
}
addInflatableRef.operationName = 'AddInflatable';
exports.addInflatableRef = addInflatableRef;

exports.addInflatable = function addInflatable(dc) {
  return executeMutation(addInflatableRef(dc));
};

const listInflatablesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListInflatables');
}
listInflatablesRef.operationName = 'ListInflatables';
exports.listInflatablesRef = listInflatablesRef;

exports.listInflatables = function listInflatables(dc) {
  return executeQuery(listInflatablesRef(dc));
};

const updateInflatableRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateInflatable', inputVars);
}
updateInflatableRef.operationName = 'UpdateInflatable';
exports.updateInflatableRef = updateInflatableRef;

exports.updateInflatable = function updateInflatable(dcOrVars, vars) {
  return executeMutation(updateInflatableRef(dcOrVars, vars));
};

const deleteInflatableRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteInflatable', inputVars);
}
deleteInflatableRef.operationName = 'DeleteInflatable';
exports.deleteInflatableRef = deleteInflatableRef;

exports.deleteInflatable = function deleteInflatable(dcOrVars, vars) {
  return executeMutation(deleteInflatableRef(dcOrVars, vars));
};
