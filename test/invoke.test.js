import { createClient } from '../src';

describe('invoke', () => {
  it('resolves with body and response when successful', () => {
    const mockFetch = (url, props) => {
      expect(props.method).toEqual('POST');
      expect(props.mode).toEqual('cors');
      expect(props.body).toEqual(JSON.stringify({ args: { foo: 'bar' } }));
      expect(url).toEqual(
        'https://api.statickit.com/j/sites/xxxx/functions/myFunction/invoke'
      );

      return new Promise((resolve, _reject) => {
        const response = {
          status: 200,
          json: () => {
            return new Promise(resolve => {
              resolve({ ok: true, body: {} });
            });
          }
        };
        resolve(response);
      });
    };

    const client = createClient({ site: 'xxxx' });

    return client
      .invoke('myFunction', { foo: 'bar' }, { fetchImpl: mockFetch })
      .then(resp => {
        expect(resp.ok).toEqual(true);
      })
      .catch(e => {
        throw e;
      });
  });

  it('errors out if identifying properties are not set', () => {
    expect(() => {
      createClient().invoke('myFunction', {}, {});
    }).toThrow('`site` is required');
  });
});
