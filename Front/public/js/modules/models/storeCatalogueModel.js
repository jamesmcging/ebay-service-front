define([
  'jquery', 
  'modules/ebayApi/inventory'],
  function(
    nsc, 
    objApiInventory
  ) {
   
  var objStoreCatalogueModel = {};
  
  objStoreCatalogueModel.objData = {
    objDepartments    : {},
    objCataegories    : {},
    objBrands         : {},
    objThemes         : {},
    objStoreStructure : {},
    objItems          : {},
    arrItemOrder      : [],
    sCurrencySymbol   : '€'
  };
    
  objStoreCatalogueModel.objFilters = {
    nDeptID           : 'all',
    nCatID            : 'all',
    sBrandName        : null,
    sTheme            : null,
    nOffset           : 0,
    nLimit            : 20,
    nItemCount        : 0,
    sOrderByField     : 'product_name',
    sOrderByDirection : 'ASC'
  };

  objStoreCatalogueModel.N_ITEM_DATA_TTL = (60 * 60 * 24 * 7); // Data has a TTL of 1 week
  objStoreCatalogueModel.sCatalogueKey = 'storeCatalogue';
  objStoreCatalogueModel.nCurrentItem = false;
  
  objStoreCatalogueModel.initialize = function() {
    /* Ask the store for details such as a list of departments, categories, 
     * brands, themes that can be used to filter store products */
    var jqxhr = nsc.ajax({
      url      : app.objModel.objURLs.sCatalogueURL+'/store/cataloguedata',
      data     : {},
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      for (var sKey in responsedata) {
        objStoreCatalogueModel.objData[sKey] = responsedata[sKey];
      }
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
    
    jqxhr.always(function() {
      nsc(document).trigger('storestructureupdated');
    });
    
    /* Ask the store for a list of items */
    objStoreCatalogueModel.getItemsFromAPI();
  };
  
  objStoreCatalogueModel.setListeners = function() {};

  objStoreCatalogueModel.getStoreStructure = function() {
    return objStoreCatalogueModel.objData.objStoreStructure; 
  };
  
  objStoreCatalogueModel.getBrands = function() {
    return objStoreCatalogueModel.objData.objBrands; 
  };
    
  objStoreCatalogueModel.getThemes = function() {
    return objStoreCatalogueModel.objData.objThemes; 
  };
  
  objStoreCatalogueModel.getItemsFromAPI = function() {
        
    var jqxhr = nsc.ajax({
      url      : app.objModel.objURLs.sCatalogueURL+'/items',
      data     : objStoreCatalogueModel.objFilters,
      dataType : "json",
      type     : "get"
    });

    jqxhr.done(function(responsedata) {
      /* Reset arrItemOrder */
      objStoreCatalogueModel.objData.arrItemOrder = [];

      /* We store the items in two locations:
       *  1. in objItems keyed on product_id
       *  2. in arrItemOrder keyed on position as per objFilter */
      for (var i in responsedata.arrItemData) {
        objStoreCatalogueModel.objData.arrItemOrder.push(responsedata.arrItemData[i].product_id);
        objStoreCatalogueModel.objData.objItems[responsedata.arrItemData[i].product_id] = responsedata.arrItemData[i];
      }
      objStoreCatalogueModel.objFilters.nItemCount = responsedata.nItemCount;
    });
    
    jqxhr.fail(function(xhr, status, errorThrown) {
      console.log('FAIL');
      console.log(xhr.responseText);
      console.log(status);
      console.log(errorThrown);
    });
    
    jqxhr.always(function() {
      nsc(document).trigger('objItemsUpdated');
    });
  };
  
  objStoreCatalogueModel.getItemByID = function(nProductID) {
    var objItem = false;
    if (typeof objStoreCatalogueModel.objData.objItems[nProductID] !== 'undefined') {
      objItem = objStoreCatalogueModel.objData.objItems[nProductID];
    }
    return objItem;
  };
  
  objStoreCatalogueModel.getItemByCode = function(sProductCode) {
    for (var nProductId in objStoreCatalogueModel.objData.objItems) {
      if (objStoreCatalogueModel.objData.objItems[nProductId].product_code === sProductCode) {
        return objStoreCatalogueModel.objData.objItems[nProductId];
      }
    }
    return false;
  };

  return objStoreCatalogueModel;
});