function reconnect() {
  var callback = {
    onSuccess: function (userId) {
      console.log('reconnect success. ' + userId);
    },
    onTokenIncorrect: function () {
      console.log('token 无效');
    },
    onError: function (errorCode) {
      reconnect();
    }
  };
  var config = {
    auto: true,
    url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js?d=' + Date.now(),
    rate: [100, 1000, 3000, 6000, 10000]
  };
  RongIMClient.reconnect(callback, config);
}

function initIM(params) {
  var appkey = params.appkey;
  var token = params.token;
  RongIMClient.init(appkey);

  RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      console.log('status changed', status);
      switch (status) {
        case RongIMLib.ConnectionStatus.CONNECTING:
          break;
        case RongIMLib.ConnectionStatus.DISCONNECTED:
          break;
        case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
          reconnect();
          break;
      }
    }
  });

  RongIMClient.setOnReceiveMessageListener({
    onReceived: function (message) {
      console.log(message);
    }
  });
  return new Promise((resolve, reject) => {
    RongIMClient.connect(token, {
      onSuccess: resolve,
      onTokenIncorrect: reject,
      onError: reject
    });
  });
}