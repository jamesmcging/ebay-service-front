# ebay-service-front

### Masters in Software Development @ CIT 2017

### Overview
This service is charged with delivering the static content of the eBay prototype. The app that this generates requires ebay-service-catalogue, ebay-service-ebay and ebay-service-orders to work

 - Server side code is handled in PHP using the Slim framework 
 - The front end is vanilla javascript with help from jQuery and requireJS
 - Responsibility for making it pretty has been delegated to Bootstrap 3

### Javascript Component
A single page browser app, most of the code is in js structured as follows. This can all be followed in a browser console.

```
app
 |---objModel
 |   |---objStoreCatalogueModel
 |   |---objEbayCatalogueModel
 |   |---objPoliciesModel
 |   |---objLocationsModel
 |   |---objDatamappingsModel
 |   |---objOffersModel
 |
 |---objInterface
     |---objNavTabs
        |---dashboard
        |   |---summaryPanel
        |   |---credentialsPanel
        |   |---datamappingsPanel
        |   |---fulfillmentPolicyPanel
        |   |---returnPolicyPanel
        |   |---paymentPanel
        |   |---locationsPanel
        |
        |---storeCatalogue
        |   |---filtersPanel
        |   |---listingsPanel
        |
        |---ebayCatalogue
        |   |---listingsPanel
        |
        |---ebayListings
        |---orders
        |---tools
 ```
        
Each element is contained in a js file loaded as required by RequireJS. Each element is either a model component charged with managing the state of something, or a panel component charged with displaying the interface to the user. A panel acts as both a view and controller. It is the base object that all the interface panels inherit.

     
