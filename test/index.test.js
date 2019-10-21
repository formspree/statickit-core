import StaticKit from '../src';
import packageJson from '../package.json';

const version = packageJson.version;

// A fake success result for a mocked `fetch` call.
//
// Example:
//
//   const mockFetch = (_url, props) => {
//     return success;
//   };
//
const success = new Promise((resolve, _reject) => {
  const response = {
    status: 200,
    json: () => {
      return new Promise(resolve => {
        resolve({ id: 'xxx' });
      });
    }
  };
  resolve(response);
});

describe('submitForm', () => {
  it('resolves with body and response when successful', () => {
    const mockFetch = (_url, props) => {
      expect(props.method).toEqual('POST');
      expect(props.mode).toEqual('cors');
      return success;
    };

    return StaticKit()
      .submitForm({
        id: '000',
        fetchImpl: mockFetch
      })
      .then(({ body, response }) => {
        expect(body.id).toEqual('xxx');
        expect(response.status).toEqual(200);
      })
      .catch(e => {
        throw e;
      });
  });

  it('accepts a form `id` property', () => {
    const mockFetch = (url, _props) => {
      expect(url).toEqual('https://api.statickit.com/j/forms/000/submissions');
      return success;
    };

    return StaticKit().submitForm({
      id: '000',
      fetchImpl: mockFetch
    });
  });

  it('accepts `site` + `form` properties', () => {
    const mockFetch = (url, props) => {
      expect(url).toEqual(
        'https://api.statickit.com/j/sites/000/forms/newsletter/submissions'
      );
      return success;
    };

    return StaticKit().submitForm({
      site: '000',
      form: 'newsletter',
      fetchImpl: mockFetch
    });
  });

  it('errors out if identifying properties are not set', () => {
    expect(() => {
      StaticKit().submitForm({});
    }).toThrow('You must set an `id` or `site` & `form` properties');
  });

  it('throws an error if clientName is not given', () => {
    const mockFetch = (_url, props) => {
      expect(props.headers['StaticKit-Client']).toEqual(
        `@statickit/core@${version}`
      );

      return success;
    };

    return StaticKit().submitForm({
      id: '000',
      fetchImpl: mockFetch
    });
  });

  it('puts given client name in the client header', () => {
    const mockFetch = (_url, props) => {
      expect(props.headers['StaticKit-Client']).toEqual(
        `my-client @statickit/core@${version}`
      );

      return success;
    };

    return StaticKit().submitForm({
      id: '000',
      clientName: 'my-client',
      fetchImpl: mockFetch
    });
  });

  it('sets content type to json if data is not FormData', () => {
    const mockFetch = (_url, props) => {
      expect(props.headers['Content-Type']).toEqual('application/json');

      const parsedBody = JSON.parse(props.body);
      expect(parsedBody.foo).toEqual('bar');
      return success;
    };

    return StaticKit().submitForm({
      id: '000',
      fetchImpl: mockFetch,
      data: { foo: 'bar' }
    });
  });
});
