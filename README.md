# Clockworksms 

CLockworksms API wrapper

# Usage

var clockworksms = require('clockworksms');

var client = clockworksms.createClient('234f97233772fe5cea7cfe14537djki98c03aiwed88w');

```
var _sms = {
  to: '61431214130',
  msg: 'equal bytes for everyone'
}
try {
  client.send(_sms);
} catch(e) {
  console.log(e);
}
```
