define([
  'jquery',
  'modules/ebayApi/inventory'],
  function(
    nsc,
    objApiInventory
  ) {
   
  var objEbayOffersModel = {};
  
  objEbayOffersModel.objOffers = {
    sProductCode : {
      nOfferCount : 1,
      objProductOffers : {
        newOffer : {                       // offer id - numeric if from ebay
          availableQuantity : null,
          cateogryId : '',
          format : '',
          listingDescription : '',
          listingPolicies : {
            fulfillmentPolicyId : '',
            paymentPolicyId : '',
            returnPolicyId : ''
          },
          marketplaceId : '',
          merchantLocationKey : '',
          pricingSummary : {
            price : {
              currency : '',
              value : ''
            }
          },
          quantityLimitPerBuyer : '',
          sku : ''
        }
      }
    }
  };
  
  objEbayOffersModel.objFilters = {};

  objEbayOffersModel.nEbayOfferCount = 'unknown';
  
  objEbayOffersModel.initialize = function() {};
  
  objEbayOffersModel.setListeners = function() {};
  
  objEbayOffersModel.getOfferById = function(nSoughtOfferId) {
    var objOffer = '';
    for (var sProductCode in objEbayOffersModel.objOffers) {
      if (objEbayOffersModel.objOffers[sProductCode].nOfferCount > 0) {
        for (var nOfferId in objEbayOffersModel.objOffers[sProductCode].objProductOffers) {
          /* Leave this as a double == as sku can be numeric and passed as strings */
          if (nOfferId == nSoughtOfferId) {
            objOffer = objEbayOffersModel.objOffers[sProductCode].objProductOffers[nOfferId];
            break;
          }
        }
      }
    }
    
    return objOffer;
  };
  
  objEbayOffersModel.getSkuByOfferId = function(nTargetOfferId) {
    for (var sProductCode in objEbayOffersModel.objOffers) {
      for (var nOfferId in objEbayOffersModel.objOffers[sProductCode]) {
        if (nTargetOfferId == nOfferId) {
          return sProductCode;
        }
      }
    }
    
    return false;
  };
  
  /* ------------------------------------------------------------------------ */
  
  objEbayOffersModel.getOffersByProductcode = function(sProductCode) {
    if (typeof objEbayOffersModel.objOffers[sProductCode] !== 'undefined'
          && typeof objEbayOffersModel.objOffers[sProductCode].nOfferCount !== 'undefined'
          && objEbayOffersModel.objOffers[sProductCode].nOfferCount === 0) {
      return false;
      
    } else if (typeof objEbayOffersModel.objOffers[sProductCode] !== 'undefined'
          && typeof objEbayOffersModel.objOffers[sProductCode].objProductOffers !== 'undefined') {
      return objEbayOffersModel.objOffers[sProductCode].objProductOffers;
      
    } else {
      objApiInventory.getOffersByProductCode(sProductCode, objEbayOffersModel.getOffersByProductcodeRestResponse);  
      return false;
    }
  };
  
  objEbayOffersModel.getOffersByProductcodeRestResponse = function(objData, sProductCode, arrParams) {    
    /* Because of the way we pass the product code to the rest call we need to 
     * strip out some caharcters */
    sProductCode = sProductCode.substring(5);
    
    /* Ensure we have a place to drop any offers */
    if (typeof objEbayOffersModel.objOffers[sProductCode] === 'undefined') {
      objEbayOffersModel.objOffers[sProductCode] = {
        nOfferCount : 0,
        objProductOffers : {}
      };
    }
    
    /* Now save in any offers returned */
    if(objData && objData.sResponseMessage.total > 0) {
      objEbayOffersModel.nEbayOfferCount = objData.sResponseMessage.total;
      for (var i = 0, nLength = objData.sResponseMessage.offers.length; i < nLength; i++) {
        var nOfferId     = objData.sResponseMessage.offers[i].offerId;
        /* Save the offer */
        objEbayOffersModel.objOffers[sProductCode].objProductOffers[nOfferId] = objData.sResponseMessage.offers[i];
      }
      
      /* record the amount of offers */
      objEbayOffersModel.objOffers[sProductCode].nOfferCount = Object.keys(objEbayOffersModel.objOffers[sProductCode].objProductOffers).length;
    }
    
    nsc(document).trigger('offersfetched', [objEbayOffersModel.objOffers[sProductCode].nOfferCount]);
  };
  
  
  objEbayOffersModel.getOfferFromEbayByOfferId = function(sOfferID) {};
  
  objEbayOffersModel.getOfferFromEbayByOfferIdRestResponse = function(objData, nOfferID) {};
  
  
  objEbayOffersModel.createOffer = function(objFormData) {
    console.log(objFormData);
    var objData = {};
    
    if (objFormData.availableQuantity !== 'undefined') {
      objData.availableQuantity = objFormData.availableQuantity;
    }
    if (objFormData.categoryId !== 'undefined') {
      objData.categoryId = objFormData.categoryId;
    }
    if (objFormData.format !== 'undefined') {
      objData.format = objFormData.format;
    }
    if (objFormData.description !== 'undefined') {
      objData.description = objFormData.description;
    }
    if (objFormData.fulfillmentPolicyId !== 'undefined'
            || objFormData.paymentPolicyId !== 'undefined'
            || objFormData.paymentPolicyId !== 'undefined') {
      objData.listingPolicies = {};
    }
    if (objFormData.fulfillmentPolicyId !== 'undefined') {
      objData.listingPolicies.fulfillmentPolicyId = objFormData.fulfillmentPolicyId;
    }
    if (objFormData.paymentPolicyId !== 'undefined') {
      objData.listingPolicies.paymentPolicyId = objFormData.paymentPolicyId;
    }
    if (objFormData.returnPolicyId !== 'undefined') {
      objData.listingPolicies.returnPolicyId = objFormData.returnPolicyId;
    }
    if (objFormData.marketplaceId !== 'undefined') {
      objData.marketplaceId = objFormData.marketplaceId;
    }
    if (objFormData.locationId !== 'undefined') {
      objData.merchantLocationKey = objFormData.locationId;
    }
    if (objFormData.pricevalue !== 'undefined' 
            ||  objFormData.currency !== 'undefined') {
      objData.pricingSummary = {
        price : {}
      };
    };
    if (objFormData.pricevalue !== 'undefined') {
      objData.pricingSummary.price.value = objFormData.pricevalue;
    }
    if (objFormData.currency !== 'undefined') {
      objData.pricingSummary.price.currency = objFormData.currency;
    }
    if (objFormData.sku !== 'undefined') {
      objData.sku = objFormData.sku;
    }    

    objApiInventory.createOffer(objData, objEbayOffersModel.createOfferRestResponse);
  };
  
  objEbayOffersModel.createOfferRestResponse = function(objData) {
    if (objData.nResponseCode === 201) {
      var nOfferId     = objData.sResponseMessage.offerId;
      var sProductCode = objData.arrParams.sku;

      /* Ensure we have a place to drop any offers */
      if (typeof objEbayOffersModel.objOffers[sProductCode] === 'undefined') {
        objEbayOffersModel.objOffers[sProductCode] = {
          nOfferCount : 0,
          objProductOffers : {}
        };
      }
      
      objEbayOffersModel.objOffers[sProductCode].objProductOffers[nOfferId] = objData.arrParams;
      objEbayOffersModel.objOffers[sProductCode].nOfferCount++;

      /* Ask eBay how much it will be to public this listing */
      //objEbayOffersModel.getListingFees([{offerId: nOfferId}]);
      
      /* Let the app know we have got a new offer */
      nsc(document).trigger('offercreated', [nOfferId]);
      
    } else {
      nsc(document).trigger('failedrestcall', ['create offer', objData.sResponseMessage]);
    }
  };
  
  
  objEbayOffersModel.updateOffer = function(nOfferId, objOfferData) {
    var objData = {};
    objData.nOfferId = nOfferId;
    
    if (objOfferData.availableQuantity !== 'undefined') {
      objData.availableQuantity = objOfferData.availableQuantity;
    }
    if (objOfferData.categoryId !== 'undefined') {
      objData.categoryId = objOfferData.categoryId;
    }
    if (objOfferData.format !== 'undefined') {
      objData.format = objOfferData.format;
    }
    if (objOfferData.description !== 'undefined') {
      objData.description = objOfferData.description;
    }
    if (objOfferData.fulfillmentPolicyId !== 'undefined'
            || objOfferData.paymentPolicyId !== 'undefined'
            || objOfferData.paymentPolicyId !== 'undefined') {
      objData.listingPolicies = {};
    }
    if (objOfferData.fulfillmentPolicyId !== 'undefined') {
      objData.listingPolicies.fulfillmentPolicyId = objOfferData.fulfillmentPolicyId;
    }
    if (objOfferData.paymentPolicyId !== 'undefined') {
      objData.listingPolicies.paymentPolicyId = objOfferData.paymentPolicyId;
    }
    if (objOfferData.returnPolicyId !== 'undefined') {
      objData.listingPolicies.returnPolicyId = objOfferData.returnPolicyId;
    }
    if (objOfferData.marketplaceId !== 'undefined') {
      objData.marketplaceId = objOfferData.marketplaceId;
    }
    if (objOfferData.locationId !== 'undefined') {
      objData.merchantLocationKey = objOfferData.locationId;
    }
    if (objOfferData.pricevalue !== 'undefined' 
            || objOfferData.currency !== 'undefined') {
      objData.pricingSummary = {};
    };
    if (objOfferData.pricevalue !== 'undefined') {
      objData.pricingSummary.value = objOfferData.pricevalue;
    }
    if (objOfferData.currency !== 'undefined') {
      objData.pricingSummary.currency = objOfferData.currency;
    }
    if (objOfferData.sku !== 'undefined') {
      objData.sku = objOfferData.sku;
    } 
    objApiInventory.updateOffer(nOfferId, objData, objEbayOffersModel.updateOfferRestResponse);
  };
  
  objEbayOffersModel.updateOfferRestResponse = function(objResponseData, nOfferId, objParams) {
    console.log(objResponseData);
    console.log(objParams);
    
    if (objResponseData.nResponseCode === 204) {
      var sSku     = objResponseData.arrParams.sku;
      objEbayOffersModel.objOffers[sSku][nOfferId] = objResponseData.arrParams;
      nsc(document).trigger('offerupdated', [objResponseData]);
    } else {
      nsc(document).trigger('offerupdatefailed', [objResponseData]);
    }
  };
  
  
  objEbayOffersModel.deleteOffer = function(nOfferId) {
    objApiInventory.deleteOffer(nOfferId, objEbayOffersModel.deleteOfferRestResponse);
  };
  
  objEbayOffersModel.deleteOfferRestResponse = function(objResponseData, nOfferId, objParams) {
    if (objResponseData.nResponseCode === 204) {      
      var objOffer = app.objModel.objEbayOffersModel.getOfferById(nOfferId);
      var sSku     = objOffer.sku;
      delete objEbayOffersModel.objOffers[sSku].objProductOffers[nOfferId];
      objEbayOffersModel.objOffers[sSku].nOfferCount--;
      nsc(document).trigger('offerdeleted', [nOfferId, objParams, objResponseData]);
    } else {
      nsc(document).trigger('failedtodeleteoffer', [nOfferId, objParams, objResponseData]);
    }
  };
  
  
  objEbayOffersModel.getListingFee = function(nOfferId) {
    var objPostData = {
      offers : [
        {offerId : nOfferId}
      ]
    };
    objApiInventory.getListingFee(objPostData, objEbayOffersModel.getListingFeesRestResponse);
  };
  
  objEbayOffersModel.getListingFeesRestResponse = function(objData) {
    console.log(objData);
    if (objData.nResponseCode === 200) {
      /* Add the listing fee somewhere useful*/
      var objFeeSummaries = objData.sResponseMessage.feeSummaries;
      nsc(document).trigger('listingfeeobtained');
    } else {
      nsc(document).trigger('failedtofetchfee', ['Get listing fee', objData.sResponseMessage]);
    }
  };
  
  
  objEbayOffersModel.publishOffer = function(nOfferId) {
    objApiInventory.publishOffer(nOfferId, objEbayOffersModel.publishOfferRestResponse);
  };
  
  objEbayOffersModel.publishOfferRestResponse = function(objResponseData) {
    if (objResponseData.nResponseCode === 200) {
      var nOfferId     = objResponseData.arrParams.nOfferId;
      var sProductCode = objEbayOffersModel.getSkuByOfferId(nOfferId);
      objEbayOffersModel.objOffers[sProductCode][nOfferId].status = 'PUBLISHED';
      nsc(document).trigger('offerpublished', [objResponseData]);
    } else {
      nsc(document).trigger('failedtopublishoffer', [objResponseData]);
    }
  };
  
  
  return objEbayOffersModel;
});