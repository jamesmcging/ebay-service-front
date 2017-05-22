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

    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      sHTML += '<div class="row">';
      sHTML += '<div id="ebay-catalogue-main" class="col-sm-12">';
      sHTML += objEbayOrdersPanel.getItemListHeaderMarkup();
      sHTML += objEbayOrdersPanel.getItemListMarkup();
      sHTML += '</div>';
      sHTML += '</div><!-- .row -->';
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
        objEbayOrdersPanel.displayAlert('warning', 'This panel needs the credentials panel to be active');
      }
    });

    nsc(document).on('ordersfetched', function(event, nOrderCount) {
      console.log('orders fetched. Order total: '+nOrderCount);
    });
  };
    
  objEbayOrdersPanel.initialize = function() {};
  
  //////////////////////////////////////////////////////////////////////////////
  //
  //  Ebay Orders Panel Element Markup
  //
  //////////////////////////////////////////////////////////////////////////////
  objEbayOrdersPanel.getItemListHeaderMarkup = function() {
    var sHTML = '';
    
    sHTML += '<p>Header for orders panel</p>';
    
    return sHTML;
  };
  
  objEbayOrdersPanel.getItemListMarkup = function() {
    var objOrders = app.objModel.objEbayOrdersModel.getOrders();
    var sHTML     = '';
    
    sHTML += '<p>Fetching orders from eBay</p>';
    
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