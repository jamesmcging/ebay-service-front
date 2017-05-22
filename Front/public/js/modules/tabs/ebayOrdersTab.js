define([
    'jquery', 
    'modules/tabs/tab',
    'modules/panels/ordersPanel'
  ],
  function(
    nsc,
    objTab,
    objOrdersPanel
  ) {
  
  var objOrders = {};

  objOrders.__proto__ = objTab;
  
  objOrders.sName = 'Orders';
  objOrders.sCode = 'orders';
  
  objOrders.objChildPanels = {
    listingpanel : objOrdersPanel
  };
  
  objOrders.getPanelContent = function() {    
    var sHTML = '';
    
    for (var sPanelCode in objOrders.objChildPanels) {
      sHTML += objOrders.objChildPanels[sPanelCode].getPanelMarkup();
    }
    
    return sHTML;
  };
  
  objOrders.setListeners = function() {
    for (var sPanelCode in objOrders.objChildPanels) {
      objOrders.objChildPanels[sPanelCode].setListeners();
    }
  };
  
  return objOrders;
});