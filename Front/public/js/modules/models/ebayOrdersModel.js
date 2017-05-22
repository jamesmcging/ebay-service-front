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
  
  objEbayOrdersModel.nNewOrderCount = null;
  
  objEbayOrdersModel.initialize = function() {};


  //////////////////////////////////////////////////////////////////////////////
  //
  //  Local requests to the model
  //
  //////////////////////////////////////////////////////////////////////////////  
  objEbayOrdersModel.getOrders = function() {
    if (objEbayOrdersModel.nNewOrderCount === null) {
      objEbayOrdersModel.getUnfulfilledOrdersFromEbay();
    }
    
    return objEbayOrdersModel.objOrders;
  };
  
  objEbayOrdersModel.getOrderById = function(sOrderId) {
    return objEbayOrdersModel.objOrders[sOrderId];
  };
  
  objEbayOrdersModel.getNewOrderCount = function() {
    return objEbayOrdersModel.nNewOrderCount;
  };
  
  
  //////////////////////////////////////////////////////////////////////////////
  //
  //  Calls to the local DB
  //
  //////////////////////////////////////////////////////////////////////////////  
  objEbayOrdersModel.sendOrderToPos = function(sOrderId, sCallbackFunction) {
    var objParams = {
      objOrder : objEbayOrdersModel.getOrderById(sOrderId),
    };

    var jqxhr = nsc.ajax({
      url      : app.objModel.objURLs.sOrdersURL+'/order/'+sOrderId,
      data     : objParams,
      dataType : 'json',
      type     : 'post'
    });

    jqxhr.done(function(responsedata) {
      responsedata.bOutcome = true;
      sCallbackFunction(responsedata);
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
      xhr.bOutcome = false;
    });
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
      
      objEbayOrdersModel.nNewOrderCount = Object.keys(objResponseData.sResponseMessage.orders).length;
    }
    nsc(document).trigger('ordersfetched', [objEbayOrdersModel.nNewOrderCount]);
  };
  
  return objEbayOrdersModel;
});