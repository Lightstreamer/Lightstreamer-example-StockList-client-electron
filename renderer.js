LightstreamerClient.setLoggerProvider(new ConsoleLoggerProvider(ConsoleLogLevel.WARN));

var protocolToUse = document.location.protocol != "file:" ? document.location.protocol : "http:";
var portToUse = document.location.protocol == "https:" ? "443" : "8080";
// in accordance with the port configuration in the factory lightstreamer_conf.xml (although the https port is not open by the factory lightstreamer_conf.xml)

// Connect to current host (or localhost) and configure a StatusWidget
var lsClient = new LightstreamerClient(protocolToUse+"//localhost:"+portToUse,"DEMO");

lsClient.addListener(new StatusWidget("left", "0px", true));
lsClient.connect();

var stocksGrid = new StaticGrid("stocks",true);
stocksGrid.setAutoCleanBehavior(true,false);
stocksGrid.addListener({
  onVisualUpdate: function(key,info) {
    if (info == null) {
      //cleaning
      return;
    }
    var cold = (key.substring(4) % 2 == 1) ? "#ffffff" : "#b6cf87";
    info.setAttribute("yellow", cold, "backgroundColor");
  }
});

var stockSubscription = new Subscription("MERGE",stocksGrid.extractItemList(),stocksGrid.extractFieldList());
stockSubscription.addListener(stocksGrid);
stockSubscription.setDataAdapter("QUOTE_ADAPTER");
stockSubscription.setRequestedSnapshot("yes");

lsClient.subscribe(stockSubscription);
