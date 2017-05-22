define(['jquery', 
  'modules/tabs/tab',
  'modules/panels/summaryPanel',
  'modules/panels/credentialsPanel', 
  'modules/panels/locationsPanel',
  'modules/panels/datamappingPanel',
  'modules/panels/returnpolicyPanel',
  'modules/panels/fulfillmentpolicyPanel',
  'modules/panels/paymentpolicyPanel'
],
function(nsc, 
  objTab, 
  objSummaryPanel, 
  objCredentialsPanel, 
  objLocationsPanel, 
  objDatamappingPanel,
  objReturnsPanel,
  objFulfillmentPanel,
  objPaymentPanel
) {
   
  var objDashboard = {};

  objDashboard.__proto__ = objTab;
  
  objDashboard.sName = 'Dashboard';
  objDashboard.sCode = 'dashboard';
  
  objDashboard.objSettings.bFirstShow = true;
  
  objDashboard.objChildPanels = {
    summarypanel             : objSummaryPanel,
    credentialspanel         : objCredentialsPanel,
    locationspanel           : objLocationsPanel,
    datamappingpanel         : objDatamappingPanel,
    returnpoliciespanel      : objReturnsPanel,
    fulfillmentpoliciesPanel : objFulfillmentPanel,
    paymentpoliciesPanel     : objPaymentPanel
  };
  objDashboard.objStatusPanels = {
    credentialspanel         : objCredentialsPanel,
    locationspanel           : objLocationsPanel,
    datamappingpanel         : objDatamappingPanel,
    returnpoliciespanel      : objReturnsPanel,
    filfillmentpoliciespanel : objFulfillmentPanel,
    paymentpoliciesPanel     : objPaymentPanel
  };  
  
  objDashboard.initialize = function() {
    for (var sPanelCode in objDashboard.objChildPanels) {
      objDashboard.objChildPanels[sPanelCode].initialize();
    }
    
    /* Show an explanatory modal */
    objDashboard.showModal();
  };
  
  objDashboard.getPanelContent = function() {
    var sHTML = '';
    
    sHTML += '<div class="row">';
    
    /* The main panel area*/
    sHTML += '<div class="col-md-8">';
    if (objDashboard.objSettings.bFirstShow) {
      sHTML += objDashboard.getWelcomePanelMarkup();
    }
    sHTML += objSummaryPanel.getPanelMarkup();
    sHTML += '</div><!-- .col-md-8 -->';
    
    /* The right hand side panel */
    sHTML += '<div class="col-md-4">';
    for (var sPanelCode in objDashboard.objStatusPanels) {
      sHTML += objDashboard.objStatusPanels[sPanelCode].getPanelMarkup();
    }
    sHTML += '</div><!-- .col-md-4 -->';
    
    sHTML += '</div><!-- .row -->';
    
    return sHTML;
  };
  
  objDashboard.setListeners = function() {
    for (var sPanelCode in objDashboard.objChildPanels) {
      objDashboard.objChildPanels[sPanelCode].setListeners();
    }
  };
  
  objDashboard.getWelcomePanelMarkup = function() {
    var sHTML = '';
      
    sHTML += '<div class="panel panel-default">';
    sHTML += '<div class="panel-heading">';
    sHTML += '<b>Welcome</b> to your eBay management app!';
    sHTML += '</div>';
    sHTML += '<div class="panel-body">';
    sHTML += '<p>Use this dashboard to set up and manage your eBay account. Panels that are red need attention, simply click on them. Panels that are green indicate working functionality.</p>';
    sHTML += '</div>';
    sHTML += '</div>';

    objDashboard.objSettings.bFirstShow = false;

    return sHTML;
  };
  
  objDashboard.showModal = function() {
    var sHTML = '';
    
    sHTML += '<div id="initial-modal-anchor" class="modal fade" tabindex="-1" role="dialog">';
    sHTML += '  <div class="modal-dialog" role="document">';
    sHTML += '    <div class="modal-content">';
    sHTML += '      <div class="modal-header">';
    sHTML += this.getModalHeaderMarkup();
    sHTML += '      </div>';
    sHTML += '      <div class="modal-body">';
    sHTML += this.getModalBodyMarkup();
    sHTML += '      </div>';
    sHTML += '      <div class="modal-footer">';
    sHTML += this.getModalFooterMarkup();
    sHTML += '      </div>';
    sHTML += '    </div><!-- /.modal-content -->';
    sHTML += '  </div><!-- /.modal-dialog -->';
    sHTML += '</div><!-- /.modal-anchor -->';
    
    nsc('#initial-modal-anchor').replaceWith(sHTML);
    nsc('#initial-modal-anchor').modal('show');
  };
  
  objDashboard.getModalHeaderMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    sHTML += '<h4 class="modal-title">Masters in Software Development @ CIT</h4>';
    return sHTML;
  };
  
  objDashboard.getModalBodyMarkup = function() {
    var sHTML = '';

    sHTML += '<p>This is a prototype offering an eBay channel in an omnichannel e-commerce solution.</p>';
    sHTML += '<p>The prototype is set up talk to the eBay sandbox allowing a retailer to push items from their web store database to an eBay marketplace. This is a <em>thin</em> prototype designed to allow the user get an item listed and download any subsequent orders. It is not feature complete.</p>';
    sHTML += '<p>Some knowledge of listing on ebay process is beneficial. To workflow can be summarised as follows:</p>';
    sHTML += '<ol>';
    sHTML += '<li>Ensure all the panels on the <em>Dashboard</em> tab are green. If any panels are red click on them and follow the instructions.</li>';
    sHTML += '<li>On the <em>Store</em> tab push an item to eBay</li>';
    sHTML += '<li>On the <em>eBay</em> tab create an offer from an item in the catalogue</li>';
    sHTML += '<li>Publish an offer when you are happy with it - this can take a while</li>';
    sHTML += '<li>You can find a link to the listing on offer list modal</li>';
    sHTML += '</ol>';
    sHTML += '<div class="panel panel-default">';
    sHTML += '  <div class="panel-heading">Test Credentials</div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <dl class="dl-horizontal">';
    sHTML += '      <dt>Retailer eBay Account</dt>';
    sHTML += '      <dd>testuser_aileen2</dd>';
    sHTML += '      <dt>Password</dt>';
    sHTML += '      <dd>password1!</dd>';
    sHTML += '      <dt>Shopper eBay Account</dt>';
    sHTML += '      <dd>testuser_alaname_shopper</dd>';
    sHTML += '      <dt>Password</dt>';
    sHTML += '      <dd>password1!</dd>';
    sHTML += '    </dl>';
    sHTML += '  </div>';
    sHTML += '</div>';
    
    return sHTML;
  };
  
  return objDashboard;
});