const noop = () => { };

const Defer = Promise;

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
const isArray = (arr) => {
  const type = Object.prototype.toString.call(arr);
  return type === '[object Array]'
    || type === '[object NodeList]'
    || type === '[object NamedNodeMap]'
    || type === '[object FileList]';
};

const isUndefined = (str) => {
  return Object.prototype.toString.call(str) === '[object Undefined]';
};

const isEqual = (source, target) => {
  return source === target;
};

const toArray = (obj) => {
  let arrs = [];
  forEach(obj, (v, k) => {
    arrs.push([k, v]);
  });
  return arrs;
};

const toJSON = (value) => {
  return JSON.stringify(value);
};

const forEach = (obj, callback, options) => {
  options = options || {};
  callback = callback || noop;
  let { isReverse } = options;
  let loopObj = () => {
    for (let key in obj) {
      callback(obj[key], key, obj);
    }
  };
  let loopArr = () => {
    if (isReverse) {
      for (let i = obj.length - 1; i >= 0; i--) {
        callback(obj[i], i);
      }
    } else {
      for (let j = 0, len = obj.length; j < len; j++) {
        callback(obj[j], j);
      }
    }
  };
  if (isObject(obj)) {
    loopObj();
  }
  if (isArray(obj)) {
    loopArr();
  }
};

const extend = (destination, sources) => {
  for (let key in sources) {
    let value = sources[key];
    if (!isUndefined(value)) {
      destination[key] = value;
    }
  }
  return destination;
};

const isRequestSuccess = (status) => {
  return /^(200|202)$/.test(status);
};

const deferred = (callback) => {
  return new Defer(callback);
};

const request = (url, option) => {
  return deferred((resolve, reject) => {
    option = option || {};
    const xhr = new XMLHttpRequest(),
      { method = 'get', body, headers = {}, timeout } = option;

    if (method.toLowerCase() === 'get' && isObject(body)) {
      let queryList = [];
      forEach(body, (val, key) => {
        queryList.push(key + '=' + val);
      });
      url = url + '?' + queryList.join('&');
    }

    xhr.open(method, url, true);

    forEach(headers, (header, name) => {
      xhr.setRequestHeader(name, header);
    });

    if (timeout) {
      xhr.timeout = timeout;
    }

    xhr.onreadystatechange = function () {
      if (isEqual(xhr.readyState, 4)) {
        let { responseText } = xhr;
        responseText = responseText || '{}';
        let result = responseText;
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          return reject(result);
        }
        if (isRequestSuccess(xhr.status)) {
          resolve(result);
        } else {
          let { status } = xhr;
          extend(result, {
            status
          });
          reject(result);
        }
      }
    };

    xhr.onerror = (error) => {
      reject(error);
    };

    xhr.withCredentials = true;

    if (body) {
      xhr.send(isObject(body) || isArray(body) ? toJSON(body) : body);
    } else {
      xhr.send();
    }
  });
};

const Http = (() => {
  const httpRequest = (url, option = {}) => {
    url = Config.server + url;
    option.headers = {
      'Content-Type': 'application/json;charset=UTF-8'
    };
    return request(url, option).then((res) => {
      res = res || {};
      return Defer.resolve(res);
    }).catch((err) => {
      err = err || {};
      return Defer.reject(err);
    });
  };
  return {
    post: function (url, body) {
      const option = { method: 'post', body };
      return httpRequest(url, option);
    },
    get: function (url, body) {
      const option = { method: 'get', body };
      return httpRequest(url, option);
    }
  };
})();

const getUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};



