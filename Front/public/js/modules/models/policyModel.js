define([
  'jquery', 
  'modules/ebayApi/account'],
  function(
    nsc, 
    objAccountApi
  ) {
   
  /* Keyed on policy type followed by marketplaceid, followed by policy id */
  var objPolicyModel = {};
  
  objPolicyModel.objPolicies = {
    return_policy : {
      newPolicy : {
        categoryTypes : {
          name : 'ALL_EXCLUDING_MOTORS_VEHICLES',
          default : false
        },
        description : 'Enter a short description of your return policy including: how quickly you will refund and whether you require the items before refunding. (max 250 characters)',
        extendedHolidayReturnsOffered : false,
        marketplaceId : 'EBAY_US',
        name : 'Default Return Policy',
        refundMethod : 'MONEY_BACK',
        restockingFeePercentage : '0.0',
        returnInstructions : 'Enter a detailed description of your return policy (max 5000 characters)',
        returnMethod : 'EXCHANGE',
        returnPeriod : {
          unit : 'DAY',
          value : 14
        },
        returnsAccepted : true,
        returnShippingCostPayer : 'BUYER'
      }
    },
    payment_policy : {
      newPolicy : {
        name : 'An example payment policy',
        description : 'Standard payment policy (max 250 characters)',
        marketplaceId : 'EBAY_US',
        immediatePay : true,
        categoryTypes : {
          name : 'ALL_EXCLUDING_MOTORS_VEHICLES',
          default : false
        },
        paymentMethods : [
          { paymentMethodType : 'PAYPAL',
            recipientAccountReference:{
              referenceId : 'jamesmcging-testretailer@gmail.com',
              referenceType : 'PAYPAL_EMAIL'
            }
          }
        ]
      }
    },
    fulfillment_policy : {
      newPolicy : {
        name : 'minimal fulfillment policy',
        description : 'Short description of policy (max 250 characters)',
        marketplaceId : 'EBAY_US',
        categoryTypes : {
          name : 'ALL_EXCLUDING_MOTORS_VEHICLES',
          default : false
        },
        handlingTime : {
          value : 1,
          unit : 'DAY'
        }
      },
      NewCompletePolicy : {
        categoryTypes : {
          default : true,
          name : 'ALL_EXCLUDING_MOTORS_VEHICLES'
        },
        description : 'Enter a short description of your shipping policy. (max 250 characters)',
        freightShipping : false,
        globalShipping : false,
        handlingTime : {
          unit : "DAY",
          value : 1
        },
        localPickup : false,
        marketplaceId : 'EBAY_US',
        name : 'Name of the fulfillment policy (max 62 characters)',
        pickupDropOff : false,
        shippingOptions : [
          {
            costType : 'FLAT_RATE',
            insuranceFee : {
              currency : 'EUR',
              value : '0.00'
            },
            insuranceOffered : false,
            optionType : 'DOMESTIC',
            packageHandlingCost : {
              currency : 'USD',
              value : 0.00
            },
            shippingServices : {
              additionalShippingCost : {
                currency : 'USD',
                value : 0.00                
              },
              buyerResponsibleForPickup : false,
              buyerResponsibleForShipping : false,
              cashOnDeliveryFee : {
                currency : 'USD',
                value : 0.00   
              },
              freeShipping : false,
              shippingCarrierCode : 'USPS',
              shippingCost : {
                currency : 'USD',
                value : 0.00                  
              },
              shippingServiceCode : '',
              shipToLocations : {
                regionExcluded : [
                  {regionName : ''},
                  {regionType : ''}
                ],
                regionIncluded : [
                  {regionName : ''},
                  {regionType : ''}                  
                ]
              },
              sortOrder : 1,
              surcharge : {
                currency : 'USD',
                value : 0.00   
              }
            }
          }
        ],
        shipToLocations : {
          regionExcluded : [
            {regionName : ''},
            {regionType : ''}
          ],
          regionIncluded : [
            {regionName : ''},
            {regionType : ''}                  
          ]
        }
      }
    }
  };
  
  objPolicyModel.initialize = function() {};
  
  objPolicyModel.setListeners = function() {};

  //////////////////////////////////////////////////////////////////////////////
  // 
  // Calls to local model
  // 
  //////////////////////////////////////////////////////////////////////////////
  objPolicyModel.getPoliciesByMarketplace = function(sPolicyType, sMarketplaceId) {
    var response = false;
    
    if (typeof objPolicyModel.objPolicies[sPolicyType] === 'undefined') {
      alert('unrecognized policy type in getPoliciesByMarketplace! asked for:'+sPolicyType);
    }
    
    if (typeof objPolicyModel.objPolicies[sPolicyType][sMarketplaceId] !== 'undefined') {
      response = objPolicyModel.objPolicies[sPolicyType][sMarketplaceId];
    }
    
    return response;
  };
  
  objPolicyModel.getPolicyById = function(sPolicyType, nPolicyId) {
    var sMarketplaceId = nsc('#marketplace-selector').val();
    var objResponse = {};
    
    if (typeof sPolicyType !== 'undefined' 
          && typeof sMarketplaceId !== 'undefined' 
          && typeof nPolicyId !== 'undefined'
          && typeof objPolicyModel.objPolicies[sPolicyType][sMarketplaceId][nPolicyId] !== 'undefined') {
      objResponse = objPolicyModel.objPolicies[sPolicyType][sMarketplaceId][nPolicyId];
    } else {
      objResponse = objPolicyModel.objPolicies[sPolicyType].newPolicy;
    }
    
    return objResponse;
  };


  //////////////////////////////////////////////////////////////////////////////
  // 
  // Calls to eBay
  // 
  //////////////////////////////////////////////////////////////////////////////
  objPolicyModel.createPolicy = function(sPolicyType, objFormData) {
    switch (sPolicyType)  {
      case 'return_policy' : 
        var objPolicy = {
          categoryTypes : [{
            default : true,
            name : 'ALL_EXCLUDING_MOTORS_VEHICLES'
          }],
          description : objFormData.description,
          extendedHolidayReturnsOffered : false,
          marketplaceId : objFormData.marketplaceId,
          name : objFormData.name,
          refundMethod : objFormData.refundMethod,
          restockingFeePercentage : objFormData.restockingFeePercentage,
          returnInstructions : objFormData.returnInstructions,
          returnMethod : objFormData.returnMethod,
          returnPeriod : {
            unit : objFormData.returnsPeriodUnit,
            value : objFormData.returnsPeriodValue
          },
          returnsAccepted : objFormData.returnsAccepted,
          returnShippingCostPayer : objFormData.returnShippingCostPayer
        };

        objAccountApi.createPolicy('return_policy', objPolicy, objPolicyModel.createReturnPolicyRestResponse);
        break;
        
        case 'fulfillment_policy' :
          var objPolicy = {
            name : objFormData.name,
            description : objFormData.description,
            marketplaceId : nsc('#marketplace-selector').val(),
            categoryTypes : [{
              name : 'ALL_EXCLUDING_MOTORS_VEHICLES'
            }],
            handlingTime : {
              value : objFormData.fulfillmentHandlingtimeValue,
              unit : 'DAY'
            }
          };
          
          objAccountApi.createPolicy('fulfillment_policy', objPolicy, objPolicyModel.createFulfillmentPolicyRestResponse);
        break;

        case 'payment_policy' :
          var objPolicy = {
            name : objFormData.name,
            description : objFormData.description,
            marketplaceId : objFormData.marketplaceId,
            immediatePay : (objFormData.immediatePay) ? true : false,
            categoryTypes : [{
              name : 'ALL_EXCLUDING_MOTORS_VEHICLES',
              default : false
            }],
            paymentMethods : [{
              paymentMethodType : 'PAYPAL',
              recipientAccountReference:{
                referenceId : objFormData.referenceId,
                referenceType : objFormData.referenceType
              }
            }]
          };
          
          objAccountApi.createPolicy('payment_policy', objPolicy, objPolicyModel.createPaymentPolicyRestResponse);
        break;
        
      default:
        nsc(document).trigger('unrecognisedpolicytype', [{sPolicyType: sPolicyType}]);
    }
  };
  
  objPolicyModel.createReturnPolicyRestResponse = function(objData) {
    if (typeof objData.sResponseMessage.errors !== 'undefined') {
      nsc(document).trigger('policycreationerror', [objData.sResponseMessage.errors]);
    } else if (objData.nResponseCode === 201) {
      var sMarketplaceId = nsc('#marketplace-selector').val();
      var nPolicyId = objData.sResponseMessage.returnPolicyId;
      objPolicyModel.objPolicies.return_policy[sMarketplaceId][nPolicyId] = objData.sResponseMessage;
      nsc(document).trigger('policycreated', [{nPolicyId: nPolicyId}]);
    }
  };
  
  objPolicyModel.createFulfillmentPolicyRestResponse = function(objData) {
    if (typeof objData.sResponseMessage.errors !== 'undefined') {
      nsc(document).trigger('policycreationerror', [objData.sResponseMessage.errors]);
    } else if (objData.nResponseCode === 201) {
      var sMarketplaceId = objData.sResponseMessage.marketplaceId;
      var nPolicyId      = objData.sResponseMessage.fulfillmentPolicyId;
      
      if (typeof objPolicyModel.objPolicies.fulfillment_policy[sMarketplaceId] === 'undefined') {
        objPolicyModel.objPolicies.fulfillment_policy[sMarketplaceId] = {};
      }

      objPolicyModel.objPolicies.fulfillment_policy[sMarketplaceId][nPolicyId] = objData.sResponseMessage;
      
      nsc(document).trigger('policycreated', [{nPolicyId: nPolicyId}]);
    }
  };  

  objPolicyModel.createPaymentPolicyRestResponse = function(objData) {
    if (typeof objData.sResponseMessage.errors !== 'undefined') {
      nsc(document).trigger('policycreationerror', [objData.sResponseMessage.errors]);
    } else if (objData.nResponseCode === 201) {
      var sMarketplaceId = objData.sResponseMessage.marketplaceId;
      var nPolicyId      = objData.sResponseMessage.paymentPolicyId;
      
      if (typeof objPolicyModel.objPolicies.payment_policy[sMarketplaceId] === 'undefined') {
        objPolicyModel.objPolicies.payment_policy[sMarketplaceId] = {};
      }

      objPolicyModel.objPolicies.payment_policy[sMarketplaceId][nPolicyId] = objData.sResponseMessage;
      
      nsc(document).trigger('policycreated', [{nPolicyId: nPolicyId}]);
    }
  }; 
  
  
  objPolicyModel.deletePolicy = function(sPolicyType, nPolicyId) {
    switch (sPolicyType) {
      case 'return_policy' :
        var sMarketplaceId = nsc('#marketplace-selector').val();
        var objData = {sPolicyType: sPolicyType, sMarketplaceId: sMarketplaceId, nPolicyId: nPolicyId};
        objAccountApi.deletePolicy('return_policy', nPolicyId, objData, objPolicyModel.deleteReturnPolicyRestResponse);
        break;
        
      case 'fulfillment_policy' :
        var sMarketplaceId = nsc('#marketplace-selector').val();
        var objData = {sPolicyType: sPolicyType, sMarketplaceId: sMarketplaceId, nPolicyId: nPolicyId};
        objAccountApi.deletePolicy('fulfillment_policy', nPolicyId, objData, objPolicyModel.deleteFulfillmentPolicyRestResponse);
        break;
        
      case 'fulfillment_policy' :
        var sMarketplaceId = nsc('#marketplace-selector').val();
        var objData = {sPolicyType: sPolicyType, sMarketplaceId: sMarketplaceId, nPolicyId: nPolicyId};
        objAccountApi.deletePolicy('payment_policy', nPolicyId, objData, objPolicyModel.deletePaymentPolicyRestResponse);
        break;
    }
  };
  
  objPolicyModel.deleteReturnPolicyRestResponse = function(objData) {
    if (objData.nResponseCode === 204) {
      delete objPolicyModel.objPolicies.return_policy[objData.arrParams.sMarketplaceId][objData.arrParams.nPolicyId];
      nsc(document).trigger('policydeleted', [{sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);
    } else if (typeof objData.sResponseMessage.errors !== 'undefined') {
      nsc(document).trigger('failedtodeletepolicy', [{arrErrors:objData.sResponseMessage.errors, sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);      
    } else {
      nsc(document).trigger('failedtodeletepolicy', [{sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);
    }
  };
  
  objPolicyModel.deleteFulfillmentPolicyRestResponse = function(objData) {
    if (objData.nResponseCode === 204) {
      delete objPolicyModel.objPolicies.fulfillment_policy[objData.arrParams.sMarketplaceId][objData.arrParams.nPolicyId];
      nsc(document).trigger('policydeleted', [{sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);
    } else if (typeof objData.sResponseMessage.errors !== 'undefined') {
      nsc(document).trigger('failedtodeletepolicy', [{arrErrors:objData.sResponseMessage.errors, sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);      
    } else {
      nsc(document).trigger('failedtodeletepolicy', [{sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);
    }
  };
  
  objPolicyModel.deletePaymentPolicyRestResponse = function(objData) {
    if (objData.nResponseCode === 204) {
      delete objPolicyModel.objPolicies.payment_policy[objData.arrParams.sMarketplaceId][objData.arrParams.nPolicyId];
      nsc(document).trigger('policydeleted', [{sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);
    } else if (typeof objData.sResponseMessage.errors !== 'undefined') {
      nsc(document).trigger('failedtodeletepolicy', [{arrErrors:objData.sResponseMessage.errors, sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);      
    } else {
      nsc(document).trigger('failedtodeletepolicy', [{sPolicyType:objData.arrParams.sPolicyType, sMarketplaceId:objData.arrParams.sMarketplaceId, nPolicyId: objData.arrParams.nPolicyId}]);
    }
  };
  
  
  objPolicyModel.getPoliciesByMarketplaceFromEbay = function(sPolicyType, sMarketplaceId) {
    switch (sPolicyType) {
      case 'return_policy' :
        objAccountApi.getPoliciesByMarketplace('return_policy', sMarketplaceId, objPolicyModel.getReturnPoliciesByMarketplaceRestResponse);
        break;
        
      case 'fulfillment_policy' :
        objAccountApi.getPoliciesByMarketplace('fulfillment_policy', sMarketplaceId, objPolicyModel.getFulfillmentPoliciesByMarketplaceRestResponse);
        break;
        
      case 'payment_policy' :
        objAccountApi.getPoliciesByMarketplace('payment_policy', sMarketplaceId, objPolicyModel.getPaymentPoliciesByMarketplaceRestResponse);
        break;
    }
  };
  
  objPolicyModel.getReturnPoliciesByMarketplaceRestResponse = function(objData) {
    if (objData.nResponseCode === 200) {
      if (objData.sResponseMessage.total > 0) {
        for (var nKey in objData.sResponseMessage.returnPolicies) {
          var sMarketplaceId = objData.sResponseMessage.returnPolicies[nKey].marketplaceId;
          var nPolicyId      = objData.sResponseMessage.returnPolicies[nKey].returnPolicyId;
          
          /* Ensure that we have an entry for this marketplace so we can insert
           * a policy into it. */
          if (typeof objPolicyModel.objPolicies.return_policy[sMarketplaceId] === 'undefined') {
            objPolicyModel.objPolicies.return_policy[sMarketplaceId] = {};
          }

          objPolicyModel.objPolicies.return_policy[sMarketplaceId][nPolicyId] = objData.sResponseMessage.returnPolicies[nKey];
        }
      }
      nsc(document).trigger('returnpoliciesfetched', [objData.sResponseMessage.total]);
    } else {
      nsc(document).trigger('failedtofetchreturnpolicies', ['Fetch return policies', objData]);
    }
  };
  
  objPolicyModel.getFulfillmentPoliciesByMarketplaceRestResponse = function(objData) {
    if (objData.nResponseCode === 200) {
      if (objData.sResponseMessage.total > 0) {
        for (var nKey in objData.sResponseMessage.fulfillmentPolicies) {
          var sMarketplaceId = objData.sResponseMessage.fulfillmentPolicies[nKey].marketplaceId;          
          var nPolicyId      = objData.sResponseMessage.fulfillmentPolicies[nKey].fulfillmentPolicyId;
          
          /* Ensure that we have an entry for this marketplace so we can insert
           * a policy into it. */
          if (typeof objPolicyModel.objPolicies.fulfillment_policy[sMarketplaceId] === 'undefined') {
            objPolicyModel.objPolicies.fulfillment_policy[sMarketplaceId] = {};
          }

          objPolicyModel.objPolicies.fulfillment_policy[sMarketplaceId][nPolicyId] = objData.sResponseMessage.fulfillmentPolicies[nKey];
        }
      }
      nsc(document).trigger('fulfillmentpoliciesfetched', [objData.sResponseMessage.total]);
    } else {
      nsc(document).trigger('failedtofetchfulfillmentpolicies', ['Fetch fulfillment policies', objData]);
    }
  };
  
  objPolicyModel.getPaymentPoliciesByMarketplaceRestResponse = function(objData) {
    if (objData.nResponseCode === 200) {
      if (objData.sResponseMessage.total > 0) {
        for (var nKey in objData.sResponseMessage.paymentPolicies) {
          var sMarketplaceId = objData.sResponseMessage.paymentPolicies[nKey].marketplaceId;          
          var nPolicyId      = objData.sResponseMessage.paymentPolicies[nKey].paymentPolicyId;
          
          /* Ensure that we have an entry for this marketplace so we can insert
           * a policy into it. */
          if (typeof objPolicyModel.objPolicies.payment_policy[sMarketplaceId] === 'undefined') {
            objPolicyModel.objPolicies.payment_policy[sMarketplaceId] = {};
          }

          objPolicyModel.objPolicies.payment_policy[sMarketplaceId][nPolicyId] = objData.sResponseMessage.paymentPolicies[nKey];
        }
      }
      nsc(document).trigger('paymentpoliciesfetched', [objData.sResponseMessage.total]);
    } else {
      nsc(document).trigger('failedtofetchpaymentpolicies', ['Fetch paymant policies', objData]);
    }
  };
  
  
  objPolicyModel.updatePolicy = function(sPolicyType, nPolicyId, objFormData) {
    switch (sPolicyType) {
      case 'return_policy':
        var objUpdatedPolicy = {
          categoryTypes : [{
            default : true,
            name : 'ALL_EXCLUDING_MOTORS_VEHICLES'
          }],
          description : objFormData.description,
          extendedHolidayReturnsOffered : false,
          marketplaceId : objFormData.marketplaceId,
          name : objFormData.name,
          refundMethod : objFormData.refundMethod,
          restockingFeePercentage : objFormData.restockingFeePercentage,
          returnInstructions : objFormData.returnInstructions,
          returnMethod : objFormData.returnMethod,
          returnPeriod : {
            unit : objFormData.returnsPeriodUnit,
            value : objFormData.returnsPeriodValue
          },
          returnsAccepted : objFormData.returnsAccepted,
          returnShippingCostPayer : objFormData.returnShippingCostPayer
        };

        objAccountApi.updatePolicy('return_policy', nPolicyId, objUpdatedPolicy, objPolicyModel.updateReturnPolicyRestResponse);
        break;
        
      case 'fulfillment_policy':
        var objPolicy = {
          name : objFormData.name,
          description : objFormData.description,
          marketplaceId : nsc('#marketplace-selector').val(),
          categoryTypes : [{
            name : 'ALL_EXCLUDING_MOTORS_VEHICLES'
          }],
          handlingTime : {
            value : objFormData.fulfillmentHandlingtimeValue,
            unit : 'DAY'
          }
        };

        objAccountApi.updatePolicy('fulfillment_policy', nPolicyId, objPolicy, objPolicyModel.updateFulfillmentPolicyRestResponse);
        break;
             
      case 'payment_policy' :
        var objPolicy = {
          name : objFormData.name,
          description : objFormData.description,
          marketplaceId : objFormData.marketplaceId,
          immediatePay : (objFormData.immediatePay) ? true : false,
          categoryTypes : [{
            name : 'ALL_EXCLUDING_MOTORS_VEHICLES',
            default : false
          }],
          paymentMethods : [{ 
              paymentMethodType : 'PAYPAL',
              recipientAccountReference:{
                referenceId : objFormData.referenceId,
                referenceType : objFormData.referenceType
              }
            }]
        };

        objAccountApi.updatePolicy('payment_policy', nPolicyId, objPolicy, objPolicyModel.updatePaymentPolicyRestResponse);
      break;
    }
  };
  
  objPolicyModel.updateReturnPolicyRestResponse = function(objData) {
    if (objData.nResponseCode === 200) {
      var nProductId = objData.sResponseMessage.returnPolicyId;
      nsc(document).trigger('policyupdated', [{nPolicyId:nProductId}]);
    } else {
      nsc(document).trigger('policyupdatefailed');
    }
  };
    
  objPolicyModel.updateFulfillmentPolicyRestResponse = function(objData) {
    if (objData.nResponseCode === 200) {
      var nProductId = objData.sResponseMessage.returnPolicyId;
      nsc(document).trigger('policyupdated', [{nPolicyId:nProductId}]);
    } else {
      nsc(document).trigger('policyupdatefailed');
    }
  };
  
  objPolicyModel.updatePaymentPolicyRestResponse = function(objData) {
    if (objData.nResponseCode === 200) {
      var nProductId = objData.sResponseMessage.paymentPolicyId;
      nsc(document).trigger('policyupdated', [{nPolicyId:nProductId}]);
    } else {
      nsc(document).trigger('policyupdatefailed');
    }
  };
        
  return objPolicyModel;
});