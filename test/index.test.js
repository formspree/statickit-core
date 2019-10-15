import StaticKit from '../src';

describe('submitForm', () => {
  test('resolves with the parsed body and full response', () => {
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
});
