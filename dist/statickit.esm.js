import Object$1 from 'core-js-pure/stable/object';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// Polyfill from  https://github.com/MaxArt2501/base64-js/blob/master/base64.js
(function () {
  // base64 character set, plus padding character (=)
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      // Regular expression to check formal correctness of base64 encoded strings
  b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

  window.btoa = window.btoa || function (string) {
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
  };

  window.atob = window.atob || function (string) {
    // atob can work with strings with whitespaces, even inside the encoded part,
    // but only \t, \n, \f, \r and ' ', which can be stripped.
    string = String(string).replace(/[\t\n\f\r ]+/g, '');
    if (!b64re.test(string)) throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."); // Adding the padding if missing, for semplicity

    string += '=='.slice(2 - (string.length & 3));
    var bitmap,
        result = '',
        r1,
        r2,
        i = 0;

    for (; i < string.length;) {
      bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12 | (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }

    return result;
  };
})();

/**
 * Base-64 encodes a (JSON-castable) object.
 *
 * @param {Object} obj
 */

var encode = function encode(obj) {
  window.btoa(JSON.stringify(obj));
};
/**
 * Appends a key-value pair to a target.
 *
 * @param {Object|FormData} target
 * @param {String} key
 * @param {String} value
 */

var append = function append(target, key, value) {
  if (target.append) {
    target.append(key, value);
  } else {
    data[key] = value;
  }
};

var StaticKit =
/*#__PURE__*/
function () {
  function StaticKit() {
    var _this = this;

    _classCallCheck(this, StaticKit);

    this.session = {
      loadedAt: 1 * new Date(),
      mousemove: 0,
      keydown: 0,
      webdriver: navigator.webdriver || document.documentElement.getAttribute('webdriver') || !!window.callPhantom || !!window._phantom
    };
    window.addEventListener('mousemove', function () {
      _this.session.mousemove += 1;
    });
    window.addEventListener('keydown', function () {
      _this.session.keydown += 1;
    });
  }
  /**
   * Submits a form.
   *
   * @param {Object} props
   */


  _createClass(StaticKit, [{
    key: "submitForm",
    value: function () {
      var _submitForm = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(props) {
        var endpoint, url, data, session, response, body;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (props.id) {
                  _context.next = 2;
                  break;
                }

                throw new Error('You must provide an `id` for the form');

              case 2:
                endpoint = props.endpoint || 'https://api.statickit.com';
                url = "".concat(endpoint, "/j/forms/").concat(id, "/submissions");
                data = props.data || {};
                session = Object$1.assign({}, this.session, {
                  submittedAt: 1 * new Date()
                });
                append(data, '_t', encode(session));
                _context.next = 9;
                return fetch(url, {
                  method: 'POST',
                  mode: 'cors',
                  body: data
                });

              case 9:
                response = _context.sent;
                _context.next = 12;
                return response.json();

              case 12:
                body = _context.sent;
                return _context.abrupt("return", {
                  body: body,
                  response: response
                });

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function submitForm(_x) {
        return _submitForm.apply(this, arguments);
      }

      return submitForm;
    }()
  }]);

  return StaticKit;
}();

var index = (function () {
  return new StaticKit();
});

export default index;
