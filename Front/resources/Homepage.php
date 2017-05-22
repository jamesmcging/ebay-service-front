<?php

namespace Front\resources;

/**
 * Description of Homepage
 *
 * @author James McGing <jamesmcging@gmail.com>
 */
class Homepage {
  public function getHomepage($objRequest, $objResponse, $args) { 

    $sURLs = 'objURLs = '.json_encode($this->getURLs());

    $sHTML = <<<HTML
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>eBay Project</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="description" content="eBay Prototype done for a Master in Software Development in CIT">
          <meta name="author" content="jamesmcging@gmail.com">

          <link rel="stylesheet" href="css/bootstrap.min.css">
          <link rel="stylesheet" href="css/ebay.css">
          <link rel="stylesheet" href="css/font-awesome.min.css">
          <link rel="shortcut icon" href="about:blank">
          </head>
        <body>
          <div>
            <script>{$sURLs}</script>
            <script src="js/config.js"></script>
            <script data-main="modules/main" src="js/lib/require.js"></script>
          </div>
            
          <div id="loading-screen" class="text-center">
            <span class="fa fa-3x fa-refresh fa-spin fa-fw text-center"></span>
            <p class="text-center">Loading Alaname...</p>
            <ul id="loading-message-list"></ul>
          </div>
        </body>
      </html>
HTML;
            
    $objResponse->getBody()->write($sHTML);

    return $objResponse;
  }
  
  private function getURLs() {
    // Determine the URLs of the various services used by the app. These vary
    // depending on whether the pp is running in dev mode or on the live servers
    if (isset($_SERVER['EBAY_ENVIRONMENT']) && $_SERVER['EBAY_ENVIRONMENT'] == \Front\interfaces\EnvironmentInterface::DEV_MODE) {
      $arrURLs = array(
        'sStoreURL'     => \Front\interfaces\URLInterface::DEV_MAIN_URL,
        'sEbayURL'      => \Front\interfaces\URLInterface::DEV_EBAY_URL,
        'sOrdersURL'    => \Front\interfaces\URLInterface::DEV_ORDER_URL,
        'sCatalogueURL' => \Front\interfaces\URLInterface::DEV_CATA_URL
      );
    } else {
      $arrURLs = array(
        'sStoreURL'     => \Front\interfaces\URLInterface::LIVE_MAIN_URL,
        'sEbayURL'      => \Front\interfaces\URLInterface::LIVE_EBAY_URL,
        'sOrdersURL'    => \Front\interfaces\URLInterface::LIVE_ORDER_URL,
        'sCatalogueURL' => \Front\interfaces\URLInterface::LIVE_CATA_URL
      );
    }
    
    return $arrURLs;
  }
}
