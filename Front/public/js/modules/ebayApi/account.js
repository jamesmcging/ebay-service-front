define(['jquery', 
    'modules/ebayApi/restCaller'], 
  function(nsc, 
    objRestCaller) {
   
  var objAccountApi = {};

  objAccountApi.__proto__ = objRestCaller;
  
  objAccountApi.sApiName = 'account';
  
  //////////////////////////////////////////////////////////////////////////////
  //
  // Return Policies
  //
  //////////////////////////////////////////////////////////////////////////////
  objAccountApi.createPolicy = function(sPolicyType, objPolicyData, sCallbackFunction) {
    // POST https://api.ebay.com/sell/account/v1/return_policy
    this.makeCall('post', objAccountApi.sApiName, sPolicyType, '', objPolicyData, sCallbackFunction);
  };

  objAccountApi.deletePolicy = function(sPolicyType, nPolicyId, objData, sCallbackFunction) {
    // DELETE https://api.ebay.com/sell/account/v1/return_policy/{nPolicyId}
    this.makeCall('delete', objAccountApi.sApiName, sPolicyType, nPolicyId, objData, sCallbackFunction);
  };
  
  objAccountApi.getPoliciesByMarketplace = function(sPolicyType, sMarketplaceId, sCallbackFunction) {
    // GET https://api.ebay.com/sell/account/v1/return_policy?marketplace_id=MarketplaceIdEnum
    this.makeCall('get', objAccountApi.sApiName, sPolicyType, '?marketplace_id='+sMarketplaceId, {}, sCallbackFunction);
  };
  
  objAccountApi.getReturnPolicyById = function(nPolicyId, sCallbackFunction) {
    // GET https://api.ebay.com/sell/account/v1/return_policy/{nPolicyId}
    this.makeCall('get', objAccountApi.sApiName, 'return_policy', nPolicyId, {}, sCallbackFunction);
  };
  
  objAccountApi.getReturnPolicyByName = function(sPolicyName, sMarketplaceId, sCallbackFunction) {
    // GET https://api.ebay.com/sell/account/v1/return_policy/get_by_policy_name?marketplace_id=MARKETPLACEID&name=STRING
    this.makeCall('get', objAccountApi.sApiName, 'return_policy', '?marketplace_id='+sMarketplaceId+'&name='+sPolicyName, {}, sCallbackFunction);
  };
  
  objAccountApi.updatePolicy = function(sPolicyType, nPolicyId, objPolicyData, sCallbackFunction) {
    // GET https://api.ebay.com/sell/account/v1/return_policy/{nPolicyId}
    this.makeCall('put', objAccountApi.sApiName, sPolicyType, nPolicyId, objPolicyData, sCallbackFunction);
  };
    
  return objAccountApi;
});