define(['jquery', 'modules/ebayApi/restCaller'], function(nsc, objRestCaller) {
   
  var objFulfillmentApi = {};

  objFulfillmentApi.__proto__ = objRestCaller;
  
  objFulfillmentApi.sApiName = 'fulfillment';

  objFulfillmentApi.getOrders = function(sCallbackFunction) {
    /* GET https://api.ebay.com/sell/fulfillment/v1/order 
     * This filter will return 100 orders not yet started
     */
    this.makeCall('get', objFulfillmentApi.sApiName, 'order?filter=orderfulfillmentstatus:%7BNOT_STARTED%7CIN_PROGRESS%7D', '', {}, sCallbackFunction);
  };
  
  objFulfillmentApi.getOrder = function(nOrderId, sCallbackFunction) {
    /* GET https://api.ebay.com/sell/fulfillment/v1/order/{nOrderId} */
    this.makeCall('get', objFulfillmentApi.sApiName, 'order', nOrderId, {}, sCallbackFunction);
  };
  
  return objFulfillmentApi;
});