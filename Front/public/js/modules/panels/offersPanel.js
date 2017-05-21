define(['jquery', 
  'modules/panels/panel'], 
function(nsc, 
  objPanel) {
   
  var objOffersPanel = {};

  objOffersPanel.__proto__ = objPanel;
  
  objOffersPanel.sName = 'Offers';
  objOffersPanel.sCode = 'offerspanel';
  
  objOffersPanel.objChildPanels = {};
  
  objOffersPanel.setListeners = function() {};
  
  objOffersPanel.setModalListeners = function() {
    nsc('#offer-list-refresh').off().on('click', function() {
      console.log('offer list refresh called');
      objOffersPanel.renderOfferListMarkup();
    });
    
    nsc('.offer-existing').off().on('click', function() {
      var nOfferId = nsc(this).data('offerid');
      objOffersPanel.renderOfferInterface(nOfferId);
    });
    
    nsc('#offer-new').off().on('click', function() {
      objOffersPanel.renderOfferInterface();
    });
    
    nsc(document).off('offersfetched').on('offersfetched', function(event, nOfferCount) {
      objOffersPanel.renderOfferListMarkup();
    });
    
    nsc(document).off('offercreationerror').on('offercreationerror', function(event, objErrors) {
      var sAlertMessage = '';
      sAlertMessage += '<ul>';
      for (var i in objErrors) {
        sAlertMessage += '<li>('+objErrors[i].errorId+') '+objErrors[i].message+'</li>';
      }
      sAlertMessage += '</ul>';
      objOffersPanel.showMessage(sAlertMessage, 'danger');
      objOffersPanel.setModalFinishedUpdating();
    });
    
    nsc(document).off('offercreated').on('offercreated', function(event) {
      objOffersPanel.showMessage('Offer created', 'success');
      objOffersPanel.setModalFinishedUpdating();
      objOffersPanel.renderOfferListMarkup();
      objOffersPanel.hideOfferInterface();
    });
    
    nsc(document).off('failedtodeleteoffer').on('failedtodeleteoffer', function(event, objData) {
      var sAlertMessage = '';
      
      if (typeof objData.arrErrors !== 'undefined') {  
        sAlertMessage += '<ul>';
        for (var i = 0, nLength = objData.arrErrors.length; i < nLength; i++) {
          sAlertMessage += '<li>('+objData.arrErrors[i].errorId+') '+objData.arrErrors[i].message+'</li>';
        }
        sAlertMessage += '</ul>';
      } else {
        sAlertMessage += '<p>Failed to delete offer</p>';
      }
      objOffersPanel.showMessage(sAlertMessage, 'warning');
      objOffersPanel.setModalFinishedUpdating();
    });
    
    nsc(document).off('offerdeleted').on('offerdeleted', function(event) {      
      objOffersPanel.showMessage('Deleted offer', 'success');
      objOffersPanel.setModalFinishedUpdating();
      objOffersPanel.renderOfferListMarkup();
      objOffersPanel.hideOfferInterface();
    });
    
    nsc(document).off('offerupdated').on('offerupdated', function(event, objResponseData) {
      console.log(objResponseData);
      objOffersPanel.showMessage('Offer '+objResponseData.nOfferId+' updated', 'success');
      objOffersPanel.setModalFinishedUpdating();
      objOffersPanel.renderOfferListMarkup();
      objOffersPanel.hideOfferInterface();
    });
    
    nsc(document).off('offerupdatefailed').on('offerupdatefailed', function(event, objResponseData) {
      console.log(objResponseData);
      objOffersPanel.showMessage('Offer update failed', 'warning');
      objOffersPanel.setModalFinishedUpdating();
      objOffersPanel.renderOfferListMarkup();
    });    
    
    ////////////////////////////////////////////////////////////////////////////
    //
    // Listeners attached to the offer details form
    //
    ////////////////////////////////////////////////////////////////////////////
    nsc('#offer-reference-selector').off().on('change', function() {
      nsc('#offer-reference-type').val(this.value);
    });
    
    nsc('#location-selector').off().on('change', function() {
      nsc('#locationid-value').val(this.value);
    });
    
    nsc('#create-ebay-offer').off().on('click', function() {
      var objFormData = nsc('#create-offer-form').serializeArray();
      var objData = {};
      
      /* serializeData needs massaged into a useful structure */
      for (var i in objFormData) {
        objData[objFormData[i].name] = objFormData[i].value;
      }
      
      objOffersPanel.setModalUpdating();
      app.objModel.objEbayOffersModel.createOffer(objData);
    });
    
    nsc('#update-ebay-offer').off().on('click', function() {
      var nOfferId = nsc(this).data('offerid');
      var objFormData = nsc('#create-offer-form').serializeArray();
      var objData = {};
     
      /* serializeData needs massaged into a useful structure */
      for (var i in objFormData) {
        objData[objFormData[i].name] = objFormData[i].value;
      }

      objOffersPanel.setModalUpdating();
      app.objModel.objEbayOffersModel.updateOffer(nOfferId, objData);
    });
    
    nsc('#delete-ebay-offer').off().on('click', function() {
      var nOfferId = nsc(this).data('offerid');
      objOffersPanel.setModalUpdating();
      app.objModel.objEbayOffersModel.deleteOffer(nOfferId);
    });
    
    nsc('#get-listing-fee').off().on('click', function() {
      var nOfferId = nsc(this).data('offerid');
      objOffersPanel.setModalUpdating();
      app.objModel.objEbayOffersModel.getListingFee(nOfferId);
    });
    
    nsc('#publish-offer').off().on('click', function() {
      var nOfferId = nsc(this).data('offerid');
      objOffersPanel.setModalUpdating();
      app.objModel.objEbayOffersModel.publishOffer(nOfferId);
    });
  };
  
  objOffersPanel.initialize = function() {
    objOffersPanel.renderOfferListMarkup();
  };
  
  objOffersPanel.getPanelMarkup = function() {
    var sHTML = '';
    
    sHTML += '<div id="'+objOffersPanel.sCode+'-panel">';
    if (app.objModel.objEbayAuthorization.getStatus() === 4) {
      sHTML += '<div id="offer-list">';
      sHTML += '  <p>Fetching offers...</p>';
      sHTML += '</div>';
      sHTML += '<div id="modal-alertbox">';
      sHTML += '  <div id="modal-alertbox-inner"></div>';
      sHTML += '</div>';
      sHTML += '<div id="offer-interface"></div>';
      
    } else {
      sHTML += '<p>Please start with the credentials panel.</p>';
    }
    sHTML += '</div>';
    
    return sHTML;
  };
    
  objOffersPanel.showMessage = function(sMessage, sMessageType) {
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
  objOffersPanel.renderOfferListMarkup = function(sMarketplaceId) {
    nsc('#offer-list').replaceWith(objOffersPanel.getOffersListMarkup());
    objOffersPanel.setModalListeners();
  };
  
  objOffersPanel.getOffersListMarkup = function() {
    var sProductCode = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objOffers    = app.objModel.objEbayOffersModel.getOffersByProductcode(sProductCode);
    var sHTML = '';

    sHTML += '<div id="offer-list">';

    sHTML += '<div class="panel panel-default">';
    sHTML += '  <div class="panel-heading">';
    sHTML += '    <span>Offers</span>';
    sHTML += '    <span class="fa fa-refresh" id="offer-list-refresh" style="float:right"></span>';
    sHTML += '  </div>';
    sHTML += '  <div class="panel-body">';
    sHTML += '    <p>Offers are marketplace specific.</p>';
    sHTML += '  </div>';
    sHTML += '  <table class="table table-hover table-condensed">';
    
    if (Object.keys(objOffers).length) {
      sHTML += '<tr>';
      sHTML += '  <th>Offer ID</th>';
      sHTML += '  <th>Marketplace</th>';
      sHTML += '  <th>Status</th>';
      sHTML += '</tr>';
    }
    
    /* Any existing policies */
    for (var nOfferID in objOffers) {
      var objOffer = objOffers[nOfferID];
      var sClass   = 'offer-existing';
      var sHREF    = '';
      if (objOffers[nOfferID].status === 'PUBLISHED') {
        sClass = 'offer-existing success';
        sHREF  = '<a href="http://www.sandbox.ebay.com/itm/'+objOffers[nOfferID].listing.listingId+'" target="_blank"><i class="fa fa-external-link"></a>';
      }    
      sHTML += '<tr class="'+sClass+'"';
      sHTML += ' data-offerid="'+nOfferID+'">';
      sHTML += '  <td>'+nOfferID+'</td>';
      sHTML += '  <td>'+objOffer.marketplaceId+'</td>';
      sHTML += '  <td>'+objOffer.status+'&nbsp'+sHREF+'</td>';
      sHTML += '</tr>';
    }
    
    /* The chance to create a new offer */
    sHTML += '    <tr>';
    sHTML += '      <td colspan="3" align="center">';
    sHTML += '        <button id="offer-new" class="btn btn-default">';
    sHTML += '          <span class="fa fa-plus-circle"></span>';
    sHTML += ' Click here to create new offer.';
    sHTML += '        </button>';
    sHTML += '      </td>';
    sHTML += '    </tr>';
    
    sHTML += '  </table>';
    sHTML += '</div>';
    sHTML += '</div><!-- #offer-list -->';

    return sHTML;
  };
  
  objOffersPanel.renderOfferInterface = function(nOfferId) {
    nsc('#offer-interface').replaceWith(objOffersPanel.getOfferInterfaceMarkup(nOfferId));
    objOffersPanel.setModalListeners();
  };
  
  objOffersPanel.hideOfferInterface = function() {
    var sHTML = '<div id="offer-interface"></div>';
    nsc('#offer-interface').replaceWith(sHTML);
  };
  
  objOffersPanel.getOfferInterfaceMarkup = function(nOfferId) {
    var sProductCode        = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objStoreItem        = app.objModel.objStoreCatalogueModel.getItemByCode(sProductCode);
    var objEbayItem         = app.objModel.objEbayCatalogueModel.objItems[sProductCode];
    var objDataMappingModel = app.objModel.objDataMappings;
    var objOffer            = app.objModel.objEbayOffersModel.getOfferById(nOfferId);
    
    var sHTML = '';

    sHTML += '<div id="offer-interface" class="panel panel-default">';

    sHTML += '  <div class="panel-heading">';
    if (nOfferId !== '') {
      sHTML += '<h3 class="panel-title">Offer Detail for '+objStoreItem.product_name+' ('+sProductCode+')</h3>';   
    } else {
      sHTML += '<h3 class="panel-title">Existing Offer (#'+nOfferId+') for '+sProductCode+'</h3>';  
    }    
    sHTML += '  </div><!-- .panel-heading -->';
    
    sHTML += '  <div class="panel-body">';
    sHTML += '    <form class="form-horizontal" id="create-offer-form">';
    
    sHTML += objOffersPanel.getMarketplaceMarkup(objOffer);

    
    sHTML += '      <input type="hidden" name="sku" value="'+sProductCode+'">';
    sHTML += '      <input type="hidden" name="format" value="FIXED_PRICE">';
    
    sHTML += objOffersPanel.getQuantityMarkup(objStoreItem);
    
    sHTML += objOffersPanel.getCategoryMarkup();
    
    sHTML += objOffersPanel.getDescriptionMarkup(objStoreItem);
    
    sHTML += objOffersPanel.getFulfillmentPolicyMarkup(objOffer);
    
    sHTML += objOffersPanel.getPaymentPolicyMarkup(objOffer);
    
    sHTML += objOffersPanel.getReturnPolicyMarkup(objOffer);
    
    sHTML += objOffersPanel.getLocationMarkup(objOffer);
    
    sHTML += objOffersPanel.getPriceMarkup(sProductCode, objOffer);
    
    sHTML += objOffersPanel.getCurrencyMarkup();
    
    if (objOffer === '') {
      sHTML += '<div class="form-group">';
      sHTML += '  <div class="col-sm-offset-2 col-sm-10">';
      sHTML += '    <button type="button" class="btn btn-primary" id="create-ebay-offer">Create Offer</button>';
      sHTML += '  </div>';
      sHTML += '</div><!-- .form-group -->';
    } else {
      sHTML += '<div class="form-group">';
      sHTML += '<div class="col-sm-offset-2 col-sm-10">';
      sHTML += '  <div class="btn-group" role="group">';
      sHTML += '    <button type="button" class="btn btn-default" id="update-ebay-offer" data-offerid="'+nOfferId+'">Update Offer</button>';
      sHTML += '    <button type="button" class="btn btn-default" id="delete-ebay-offer" data-offerid="'+nOfferId+'">Delete Offer</button>';
      sHTML += '    <button type="button" class="btn btn-default" id="get-listing-fee" data-offerid="'+nOfferId+'">Get Listing Fee</button>';
      sHTML += '    <button type="button" class="btn btn-primary" id="publish-offer" data-offerid="'+nOfferId+'">Publish Offer</button>';
      sHTML += '  </div><!-- .btn-group -->';
      sHTML += '</div>';
      sHTML += '</div><!-- .form-group -->';
    }
    
    sHTML += '    </form>';
    sHTML += '  </div><!-- .panel-body -->';
    sHTML += '</div><!-- #offer-interface -->';
    return sHTML;
  };
    
  objOffersPanel.getMarketplaceMarkup = function(objOffer) {
    var sMarketplaceId = '';
    var sHTML          = '';
    
    /* If the offer already has a marketplace we use that, otherwise we use the
     * marketplace currently selected in the nav bar. */
    if (objOffer && typeof objOffer.marketplaceId !== 'undefined') {
      sMarketplaceId = objOffer.marketplaceId;
    } else {
      sMarketplaceId = nsc('#marketplace-selector').val();
    }
            
    sHTML += '<input type="hidden" name="marketplaceId" value="'+sMarketplaceId+'">';
    
    return sHTML;
  };
    
  objOffersPanel.getQuantityMarkup = function(objStoreItem) {
    var objDataMappingModel = app.objModel.objDataMappings;
    var sHTML               = '';
    
    sHTML += '<div class="form-group">';
    sHTML += '  <label for="quantity-selector" class="col-sm-2">Quantity</label>';
    sHTML += '  <div class="col-sm-7">';
    sHTML += objOffersPanel.getFieldsMarkup('quantity-selector', 'availability.shipToLocationAvailability.quantity', objStoreItem);
    sHTML += '  </div>';
    sHTML += '  <div class="col-sm-3">';
      sHTML += '  <input type="text" class="form-control" id="available-quantity-value" name="availableQuantity" value="'+objDataMappingModel.getItemDataByField('availability.shipToLocationAvailability.quantity', objStoreItem)+'">';
    sHTML += '  </div>';
    sHTML += '</div>';
    
    return sHTML;
  };
  
  objOffersPanel.getCategoryMarkup = function() {
    var sHTML = '';
    sHTML += '<div class="form-group">';
    sHTML += '  <label for="item-categoryid" class="col-sm-2 control-label">Category</label>';
    sHTML += '  <div class="col-sm-7">';
    sHTML += '    <select name="categoryId" class="form-control">';
    sHTML += '      <option value="2545">Dungeons & Dragons</option>';
    sHTML += '    </select>';
    sHTML += '    <p class="help-block">Select which eBay category you want to list in.</p>';
    sHTML += '  </div>';
    sHTML += '</div> <!-- .form-group -->';
    
    return sHTML;
  };
    
  objOffersPanel.getDescriptionMarkup = function(objStoreItem) {
    var objDataMappingModel = app.objModel.objDataMappings;
    var sHTML               = '';
    
    sHTML += '<div class="form-group">';
    sHTML += '  <label for="item-description" class="col-sm-2 control-label">Description</label>';
    sHTML += '  <div class="col-sm-7">';
    sHTML += objOffersPanel.getFieldsMarkup('descriptionfield', 'product.description', objStoreItem);
    sHTML += '  </div>';
    sHTML += '  <br>'
    sHTML += '  <div class="col-sm-offset-2 col-sm-10">';
    sHTML += '    <textarea class="form-control" id="item-description" name="description" rows="4">'+objDataMappingModel.getItemDataByField('product.description', objStoreItem)+'</textarea>';
    sHTML += '  </div>';
    sHTML += '</div> <!-- .form-group -->';
    
    return sHTML;
  };
  
  objOffersPanel.getLocationMarkup = function(objOffer) {
    var objLocations        = app.objModel.objLocationModel.objLocations;
    var objDataMappingModel = app.objModel.objDataMappings;
    var sDefaultLocation    = objDataMappingModel.getStoreFieldDefaultByEbayField('location');
    var sHTML = '';
    
    /* If the current offer already has a location selected, we use that */
    if (objOffer.merchantLocationKey !== '') {
      sDefaultLocation = objOffer.merchantLocationKey;
    }
    
    /* If we still don't have a default location we use the first */
    for (var sLocationKey in objLocations) {
      sDefaultLocation = sLocationKey;
      break;
    }
    
    sHTML += '<div class="form-group">';
    sHTML += '  <label for="location-selector" class="col-sm-2 control-label">Location</label>';
    sHTML += '  <div class="col-sm-7">';
    sHTML += '    <select id="location-selector" class="form-control">';
    for (var sLocationKey in objLocations) {
      sHTML += '<option';
      sHTML += ' value="'+sLocationKey+'"';
      sHTML += (sLocationKey === sDefaultLocation) ? ' selected="selected"' : '';
      sHTML += '>';
      sHTML += objLocations[sLocationKey].name;
      
      /* If the location is currently disabled inform the user */
      if (objLocations[sLocationKey].merchantLocationStatus !== 'ENABLED') {
        sHTML += ' - disabled';
      }
      sHTML += '</option>';
    }
    sHTML += '    </select>';
    sHTML += '  </div>';
    sHTML += '  <div class="col-sm-3">';
    sHTML += '    <input type="text" id="locationid-value"  class="form-control" value="'+sDefaultLocation+'" name="locationId">';
    sHTML += '  </div>';
    sHTML += '</div><!-- .form-group -->';
    
    return sHTML;
  };
  
  objOffersPanel.getFulfillmentPolicyMarkup = function(objOffer) {
    var sMarketplaceId = '';
    if (typeof objOffer.marketplaceId !== 'undefined' && objOffer.marketplaceId.length > 0) {
      sMarketplaceId = objOffer.marketplaceId;
    } else {
      sMarketplaceId = nsc('#marketplace-selector').val();
    }
    var objPolicies      = app.objModel.objPolicyModel.getPoliciesByMarketplace('fulfillment_policy', sMarketplaceId);
    var objDefaultPolicy = app.objModel.objPolicyModel.getDefaultPolicy('fulfillment_policy', sMarketplaceId);
    var sHTML            = '';

    sHTML += '<div class="form-group">';
    sHTML += '  <label for="fulfillmentpolicy-selector" class="col-sm-2 control-label">Fulfillment Policy</label>';
    sHTML += '  <div class="col-sm-7">';
    sHTML += '    <select id="fulfillmentpolicy-selector" class="form-control">';
    for (var nPolicyId in objPolicies) {
      sHTML += '<option';
      sHTML += ' value="'+nPolicyId+'"';
      sHTML += (nPolicyId === objDefaultPolicy.fulfillmentPolicyId) ? ' selected="selected"' : '';
      sHTML += '>';
      sHTML += objPolicies[nPolicyId].name;
      sHTML += '</option>';
    }
    sHTML += '    </select>';
    sHTML += '  </div>';
    sHTML += '  <div class="col-sm-3">';
    sHTML += '    <input type="text" id="fulfillmentpolicyid-value"  class="form-control" value="'+objDefaultPolicy.fulfillmentPolicyId+'" name="fulfillmentPolicyId">';
    sHTML += '  </div>';
    sHTML += '</div><!-- .form-group -->';
    
    return sHTML;
  };
  
  objOffersPanel.getReturnPolicyMarkup = function(objOffer) {    
    var sMarketplaceId = '';
    if (typeof objOffer.marketplaceId !== 'undefined' && objOffer.marketplaceId.length > 0) {
      sMarketplaceId = objOffer.marketplaceId;
    } else {
      sMarketplaceId = nsc('#marketplace-selector').val();
    }
    
    
    var objPolicies      = app.objModel.objPolicyModel.getPoliciesByMarketplace('return_policy', sMarketplaceId);
    var objDefaultPolicy = app.objModel.objPolicyModel.getDefaultPolicy('return_policy', sMarketplaceId);
    var sHTML            = '';
    
    sHTML += '<div class="form-group">';
    sHTML += '  <label for="returnpolicy-selector" class="col-sm-2 control-label">Return Policy</label>';
    sHTML += '  <div class="col-sm-7">';
    sHTML += '    <select id="returnpolicy-selector" class="form-control">';
    for (var sPolicyKey in objPolicies) {
      sHTML += '<option';
      sHTML += ' value="'+sPolicyKey+'"';
      sHTML += (sPolicyKey === objDefaultPolicy.returnPolicyId) ? ' selected="selected"' : '';
      sHTML += '>';
      sHTML += objPolicies[sPolicyKey].name;
      sHTML += '</option>';
    }
    sHTML += '    </select>';
    sHTML += '  </div>';
    sHTML += '  <div class="col-sm-3">';
    sHTML += '    <input type="text" id="returnpolicyid-value"  class="form-control" value="'+objDefaultPolicy.returnPolicyId+'" name="returnPolicyId">';
    sHTML += '  </div>';
    sHTML += '</div><!-- .form-group -->';
    
    return sHTML;
  };
  
  objOffersPanel.getPaymentPolicyMarkup = function(objOffer) {
    var sMarketplaceId = '';
    if (typeof objOffer.marketplaceId !== 'undefined' && objOffer.marketplaceId.length > 0) {
      sMarketplaceId = objOffer.marketplaceId;
    } else {
      sMarketplaceId = nsc('#marketplace-selector').val();
    }
    
    var objPolicies      = app.objModel.objPolicyModel.getPoliciesByMarketplace('payment_policy', sMarketplaceId);
    var objDefaultPolicy = app.objModel.objPolicyModel.getDefaultPolicy('payment_policy', sMarketplaceId);
    var sHTML            = '';
    
    sHTML += '<div class="form-group">';
    sHTML += '  <label for="paymentpolicy-selector" class="col-sm-2 control-label">Payment Policy</label>';
    sHTML += '  <div class="col-sm-7">';
    sHTML += '    <select id="paymentpolicy-selector" class="form-control">';
    for (var sPolicyKey in objPolicies) {
      sHTML += '<option';
      sHTML += ' value="'+sPolicyKey+'"';
      sHTML += (sPolicyKey === objDefaultPolicy.paymentPolicyId) ? ' selected="selected"' : '';
      sHTML += '>';
      sHTML += objPolicies[sPolicyKey].name;
      sHTML += '</option>';
    }
    sHTML += '    </select>';
    sHTML += '  </div>';
    sHTML += '  <div class="col-sm-3">';
    sHTML += '    <input type="text" id="paymentpolicyid-value"  class="form-control" value="'+objDefaultPolicy.paymentPolicyId+'" name="paymentPolicyId">';
    sHTML += '  </div>';
    sHTML += '</div><!-- .form-group -->';
    
    return sHTML;
  };
  
  objOffersPanel.getPriceMarkup = function() {
    var objPriceFields      = {
      product_price    : 'Price',
      product_priceweb : 'Web price',
      product_pricea   : 'Price A',
      product_priceb   : 'Price B',
      product_pricec   : 'Price C'
    };
    var sItemCode           = app.objModel.objEbayCatalogueModel.nCurrentItemCode;
    var objStoreItem        = app.objModel.objStoreCatalogueModel.getItemByCode(sItemCode);
    var objDataMappingModel = app.objModel.objDataMappings;
    var sDefaultField       = objDataMappingModel.getStoreFieldDefaultByEbayField('price');
    var sHTML               = '';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-pricevalue" class="col-sm-2 control-label">Price</label>';
    sHTML += '<div class="col-sm-7">';
    sHTML += '  <select id="new-offer-pricefield" class="form-control">';
    for (var sField in objPriceFields) {
      sHTML += '<option value="'+sField+'"';
      if (sField === sDefaultField) {
        sHTML += ' selected="selected"';
      }
      sHTML += '>';
      sHTML += objPriceFields[sField];
      sHTML += '</option>';
    }
    sHTML += '  </select>';
    sHTML += '</div>';
    sHTML += '<div class="col-sm-3">';
    sHTML += '  <input type="text" class="form-control" name="pricevalue" id="price-value" value="'+objDataMappingModel.getItemDataByField('price', objStoreItem)+'">';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';

    return sHTML;
  };

  objOffersPanel.getCurrencyMarkup = function() {
    var sHTML = '';
    
    sHTML += '<div class="form-group">';
    sHTML += '<label for="item-pricecurrency" class="col-sm-2 control-label">Currency</label>';
    sHTML += '<div class="col-sm-7">';
    sHTML += '  <select name="currency" class="form-control">';
    sHTML += '    <option value="USD">US Dollars</option>';
    sHTML += '    <option value="GBP">Sterling</option>';
    sHTML += '    <option value="CAD">Canadian Dollars</option>';
    sHTML += '    <option value="EUR">Euros</option>';
    sHTML += '  </select>';
    sHTML += '</div>';
    sHTML += '</div> <!-- .form-group -->';

    return sHTML;
  };

  objOffersPanel.getFieldsMarkup = function(sFieldId, sFieldPath, objItem) {
    var objDataMappings   = app.objModel.objDataMappings;
    var objPossibleFields = app.objModel.objDataMappings.arrProductFields;
    var sDefaultField     = objDataMappings.getStoreFieldDefaultByEbayField(sFieldPath, objItem);
    var sHTML = '';
    
    sHTML += '<select id="'+sFieldId+'" class="form-control">';
    for (var nKey in objPossibleFields) {      
      sHTML += '<option value="'+objPossibleFields[nKey]+'"';
      sHTML += (sDefaultField === objPossibleFields[nKey]) ? ' selected="selected"' : '';
      sHTML += '>';
      sHTML += app.objModel.objDataMappings.arrProductFields[nKey];
      sHTML += '</option>';
    }
    sHTML += '</select>';
    
    return sHTML;
  };
  
  objOffersPanel.setModalUpdating = function() {
    nsc('#offer-list-refresh').removeClass().addClass('fa fa-refresh fa-spin fa-fw');
  };

  objOffersPanel.setModalFinishedUpdating = function() {
    nsc('#offer-list-refresh').removeClass().addClass('fa fa-refresh');
  };
  
  return objOffersPanel;
});