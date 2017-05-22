define([
    'jquery',
    'modules/panels/panel',
    'modules/models/ebayOrdersModel'
  ],
  function(
    nsc,
    objPanel,
    objEbayOrdersModel
  ) {
  var objEbayOrdersPanel = {};
  
  objEbayOrdersPanel.__proto__ = objPanel;
  
  objEbayOrdersPanel.sName = 'Ebay Orders';
  objEbayOrdersPanel.sCode = 'ebayordersPanel';
  objEbayOrdersPanel.objSettings = {};
  
  objEbayOrdersPanel.getPanelContent = function() {
    var sHTML = '';

    sHTML += '<div class="panel panel-default">';
    sHTML += '  <div class="panel-heading">Ebay Orders</div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Any orders that your listings generate are displayed below. Review the listing and select those that you want to go down to your POS.</p>';
    sHTML += '    <p>As eBay expand their fulfillment API expect to be able to give feedback to shoppers from this panel.</p>';
    sHTML += '  </div>';
    sHTML += '</div>';

    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      sHTML += objEbayOrdersPanel.getOrderListHeaderMarkup();
      sHTML += objEbayOrdersPanel.getOrderListMarkup();
    } else {
      sHTML += '<div class="alert alert-warning">This panel needs the credentials panel to be active.</div>';
    }
      
    return sHTML;
  };
  
  objEbayOrdersPanel.setListeners = function() {
    nsc(document).on('credentialsPanelUpdated', function() {
      if (app.objModel.objEbayAuthorization.getStatus() === 4) {
        objEbayOrdersPanel.render();
      } else {
        app.objInterface.displayAlert('warning', 'This panel needs the credentials panel to be active');
      }
    });

    nsc(document).on('ordersfetched', function(event, nOrderCount) {
      objEbayOrdersPanel.render();
    });
    
    nsc('.sendToPos').off().on('click', function() {
      var sOrderId = nsc(this).data('orderid');
      app.objModel.objEbayOrdersModel.sendOrderToPos(sOrderId, objEbayOrdersPanel.orderSaved);
    });
  };
    
  objEbayOrdersPanel.initialize = function() {};
  
  objEbayOrdersPanel.orderSaved = function(objResponseData) {
    console.log(objResponseData);
    objEbayOrdersPanel.render();
    app.objInterface.displayAlert('success', 'Order saved to the store DB');
  };
  
  //////////////////////////////////////////////////////////////////////////////
  //
  //  Ebay Orders Panel Element Markup
  //
  //////////////////////////////////////////////////////////////////////////////
  objEbayOrdersPanel.getOrderListHeaderMarkup = function() {
    var sHTML = '';
    
    sHTML += '<div id="order-list-header">';
    sHTML += '  <div class="col-sm-1">';
    sHTML += '    <input type="checkbox" id="order-list-selectallcheckbox">';
    sHTML += '  </div>';
    sHTML += '  <div class="col-sm-2">Order Placed</div>';
    sHTML += '  <div class="col-sm-3">Details</div>';
    sHTML += '  <div class="col-sm-2">Fulfillment</div>';
    sHTML += '  <div class="col-sm-2">Status</div>';
    sHTML += '  <div class="col-sm-2">Action</div>';
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objEbayOrdersPanel.getOrderListMarkup = function() {
    var objOrders = app.objModel.objEbayOrdersModel.getOrders();
    var sHTML     = '';
    
    if (Object.keys(objOrders).length > 0) {
      for (var sOrderId in objOrders) {
        sHTML += '<div class="order-list-order">';
        sHTML += objEbayOrdersPanel.getOrderMarkup(sOrderId, objOrders[sOrderId]);
        sHTML += '</div>';
      }
    } else {
      sHTML += '<br>';
      sHTML += '<div class="alert alert-warning">No outstanding orders on eBay</div>';
    }
    
    return sHTML;    
  };
  
  objEbayOrdersPanel.getOrderMarkup = function(sOrderId, objOrder) {
    var sHTML = '';

    /* The bulk action row */
    sHTML += '  <div class="col-sm-1">';
    sHTML += '    <input type="checkbox" data-orderid="'+sOrderId+'">';
    sHTML += '  </div>';
    
    /* The order date */
    sHTML += '  <div class="col-sm-2">';
    sHTML += objOrder.creationDate;
    sHTML += '  </div>';

    /* The order details */
    sHTML += '  <div class="col-sm-3">';
    sHTML += objEbayOrdersPanel.getOrderDetailsMarkup(objOrder);
    sHTML += '  </div>';
    
    /* The fulfillment details */
    sHTML += '  <div class="col-sm-2">';
    sHTML += objEbayOrdersPanel.getOrderShippingMarkup(objOrder);
    sHTML += '  </div>';
    
    /* The order status */
    sHTML += '  <div class="col-sm-2">';
    sHTML += objEbayOrdersPanel.getOrderStatusMarkup(objOrder.orderFulfillmentStatus);
    sHTML += '  </div>';
    
    /* Action button */
    sHTML += '  <div class="col-sm-2">';
    sHTML += '    <button type="button" class="btn btn-default btn-sm sendToPos" data-orderid="'+sOrderId+'">Send to POS</button>';
    sHTML += '  </div>';
    
    return sHTML;
  };
  
  objEbayOrdersPanel.getOrderDetailsMarkup = function(objOrder) {
    var sHTML = '';
    
    sHTML += '<div class="order-detail-orderid">'+objOrder.orderId+'</div>';
    sHTML += '<div class="order-detail-lineitem">';
    for (var i = 0, nLength = objOrder.lineItems.length; i < nLength; i++) {
      var objLineItem = objOrder.lineItems[i];
      sHTML += '<div class="order-detail-lineitem-title">'+objLineItem.title+'</div>';
      sHTML += '<span class="order-detail-lineitem-quantity">Qty: '+objLineItem.quantity+'</span>';
      sHTML += '&nbsp;&nbsp;&nbsp;';
      sHTML += '<span class="order-detail-lineitem-productcode">Code: '+objLineItem.sku+'</span>';
    }
    sHTML += '</div>';
    sHTML += '<div class="order-detail-sellerid">'+objOrder.buyer.username+'</div>';
    sHTML += '<div class="order-detail-total">'+objOrder.pricingSummary.total.currency+objOrder.pricingSummary.total.value+'</div>';
    
    return sHTML;
  };
  
  objEbayOrdersPanel.getOrderShippingMarkup = function(objOrder) {
    var sHTML = '';
    sHTML += '<div class="order-detail-shipping">'+objOrder.fulfillmentStartInstructions[0].shippingStep.shippingServiceCode+'</div>';
    
    return sHTML;
  };
  
  objEbayOrdersPanel.getOrderStatusMarkup = function(sOrderStatus) {
    var arrPossibleStatus = ['FULFILLED', 'NOT_STARTED', 'IN_PROGRESS'];
    var sHTML = '';
    
    sHTML += '<select class="form-control input-sm">';
    for (var i = 0, nLength = arrPossibleStatus.length; i < nLength; i++) {
      var sSelected = '';
      if (sOrderStatus === arrPossibleStatus[i]) {
        sSelected = ' selected="selected"';
      }
      sHTML += '<option value="'+arrPossibleStatus[i]+'"'+sSelected+'>'+arrPossibleStatus[i]+'</option>';
    }
    sHTML += '</select>';
    
    return sHTML;
  };

  //////////////////////////////////////////////////////////////////////////////
  //
  //  Ebay Orders Panel Modal Functions
  //
  //////////////////////////////////////////////////////////////////////////////
  objEbayOrdersPanel.getModalHeaderMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    sHTML += '<h4 class="modal-title">'+this.sName+'</h4>';
    return sHTML;
  };
  
  objEbayOrdersPanel.getModalBodyMarkup = function() {
    return 'modal content needs overriden/ defined in the panel getModalBodyMarkup function';
  };
  
  objEbayOrdersPanel.getModalFooterMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    return sHTML;
  };
  
  return objEbayOrdersPanel;
});