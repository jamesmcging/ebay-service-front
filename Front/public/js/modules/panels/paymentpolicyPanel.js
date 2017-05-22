define(['jquery', 
  'modules/panels/statusPanel'], 
function(nsc, 
  objStatusPanel) {
   
  var objPaymentPoliciesPanel = {};

  objPaymentPoliciesPanel.__proto__ = objStatusPanel;
  
  objPaymentPoliciesPanel.sName = 'Payment Policies';
  objPaymentPoliciesPanel.sCode = 'paymentmentpoliciespanel';
  
  objPaymentPoliciesPanel.objChildPanels = {};
  
  objPaymentPoliciesPanel.objSettings.bActive = false;
  
  objPaymentPoliciesPanel.getPanelContent = function() {    
    var sHTML = '';
    
    sHTML += '<div class="row">';
    
    sHTML += '<div class="col-sm-2">';
    sHTML += '<span class="status-panel-icon" id="'+this.sCode+'-status-icon"></span>';
    sHTML += '</div>';
    
    sHTML += '<div class="col-sm-10">';
    sHTML += '<h3 id="'+this.sCode+'-status-title">'+this.sName+'</h3>';
    sHTML += '<p id="'+this.sCode+'-status-text">';
    sHTML += 'Click to set or update payment policies';
    sHTML += '</p>';
    sHTML += '</div>';
    
    sHTML += '</div><!-- .row -->';
    
    return sHTML;
  };
  
  objPaymentPoliciesPanel.setListeners = function() {
    nsc('#'+this.sCode+'-panel').off().on('click', function() {
      if (app.objModel.objEbayAuthorization.getStatus() === 4) {
        objPaymentPoliciesPanel.showModal();
        objPaymentPoliciesPanel.setModalListeners();
      } else {
        objPaymentPoliciesPanel.setInactive('This panel needs the credentials panel to be active');
      }
    });
    
    nsc(document).on('credentialsPanelUpdated', function() {
      if (app.objModel.objEbayAuthorization.getStatus() === 4) {
        var sSelectedMarketplaceId = nsc('#marketplace-selector').val();
        if (sSelectedMarketplaceId !== '' && sSelectedMarketplaceId !== 'undefined') {
          objPaymentPoliciesPanel.setUpdating('Checking for payment policies');
          app.objModel.objPolicyModel.getPoliciesByMarketplaceFromEbay('payment_policy', sSelectedMarketplaceId);
        }
      } else {
        objPaymentPoliciesPanel.setInactive('This panel needs the credentials panel to be active');
      }
    });
    
    nsc(document).on('paymentpoliciesfetched', function(event, nPolicyCountReturned) {
      var sMarketplaceId = nsc('#marketplace-selector').val();
        
      objPaymentPoliciesPanel.setPanelStatus();
      objPaymentPoliciesPanel.setModalFinishedUpdating();
      objPaymentPoliciesPanel.showMessage(nPolicyCountReturned+' policies found for marketplace '+sMarketplaceId, 'success');
      objPaymentPoliciesPanel.renderPolicyListMarkup(nsc('#marketplace-selector').val());
    });
    
    nsc(document).on('failedtofetchpaymentpolicies', function(param1, sRestCallName, objResponseData) {
      var sMessage = '';
      if (objResponseData.nResponseCode === 0) {
        sMessage = 'Unable to talk to eBay, probably due to missing credentials';
      } else if (typeof objResponseData.sResponseMessage.errors.length !== 'undefined') {
        for (var i = 0, nLength = objResponseData.sResponseMessage.errors.length; i < nLength; i++) {
          sMessage += '<p>'+sRestCallName+' failed because:</p>';
          sMessage += '<ul>';
          sMessage += '<li>['+objResponseData.sResponseMessage.errors[i].errorId+'] '+objResponseData.sResponseMessage.errors[i].message+'</li>';
          sMessage += '</ul>';
        }
      } else {
        sMessage = 'Unknown error on failedtofetchpaymentpolicies';
      }
      objPaymentPoliciesPanel.showMessage(sMessage, 'danger');
      objPaymentPoliciesPanel.setInactive('Unable to fetch payment policies for this marketplace');
      objPaymentPoliciesPanel.setModalFinishedUpdating();
    });
    
    nsc(document).on('marketplace-changed', function() {
      var sMarketplaceId = nsc('#marketplace-selector').val();
      objPaymentPoliciesPanel.setUpdating('Checking for payment policies for '+sMarketplaceId);
      app.objModel.objPolicyModel.getPoliciesByMarketplaceFromEbay('payment_policy', sMarketplaceId);
    });
  };
  
  objPaymentPoliciesPanel.setModalListeners = function() {    
    nsc('#payment-policy-list-refresh').off().on('click', function() {
      objPaymentPoliciesPanel.renderPolicyListMarkup();
    });
    
    nsc('.policy-existing').off().on('click', function() {
      var nPolicyId = nsc(this).data('policyid');
      objPaymentPoliciesPanel.renderPolicyInterface(nPolicyId);
    });
    
    nsc('#policy-new').off().on('click', function() {
      objPaymentPoliciesPanel.renderPolicyInterface();
    });
    
    nsc(document).off('policycreationerror').on('policycreationerror', function(event, objErrors) {
      var sAlertMessage = '';
      sAlertMessage += '<ul>';
      for (var i in objErrors) {
        sAlertMessage += '<li>('+objErrors[i].errorId+') '+objErrors[i].message+'</li>';
      }
      sAlertMessage += '</ul>';
      objPaymentPoliciesPanel.showMessage(sAlertMessage, 'danger');
      objPaymentPoliciesPanel.setModalFinishedUpdating();
    });
    
    nsc(document).off('policycreated').on('policycreated', function(event, objData) {
      objPaymentPoliciesPanel.showMessage('Payment policy '+objData.nPolicyId+' created', 'success');
      objPaymentPoliciesPanel.setModalFinishedUpdating();
      objPaymentPoliciesPanel.renderPolicyListMarkup();
      objPaymentPoliciesPanel.setPanelStatus();
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
      objPaymentPoliciesPanel.showMessage(sAlertMessage, 'warning');
      objPaymentPoliciesPanel.setModalFinishedUpdating();
    });
    
    nsc(document).off('policydeleted').on('policydeleted', function(event, objData) {
      objPaymentPoliciesPanel.showMessage('Deleted policy in marketplace '+objData.sMarketplaceId, 'success');
      objPaymentPoliciesPanel.setModalFinishedUpdating();
      objPaymentPoliciesPanel.renderPolicyListMarkup();
      objPaymentPoliciesPanel.hidePolicyInterface();
      objPaymentPoliciesPanel.setPanelStatus();
    });
    
    nsc(document).off('policyupdated').on('policyupdated', function(event, objData) {
      objPaymentPoliciesPanel.showMessage('Payment policy '+objData.nPolicyId+' updated', 'success');
      objPaymentPoliciesPanel.setModalFinishedUpdating();
      objPaymentPoliciesPanel.renderPolicyListMarkup();
      objPaymentPoliciesPanel.setPanelStatus();
    });
    
    nsc(document).off('policyupdatefailed').on('policyupdatefailed', function(event) {
      objPaymentPoliciesPanel.showMessage('Payment policy update failed', 'warning');
      objPaymentPoliciesPanel.setModalFinishedUpdating();
      objPaymentPoliciesPanel.renderPolicyListMarkup();
      objPaymentPoliciesPanel.setPanelStatus();
    });    
    
    ////////////////////////////////////////////////////////////////////////////
    //
    // Listeners attached to the policy details form
    //
    ////////////////////////////////////////////////////////////////////////////
    nsc('#payment-method-reference-selector').on('change', function() {
      nsc('#payment-method-reference-type').val(this.value);
    });
    
    nsc('#create-payment-policy').off().on('click', function() {
      var objFormData = nsc('#create-payment-policy-form').serializeArray();
      
      /* serializeData needs massaged into a useful structure */
      var objData = {};
      for (var i in objFormData) {
        objData[objFormData[i].name] = objFormData[i].value;
      }
      objPaymentPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.createPolicy('payment_policy', objData);
    });
    
    nsc('#update-payment-policy').off().on('click', function() {
      var nPolicyId = nsc(this).data('policyid');
      var objFormData = nsc('#create-payment-policy-form').serializeArray();
      var objData = {};
      
      for (var i in objFormData) {
        objData[objFormData[i].name] = objFormData[i].value;
      }

      objPaymentPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.updatePolicy('payment_policy', nPolicyId, objData);
    });
    
    nsc('#delete-payment-policy').off().on('click', function() {
      var nPolicyId = nsc(this).data('policyid');
      objPaymentPoliciesPanel.setModalUpdating();
      app.objModel.objPolicyModel.deletePolicy('payment_policy', nPolicyId);
    });
  };
  
  objPaymentPoliciesPanel.initialize = function() {
    objPaymentPoliciesPanel.setInactive();
  };
  
  objPaymentPoliciesPanel.setPanelStatus = function() {
    var sMarketplaceId = nsc('#marketplace-selector').val();
    var objPolicies = app.objModel.objPolicyModel.getPoliciesByMarketplace('payment_policy', sMarketplaceId);
    
    if (Object.keys(objPolicies).length) {
      objPaymentPoliciesPanel.setActive('Payment policy in place for '+sMarketplaceId);
    } else {
      objPaymentPoliciesPanel.setInactive(sMarketplaceId+' needs a payment policy');
    }
  };
      
  objPaymentPoliciesPanel.getModalHeaderMarkup = function() {    
    var sHTML = '';
    
    sHTML += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    sHTML += '<span id="updating-icon-span" style="float:right"></span>';
    sHTML += '<h2 class="modal-title">Payment Policy</h2>';
    
    return sHTML;
  };
  
  objPaymentPoliciesPanel.getModalBodyMarkup = function() {
    var sDefaultMarketplace = nsc('#marketplace-selector').val();
    var sHTML = '';
    
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      sHTML += objPaymentPoliciesPanel.getPolicyListMarkup(sDefaultMarketplace);
      sHTML += '<div id="modal-alertbox">';
      sHTML += '  <div id="modal-alertbox-inner"></div>';
      sHTML += '</div>';
      sHTML += '<div id="payment-policy-interface"></div>';
    } else {
      sHTML += '<p>Please start with the credentials panel.</p>';
    }
    
    return sHTML;
  };
    
  objPaymentPoliciesPanel.getModalFooterMarkup = function() {
    var sHTML = '';
    sHTML += '<button type="button" class="btn btn-default" data-dismiss="modal" aria-label="Close">Close</button>';
    
    return sHTML;
  };
    
  objPaymentPoliciesPanel.showMessage = function(sMessage, sMessageType) {
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
  objPaymentPoliciesPanel.renderPolicyListMarkup = function(sMarketplaceId) {
    if (typeof sMarketplaceId === 'undefined') {
      sMarketplaceId = nsc('#marketplace-selector').val();
    }
    nsc('#payment-policy-list').replaceWith(objPaymentPoliciesPanel.getPolicyListMarkup(sMarketplaceId));
    objPaymentPoliciesPanel.setModalListeners();
  };
  
  objPaymentPoliciesPanel.getPolicyListMarkup = function(sMarketplaceId) {
    
    var objPolicies = app.objModel.objPolicyModel.getPoliciesByMarketplace('payment_policy', sMarketplaceId);
    
    var sHTML = '';

    sHTML += '<div id="payment-policy-list">';

    sHTML += '<div class="panel panel-default">';
    sHTML += '  <div class="panel-heading">';
    sHTML += '    <span>Payment Policies</span>';
    sHTML += '    <span class="fa fa-refresh" id="payment-policy-list-refresh" style="float:right"></span>';
    sHTML += '  </div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Policies are marketplace specific.</p>';
    sHTML += '    <p>This is a severely cut down payment interface to get the prototype finished.';
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
  
  objPaymentPoliciesPanel.renderPolicyInterface = function(nPolicyId) {
    nsc('#payment-policy-interface').replaceWith(objPaymentPoliciesPanel.getPolicyInterfaceMarkup(nPolicyId));
    objPaymentPoliciesPanel.setModalListeners();
  };
  
  objPaymentPoliciesPanel.hidePolicyInterface = function() {
    var sHTML = '<div id="payment-policy-interface"></div>';
    nsc('#payment-policy-interface').replaceWith(sHTML);
  };
  
  objPaymentPoliciesPanel.getPolicyInterfaceMarkup = function(nPolicyId) {
    var objPolicy = app.objModel.objPolicyModel.getPolicyById('payment_policy', nPolicyId);
    var sHTML = '';

    sHTML += '<div id="payment-policy-interface" class="panel panel-default">';

    sHTML += '  <div class="panel-heading">';
    if (nPolicyId !== '') {
      sHTML += '<h3 class="panel-title">Policy Detail</h3>';   
    } else {
      sHTML += '<h3 class="panel-title">Existing policy interface for policy #'+nPolicyId+'</h3>';  
    }    
    sHTML += '  </div><!-- .panel-heading -->';
    
    sHTML += '  <div class="panel-body">';
    sHTML += '    <form class="form-horizontal" id="create-payment-policy-form">';
    
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
    sHTML += '          <textarea id="description" class="form-control" name="description" rows="4" placeholder="Short Description of your payment policy" maxlength="250">';
    sHTML += objPolicy.description;
    sHTML += '          </textarea>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <div class="col-sm-offset-2 col-sm-10">';
    sHTML += '          <div class="checkbox">';
    sHTML += '            <label>';
    sHTML += '              <input type="checkbox" name="immediatePay"';
    if (objPolicy.immediatePay === true) {
      sHTML += ' checked="checked"';
    }
    sHTML += '>Immediate Pay';
    sHTML += '            </label>';
    sHTML += '          </div>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="payment-method-reference-type-value-selector" class="col-sm-2">Payment Method</label>';
    sHTML += '        <div class="col-sm-6">';
    sHTML += '          <select id="payment-method-reference-type-value-selector" class="form-control" name="paymentMethodType">';
    sHTML += '            <option value="PAYPAL_EMAIL">PayPal email</option>';
    sHTML += '          </select>';
    sHTML += '        </div>';
    sHTML += '        <div class="col-sm-4">';
    var sReferenceType = (typeof objPolicy.paymentMethods[0].recipientAccountReference !== 'undefined' && typeof objPolicy.paymentMethods[0].recipientAccountReference.referenceType !== 'undefined') ? objPolicy.paymentMethods[0].recipientAccountReference.referenceType : 'PAYPAL_EMAIL';
    sHTML += '          <input type="text" id="payment-method-reference-type-value" class="form-control" name="referenceType" value="'+sReferenceType+'" readonly>';
    sHTML += '        </div>';
    sHTML += '      </div>';
    
    sHTML += '      <div class="form-group">';
    sHTML += '        <label for="referenceId" class="col-sm-2">Reference ID</label>';
    sHTML += '        <div class="col-sm-10">';
    var sReferenceId = (typeof objPolicy.paymentMethods[0].recipientAccountReference !== 'undefined' && typeof objPolicy.paymentMethods[0].recipientAccountReference.referenceId !== 'undefined') ? objPolicy.paymentMethods[0].recipientAccountReference.referenceId : '';
    sHTML += '          <input type="email" id="referenceId" class="form-control" name="referenceId" value="alaname-retailer@gmail.com">';
    sHTML += '        </div>';
    sHTML += '      </div>';      

    sHTML += '      <div class="form-group text-center">';
    if (typeof nPolicyId === 'undefined') {
      sHTML += '        <button id="create-payment-policy" class="btn btn-primary" type="button">Create New Policy</button>';
    } else {
      sHTML += '        <button id="update-payment-policy" class="btn btn-primary" type="button" data-policyid="'+nPolicyId+'">Update Policy</button>';
      sHTML += '        <button id="delete-payment-policy" class="btn btn-default" type="button" data-policyid="'+nPolicyId+'">Delete Policy</button>';
    }
    sHTML += '      </div>';

    sHTML += '    </form>';
    sHTML += '  </div><!-- .panel-body -->';
    
    sHTML += '</div><!-- .panel-->';
    
    return sHTML;
  };
  
  objPaymentPoliciesPanel.setModalUpdating = function() {
    nsc('#payment-policy-list-refresh').removeClass().addClass('fa fa-refresh fa-spin fa-fw');
  };

  objPaymentPoliciesPanel.setModalFinishedUpdating = function() {
    nsc('#payment-policy-list-refresh').removeClass().addClass('fa fa-refresh');
  };
  
  return objPaymentPoliciesPanel;
});