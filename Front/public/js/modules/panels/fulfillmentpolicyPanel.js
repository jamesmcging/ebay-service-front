define(['jquery', 
  'modules/panels/statusPanel'], 
function(nsc, 
  objStatusPanel) {
   
  var objFulfillmentPoliciesPanel = {};

  objFulfillmentPoliciesPanel.__proto__ = objStatusPanel;
  
  objFulfillmentPoliciesPanel.sName = 'Fulfillment Policies';
  objFulfillmentPoliciesPanel.sCode = 'fulfillmentpoliciespanel';
  
  objFulfillmentPoliciesPanel.objChildPanels = {};
  
  objFulfillmentPoliciesPanel.objSettings.bActive = false;
  
  objFulfillmentPoliciesPanel.getPanelContent = function() {    
    var sHTML = '';
    
    sHTML += '<div class="row">';
    
    sHTML += '<div class="col-sm-2">';
    sHTML += '<span class="status-panel-icon" id="'+this.sCode+'-status-icon"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-10">';
    sHTML += '<h3 id="'+this.sCode+'-status-title">'+this.sName+'</h3>';
    sHTML += '<p id="'+this.sCode+'-status-text">';
    sHTML += 'Click to set or update fulfillment policies';
    sHTML += '</p>';
    sHTML += '</div>';
    
    sHTML += '</div><!-- .row -->';
    
    return sHTML;
  };
  
  objFulfillmentPoliciesPanel.setListeners = function() {
    nsc('#'+this.sCode+'-panel').off().on('click', function() {
      if (app.objModel.objEbayAuthorization.getStatus() === 4) {
        objFulfillmentPoliciesPanel.showModal();
        objFulfillmentPoliciesPanel.setModalListeners();
      } else {
        objFulfillmentPoliciesPanel.setInactive('Please sign in before using this panel');
      }
    });
    
    nsc(document).on('credentialsPanelUpdated', function() {
      if (app.objModel.objEbayAuthorization.getStatus() === 4) {
        var sSelectedMarketplaceId = nsc('#marketplace-selector').val();
        if (sSelectedMarketplaceId !== '' && sSelectedMarketplaceId !== 'undefined') {
          objFulfillmentPoliciesPanel.setUpdating('Checking for fulfillment policies');
          app.objModel.objPolicyModel.getPoliciesByMarketplaceFromEbay('fulfillment_policy', sSelectedMarketplaceId);
        }
      }
    });
    
    nsc(document).on('fulfillmentpoliciesfetched', function(event, nPolicyCountReturned) {
      var sMarketplaceId = nsc('#marketplace-selector').val();
        
      objFulfillmentPoliciesPanel.setPanelStatus();
      objFulfillmentPoliciesPanel.setModalFinishedUpdating();
      objFulfillmentPoliciesPanel.showMessage(nPolicyCountReturned+' policies found for marketplace '+sMarketplaceId, 'success');
      objFulfillmentPoliciesPanel.renderPolicyListMarkup(nsc('#marketplace-selector').val());
    });
    
    nsc(document).on('failedtofetchfulfillmentpolicies', function(param1, sRestCallName, objResponseData) {
      var sMessage = '';
      if (typeof objResponseData.errors.length !== 'undefined') {
        for (var i = 0, nLength = objResponseData.errors.length; i < nLength; i++) {
          sMessage += '<p>'+sRestCallName+' failed because:</p>';
          sMessage += '<ul>';
          sMessage += '<li>['+objResponseData.errors[i].errorId+'] '+objResponseData.errors[i].message+'</li>';
          sMessage += '</ul>';
        }
      } else {
        sMessage = 'Unknown error on failedtofetchfulfillmentpolicies';
      }
      objFulfillmentPoliciesPanel.showMessage(sMessage, 'danger');
      objFulfillmentPoliciesPanel.setModalFinishedUpdating();
    });
    
    nsc(document).on('marketplace-changed', function() {
      var sMarketplaceId = nsc('#marketplace-selector').val();
      objFulfillmentPoliciesPanel.setUpdating('Checking for fulfillment policies for '+sMarketplaceId);
      app.objModel.objPolicyModel.getPoliciesByMarketplaceFromEbay('fulfillment_policy', sMarketplaceId);
    });
  };
  
  objFulfillmentPoliciesPanel.setModalListeners = function() {    
    nsc('#fulfillment-policy-list-refresh').off().on('click', function() {
      objFulfillmentPoliciesPanel.renderPolicyListMarkup();
    });
    
    nsc('.policy-existing').off().on('click', function() {
      var nPolicyId = nsc(this).data('policyid');
      console.log('fetching policy '+nPolicyId);
      objFulfillmentPoliciesPanel.renderPolicyInterface(nPolicyId);
    });
    
    nsc('#policy-new').off().on('click', function() {
      objFulfillmentPoliciesPanel.renderPolicyInterface();
    });
    
    nsc(document).off('policycreationerror').on('policycreationerror', function(event, objErrors) {
      var sAlertMessage = '';
      sAlertMessage += '<ul>';
      for (var i in objErrors) {
        sAlertMessage += '<li>('+objErrors[i].errorId+') '+objErrors[i].message+'</li>';
      }
      sAlertMessage += '</ul>';
      objFulfillmentPoliciesPanel.showMessage(sAlertMessage, 'danger');
      objFulfillmentPoliciesPanel.setModalFinishedUpdating();
    });
    
    nsc(document).off('policycreated').on('policycreated', function(event, objData) {
      objFulfillmentPoliciesPanel.showMessage('Fulfillment policy '+objData.nPolicyId+' created', 'success');
      objFulfillmentPoliciesPanel.setModalFinishedUpdating();
      objFulfillmentPoliciesPanel.renderPolicyListMarkup();
      objFulfillmentPoliciesPanel.setPanelStatus();
    });
    
    nsc(document).off('failedtodeletepolicy').on('failedtodeletepolicy', function(event, objData) {
      console.log(objData);
      var sAlertMessage = '';
      
      if (typeof objData.arrErrors !== 'undefined') {  
        sAlertMessage += '<ul>';
        for (var i = 0, nLength = objData.arrErrors.length; i < nLength; i++) {
          sAlertMessage += '<li>('+objData.arrErrors[i].errorId+') '+objData.arrErrors[i].message+'</li>';
        }
        sAlertMessage += '</ul>';
      } else {
        sAlertMessage += '<p>Failed to delete policy</p>';
      }
      objFulfillmentPoliciesPanel.showMessage(sAlertMessage, 'warning');
      objFulfillmentPoliciesPanel.setModalFinishedUpdating();
    });
    
    nsc(document).off('policydeleted').on('policydeleted', function(event, objData) {
      objFulfillmentPoliciesPanel.showMessage('Deleted policy in marketplace '+objData.sMarketplaceId, 'success');
      objFulfillmentPoliciesPanel.setModalFinishedUpdating();
      objFulfillmentPoliciesPanel.renderPolicyListMarkup();
      objFulfillmentPoliciesPanel.hidePolicyInterface();
      objFulfillmentPoliciesPanel.setPanelStatus();
    });
    
    nsc(document).off('policyupdated').on('policyupdated', function(event, objData) {
      objFulfillmentPoliciesPanel.showMessage('Fulfillment policy '+objData.nPolicyId+' updated', 'success');
      objFulfillmentPoliciesPanel.setModalFinishedUpdating();
      objFulfillmentPoliciesPanel.renderPolicyListMarkup();
      objFulfillmentPoliciesPanel.setPanelStatus();
    });
    
    nsc(document).off('policyupdatefailed').on('policyupdatefailed', function(event) {
      objFulfillmentPoliciesPanel.showMessage('Fulfillment policy update failed', 'warning');
      objFulfillmentPoliciesPanel.setModalFinishedUpdating();
      objFulfillmentPoliciesPanel.renderPolicyListMarkup();
      objFulfillmentPoliciesPanel.setPanelStatus();
    });    
    
    ////////////////////////////////////////////////////////////////////////////
    //
    // Listeners attached to the policy details form
    //
    ////////////////////////////////////////////////////////////////////////////
    nsc('#fulfillment-handlingtime-selector').off().on('change', function() {
      nsc('#fulfillment-handlingtime-value').val(this.value+' days');
      nsc('#fulfillment-handlingtime-value-value').val(this.value);
    });
    
    nsc('#create-fulfillment-policy').off().on('click', function() {
      var objFormData = nsc('#create-fulfillment-policy-form').serializeArray();
      
      /* serializeData needs massaged into a useful structure */
      var objData = {};
      for (var i in objFormData) {
        objData[objFormData[i].name] = objFormData[i].value;
      }
      objFulfillmentPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.createPolicy('fulfillment_policy', objData);
    });
    
    nsc('#update-fulfillment-policy').off().on('click', function() {
      var nPolicyId = nsc(this).data('policyid');
      var objFormData = nsc('#create-fulfillment-policy-form').serializeArray();
      var objData = {};
      
      for (var i in objFormData) {
        objData[objFormData[i].name] = objFormData[i].value;
      }

      objFulfillmentPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.updatePolicy('fulfillment_policy', nPolicyId, objData);
    });
    
    nsc('#delete-fulfillment-policy').off().on('click', function() {
      var nPolicyId = nsc(this).data('policyid');
      objFulfillmentPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.deletePolicy('fulfillment_policy', nPolicyId);
    });
  };
  
  objFulfillmentPoliciesPanel.initialize = function() {
    objFulfillmentPoliciesPanel.setInactive();
  };
  
  objFulfillmentPoliciesPanel.setPanelStatus = function() {
    var sMarketplaceId = nsc('#marketplace-selector').val();
    var objPolicies = app.objModel.objPolicyModel.getPoliciesByMarketplace('fulfillment_policy', sMarketplaceId);
    
    if (Object.keys(objPolicies).length) {
      objFulfillmentPoliciesPanel.setActive('Fulfillment policy in place for '+sMarketplaceId);
    } else {
      objFulfillmentPoliciesPanel.setInactive(sMarketplaceId+' needs a fulfillment policy');
    }
  };
      
  objFulfillmentPoliciesPanel.getModalHeaderMarkup = function() {    
    var sHTML = '';
    
    sHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    sHTML += '<span id="updating-icon-span" style="float:right"></span>';
    sHTML += '<h2 class="modal-title">Fulfillment Policy Interface</h2>';
    
    return sHTML;
  };
  
  objFulfillmentPoliciesPanel.getModalBodyMarkup = function() {
    var sDefaultMarketplace = nsc('#marketplace-selector').val();
    var sHTML = '';
    
    sHTML += objFulfillmentPoliciesPanel.getPolicyListMarkup(sDefaultMarketplace);
    sHTML += '<div id="modal-alertbox">';
    sHTML += '  <div id="modal-alertbox-inner"></div>';
    sHTML += '</div>';
    sHTML += '<div id="fulfillment-policy-interface"></div>';
    
    return sHTML;
  };
    
  objFulfillmentPoliciesPanel.getModalFooterMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="btn btn-default" data-dismiss="modal" aria-label="Close">Close</button>';
    
    return sHTML;
  };
    
  objFulfillmentPoliciesPanel.showMessage = function(sMessage, sMessageType) {
    var sHTML = '';
    sHTML += '<div id="modal-alertbox-inner" class="alert alert-'+sMessageType+'">';
    sHTML += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
    sHTML += sMessage;
    sHTML += '</div>';
    
    nsc('#modal-alertbox').html(sHTML);
    nsc('#modal-alertbox-inner').delay(2000).slideUp(1000);
  };
  
  //////////////////////////////////////////////////////////////////////////////
  //
  //  Panel specific code
  //
  //////////////////////////////////////////////////////////////////////////////
  objFulfillmentPoliciesPanel.renderPolicyListMarkup = function(sMarketplaceId) {
    if (typeof sMarketplaceId === 'undefined') {
      sMarketplaceId = nsc('#marketplace-selector').val();
    }
    nsc('#fulfillment-policy-list').replaceWith(objFulfillmentPoliciesPanel.getPolicyListMarkup(sMarketplaceId));
    objFulfillmentPoliciesPanel.setModalListeners();
  };
  
  objFulfillmentPoliciesPanel.getPolicyListMarkup = function(sMarketplaceId) {
    
    var objPolicies = app.objModel.objPolicyModel.getPoliciesByMarketplace('fulfillment_policy', sMarketplaceId);
    
    var sHTML = '';

    sHTML += '<div id="fulfillment-policy-list">';

    sHTML += '<div class="panel panel-default">';
    sHTML += '  <div class="panel-heading">';
    sHTML += '    <span>Fulfillment (shipping) Policies</span>';
    sHTML += '    <span class="fa fa-refresh" id="fulfillment-policy-list-refresh" style="float:right"></span>';
    sHTML += '  </div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Policies are marketplace specific.</p>'
    sHTML += '  </div>';
    sHTML += '  <table class="table table-hover table-condensed">';
    
    if (Object.keys(objPolicies).length) {
      sHTML += '<tr>';
      sHTML += '  <th>Policy ID</th>';
      sHTML += '  <th>Marketplace</th>';
      sHTML += '  <th>Name</th>';
      sHTML += '</tr>';
    }
    
    /* Any existing policies */
    for (var nPolicyID in objPolicies) {
      var objPolicy = objPolicies[nPolicyID];
      sHTML += '<tr class="policy-existing" data-policyid="'+nPolicyID+'">';
      sHTML += '  <td>'+nPolicyID+'</td>';
      sHTML += '  <td>'+objPolicy.marketplaceId+'</td>';
      sHTML += '  <td>'+objPolicy.name+'</td>';
      sHTML += '</tr>';
    }
    
    /* The chance to create a new policy */
    sHTML += '    <tr>';
    sHTML += '      <td colspan="3" align="center">';
    sHTML += '        <button id="policy-new" class="btn btn-default">';
    sHTML += '          <span class="fa fa-plus-circle"></span>';
    sHTML += ' Click here to create new policy.';
    sHTML += '        </button>';
    sHTML += '      </td>';
    sHTML += '    </tr>';
    
    sHTML += '  </table>';
    sHTML += '</div>';
    sHTML += '</div><!-- #policy-list -->';

    return sHTML;
  };
  
  objFulfillmentPoliciesPanel.renderPolicyInterface = function(nPolicyId) {
    nsc('#fulfillment-policy-interface').replaceWith(objFulfillmentPoliciesPanel.getPolicyInterfaceMarkup(nPolicyId));
    objFulfillmentPoliciesPanel.setModalListeners();
  };
  
  objFulfillmentPoliciesPanel.hidePolicyInterface = function() {
    var sHTML = '<div id="fulfillment-policy-interface"></div>';
    nsc('#fulfillment-policy-interface').replaceWith(sHTML);
  };
  
  objFulfillmentPoliciesPanel.getPolicyInterfaceMarkup = function(nPolicyId) {
    var objPolicy = app.objModel.objPolicyModel.getPolicyById('fulfillment_policy', nPolicyId);
    var sHTML = '';
    
    
    console.log(objPolicy);
    
    
    sHTML += '<div id="fulfillment-policy-interface" class="panel panel-default">';

    sHTML += '  <div class="panel-heading">';
    if (nPolicyId !== '') {
      sHTML += '<h3 class="panel-title">Policy Detail</h3>';   
    } else {
      sHTML += '<h3 class="panel-title">Existing policy interface for policy #'+nPolicyId+'</h3>';  
    }    
    sHTML += '  </div><!-- .panel-heading -->';
    
    sHTML += '  <div class="panel-body">';
    sHTML += '    <form class="form-horizontal" id="create-fulfillment-policy-form">';
    
    sHTML += '      <input type="hidden" name="marketplaceId" value="'+nsc('#marketplace-selector').val()+'">';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="name" class="col-sm-2">Name</label>';
    sHTML += '        <div class="col-sm-10">';
    sHTML += '          <input type="text" id="name" class="form-control" name="name" value="'+objPolicy.name+'" maxlength="64">';
    sHTML += '        </div>';
    sHTML += '      </div>';    
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="description" class="col-sm-2">Short Description (250 characters)</label>';
    sHTML += '        <div class="col-sm-10">';
    sHTML += '          <textarea id="description" class="form-control" name="description" rows="4" placeholder="Short Description of your fulfillment policy" maxlength="250">';
    sHTML += objPolicy.description;
    sHTML += '          </textarea>';
    sHTML += '        </div>';
    sHTML += '      </div>';    
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="fulfillment-handlingtime-selector" class="col-sm-2">Handling Time</label>';
    sHTML += '        <div class="col-sm-6">';
    sHTML += '          <select id="fulfillment-handlingtime-selector" class="form-control">';
    for (var i = 0, nLength = 30; i < nLength; i++) {
      sHTML += '<option';
      if (objPolicy.handlingTime.value === i) {
        sHTML += ' selected="selected"';
      }
      sHTML += ' value="'+i+'">';
      sHTML += i + ' days';
      sHTML += '</option>';
    }
    sHTML += '          </select>';
    sHTML += '        </div>';
    sHTML += '        <div class="col-sm-4">';
    sHTML += '          <input type="text" id="fulfillment-handlingtime-value" class="form-control" value="'+objPolicy.handlingTime.value+' days" readonly>';
    sHTML += '          <input type="hidden" id="fulfillment-handlingtime-unit-value" name="fulfillmentHandlingtimeUnit" value="DAY">';
    sHTML += '          <input type="hidden" id="fulfillment-handlingtime-value-value" name="fulfillmentHandlingtimeValue" value="'+objPolicy.handlingTime.value+'">';
    sHTML += '        </div>';
    sHTML += '      </div>';
    

    sHTML += '      <div class="form-group text-center">';
    if (typeof nPolicyId === 'undefined') {
      sHTML += '        <button id="create-fulfillment-policy" class="btn btn-primary" type="button">Create New Policy</button>';
    } else {
      sHTML += '        <button id="update-fulfillment-policy" class="btn btn-primary" type="button" data-policyid="'+nPolicyId+'">Update Policy</button>';
      sHTML += '        <button id="delete-fulfillment-policy" class="btn btn-default" type="button" data-policyid="'+nPolicyId+'">Delete Policy</button>';
    }
    sHTML += '      </div>';

    sHTML += '    </form>';
    sHTML += '  </div><!-- .panel-body -->';
    
    sHTML += '</div><!-- .panel-->';
    
    return sHTML;
  };
  
  objFulfillmentPoliciesPanel.setModalUpdating = function() {
    nsc('#fulfillment-policy-list-refresh').removeClass().addClass('fa fa-refresh fa-spin fa-fw');
  };

  objFulfillmentPoliciesPanel.setModalFinishedUpdating = function() {
    nsc('#fulfillment-policy-list-refresh').removeClass().addClass('fa fa-refresh');
  };
  
  return objFulfillmentPoliciesPanel;
});