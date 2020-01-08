import { createClient } from '../src';

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
            resolve({ ok: true, id: 123 });
          });
        }
      };
      resolve(response);
    });
  };

  const client = createClient({ site: 'xxxx' });

  return client
    .invokeFunction('myFunction', { foo: 'bar' }, { fetchImpl: mockFetch })
    .then(resp => {
      expect(resp.ok).toEqual(true);
      expect(resp.id).toEqual(123);
    })
    .catch(e => {
      throw e;
    });
});

it('camelizes the response', () => {
  const mockFetch = (url, props) => {
    return new Promise((resolve, _reject) => {
      const response = {
        status: 200,
        json: () => {
          return new Promise(resolve => {
            resolve({ ok: true, payment_intent: 'pi_XXX' });
          });
        }
      };
      resolve(response);
    });
  };

  const client = createClient({ site: 'xxxx' });

  return client
    .invokeFunction('myFunction', {}, { fetchImpl: mockFetch })
    .then(resp => {
      expect(resp.paymentIntent).toEqual('pi_XXX');
    })
    .catch(e => {
      throw e;
    });
});
