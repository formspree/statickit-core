var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function btoa(string) {
  string = String(string);
  var bitmap,
      a,
      b,
      c,
      result = '',
      i = 0,
      rest = string.length % 3; // To determine the final padding

  for (; i < string.length;) {
    if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string.charCodeAt(i++)) > 255) throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");
    bitmap = a << 16 | b << 8 | c;
    result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) + b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
  } // If there's need of padding, replace the last 'A's with equal signs


  return rest ? result.slice(0, rest - 3) + '==='.substring(rest) : result;
}

/**
 * Base-64 encodes a (JSON-castable) object.
 *
 * @param {object} obj - The object to encode.
 * @returns {string}
 */

var encode = function encode(obj) {
  return btoa(JSON.stringify(obj));
};
/**
 * Appends a key-value pair to a target.
 *
 * @param {object|FormData} target
 * @param {string} key
 * @param {string} value
 */

var append = function append(target, key, value) {
  if (target.append) {
    target.append(key, value);
  } else {
    target[key] = value;
  }
};

if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {

      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }

      return to;
    },
    writable: true,
    configurable: true
  });
}

var serializeBody = function serializeBody(data) {
  if (data instanceof FormData) return data;
  JSON.stringify(data);
};
/**
 * The client constructor.
 */


function StaticKit() {
  var _this = this;

  this.session = {
    loadedAt: 1 * new Date(),
    mousemove: 0,
    keydown: 0,
    webdriver: navigator.webdriver || document.documentElement.getAttribute('webdriver') || !!window.callPhantom || !!window._phantom
  };

  this._onMouseMove = function () {
    _this.session.mousemove += 1;
  };

  this._onKeyDown = function () {
    _this.session.keydown += 1;
  };

  window.addEventListener('mousemove', this._onMouseMove);
  window.addEventListener('keydown', this._onKeyDown);
}
/**
 * Tears down the client instance.
 */


StaticKit.prototype.teardown = function teardown() {
  window.removeEventListener('mousemove', this._onMouseMove);
  window.removeEventListener('keydown', this._onKeyDown);
};
/**
 * Submits a form.
 *
 * Returns a `Promise` that resolves to `{body, response}`.
 *
 * @param {object} props
 * @returns {Promise}
 */


StaticKit.prototype.submitForm = function submitForm(props) {
  if (!props.id) {
    throw new Error('You must provide an `id` for the form');
  }

  var endpoint = props.endpoint || 'https://api.statickit.com';
  var url = "".concat(endpoint, "/j/forms/").concat(props.id, "/submissions");
  var data = props.data || {};
  var session = Object.assign({}, this.session, {
    submittedAt: 1 * new Date()
  });
  append(data, '_t', encode(session));
  var request = {
    method: 'POST',
    mode: 'cors',
    body: serializeBody(data)
  };

  if (!(data instanceof FormData)) {
    request.headers = {
      'Content-Type': 'application/json'
    };
  }

  return fetch(url, request).then(function (response) {
    return response.json().then(function (body) {
      return {
        body: body,
        response: response
      };
    });
  });
};
/**
 * Constructs the client object.
 */


var index = (function () {
  return new StaticKit();
});

export default index;
