import StaticKit from '../src';

describe('submitForm', () => {
  it('accepts a form `id` property', () => {
    const mockFetch = (url, props) => {
      expect(url).toEqual('https://api.statickit.com/j/forms/000/submissions');
      expect(props.method).toEqual('POST');
      expect(props.mode).toEqual('cors');

      return new Promise((resolve, _reject) => {
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
    };

    const client = StaticKit();

    return client
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

  it('accepts `site` + `key` properties', () => {
    const mockFetch = (url, props) => {
      expect(url).toEqual(
        'https://api.statickit.com/j/sites/000/forms/newsletter/submissions'
      );
      expect(props.method).toEqual('POST');
      expect(props.mode).toEqual('cors');

      return new Promise((resolve, _reject) => {
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
    };

    const client = StaticKit();

    return client
      .submitForm({
        site: '000',
        key: 'newsletter',
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

  it('errors out if identifying properties are not set', () => {
    const client = StaticKit();

    try {
      client.submitForm({
        fetchImpl: () => {}
      });
    } catch (e) {
      expect(e.message).toBe(
        'You must set an `id` or `site` & `key` properties'
      );
    }
  });
});
