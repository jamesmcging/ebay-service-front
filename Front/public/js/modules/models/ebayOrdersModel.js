define([
    'jquery',
    'modules/ebayApi/fulfillment'
  ],
  function(
    nsc,
    objFulfillmentApi
  ) {
   
  var objEbayOrdersModel = {};
  
  objEbayOrdersModel.objOrders = {};
  
  objEbayOrdersModel.nOrderCount = null;
  
  objEbayOrdersModel.initialize = function() {};

  //////////////////////////////////////////////////////////////////////////////
  //
  //  Local requests to the model
  //
  //////////////////////////////////////////////////////////////////////////////  
  objEbayOrdersModel.getOrders = function() {
    if (objEbayOrdersModel.nOrderCount === null) {
      objEbayOrdersModel.getUnfulfilledOrdersFromEbay();
    }
    
    return objEbayOrdersModel.objOrders;
  };
  
  //////////////////////////////////////////////////////////////////////////////
  //
  //  Calls to the eBay API
  //
  //////////////////////////////////////////////////////////////////////////////
  objEbayOrdersModel.getUnfulfilledOrdersFromEbay = function() {
    objFulfillmentApi.getOrders(objEbayOrdersModel.getUnfulfilledOrdersFromEbayRestResponse);
  };
  
  objEbayOrdersModel.getUnfulfilledOrdersFromEbayRestResponse = function(objResponseData) {
    if (objResponseData.nResponseCode === 200) {
      for (var i = 0, nLength = objResponseData.sResponseMessage.orders.length; i < nLength; i++) {
        var nOrderId = objResponseData.sResponseMessage.orders[i].orderId;
        objEbayOrdersModel.objOrders[nOrderId] = objResponseData.sResponseMessage.orders[i];
      }
      
      objEbayOrdersModel.nOrderCount = Object.keys(objResponseData.sResponseMessage.orders).length;
    }
    nsc(document).trigger('ordersfetched', [objEbayOrdersModel.nOrderCount]);
  };
  
  return objEbayOrdersModel;
});