import React from 'react';
import { toast } from 'react-toastify';
import history from '../history';

const controller = new AbortController();
const { signal } = controller;

const ROOT_URL = process.env.REACT_APP_API_ENDPOINT;
export class HttpService {
  private token = '';

  constructor() {
    this.token = '';

    this.postPure = this.postPure.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.delete = this.delete.bind(this);
    this.createFormBody = this.createFormBody.bind(this);
  }
  /*****
   * POST pure
   * @param httpUrl
   * @param data
   * @param successCb
   * @param errorCb
   */
  postPure(httpUrl, data, successCb, errorCb) {
    let formBody = this.createFormBody(data);
    let status = null;
    return fetch(ROOT_URL + httpUrl, {
      signal,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    })
      .then((response) => {
        status = response.status;
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        if (status >= 200 && status < 300) {
          return response;
        }
        throw response;
      })
      .then((response) => {
        if (successCb) {
          return successCb(response);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch((error) => {
        if (errorCb) {
          return errorCb(error);
        } else {
          return Promise.reject(error);
        }
      });
  }

   /*****
   * GET request with
   * AUTHORIZATION headers ( bearer )
   * @param httpUrl
   * @param data
   * @param successCb
   * @param errorCb
   * @param options
   */
    getReport(httpUrl, data, successCb, errorCb, options = null) {
      let formBody = this.createFormBody(data);
      let status = null;
      // const token = (options && options.token) ? options.token : this.token;
      return fetch(ROOT_URL + httpUrl + '?' + formBody, {
        signal,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded', 
          Authorization: 'Bearer ' + this.token,
        },
      })
        .then((response) => {
          status = response.status;
          return response;
        })
        .then((response) => {
          if (status >= 200 && status < 300) {
            return response;
          } else if (status === 401) {
            this.isUnAuthorized();
          }
          throw response;
        })
        .then( res => res.blob() )
        .then( blob => {
            var file = window.URL.createObjectURL(blob);
            window.location.assign(file);
        })
        .then((response) => {
          if (successCb) {
            return successCb(response);
          } else {
            return Promise.resolve(response);
          }
        })
        .catch((error) => {
          if (errorCb) {
            return errorCb(error);
          } else {
            return Promise.reject(error);
          }
        });
    }
  /*****
   * GET request with
   * AUTHORIZATION headers ( bearer )
   * @param httpUrl
   * @param data
   * @param successCb
   * @param errorCb
   * @param options
   */
  get(httpUrl, data, successCb, errorCb, options = null) {
    let formBody = this.createFormBody(data);
    let status = null;
    // const token = (options && options.token) ? options.token : this.token;
    return fetch(ROOT_URL + httpUrl + '?' + formBody, {
      signal,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + this.token,
      },
    })
      .then((response) => {
        status = response.status;
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        if (status >= 200 && status < 300) {
          return response;
        } else if (status === 401) {
          this.isUnAuthorized();
        }
        throw response;
      })
      .then((response) => {
        if (successCb) {
          return successCb(response);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch((error) => {
        if (errorCb) {
          return errorCb(error);
        } else {
          return Promise.reject(error);
        }
      });
  }

  /*****
   * POST request with
   * AUTHORIZATION headers ( bearer )
   * @param httpUrl
   * @param data
   * @param successCb
   * @param errorCb
   */
  post(httpUrl, data, successCb, errorCb) {
    let formBody = this.createFormBody(data);
    let status = null;
    return fetch(ROOT_URL + httpUrl, {
      signal,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + this.token,
      },
      body: formBody,
    })
      .then((response) => {
        status = response.status;
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        if (status >= 200 && status < 300) {
          return response;
        } else if (status === 401) {
          this.isUnAuthorized();
        }
        throw response;
      })
      .then((response) => {
        if (successCb) {
          return successCb(response);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch((error) => {
        if (errorCb) {
          return errorCb(error);
        } else {
          return Promise.reject(error);
        }
      });
  }

  /*****
   * POST request with
   * AUTHORIZATION headers ( bearer )
   * @param httpUrl
   * @param data
   * @param successCb
   * @param errorCb
   */
  postJSON(httpUrl, data, successCb, errorCb) {
    console.log(data);
    let status = null;
    return fetch(ROOT_URL + httpUrl, {
      signal,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        status = response.status;
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        if (status >= 200 && status < 300) {
          return response;
        }
        throw response;
      })
      .then((response) => {
        if (successCb) {
          return successCb(response);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch((error) => {
        if (errorCb) {
          return errorCb(error);
        } else {
          return Promise.reject(error);
        }
      });
  }
  /*****
   * POST request with
   * AUTHORIZATION headers ( bearer )
   * @param httpUrl
   * @param data
   * @param successCb
   * @param errorCb
   */
  postImages(httpUrl, data, successCb, errorCb) {
    let status = null;
    console.log(data);
    return (
      fetch(ROOT_URL + httpUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
        body: data,
      })
        .then((response) => {
          status = response.status;
          return response;
        })
        //.then((response) => response.json())
        .then((response) => {
          if (status >= 200 && status < 300) {
            return response;
          }
          throw response;
        })
        .then((response) => {
          if (successCb) {
            return successCb(response);
          } else {
            return Promise.resolve(response);
          }
        })
        .catch((error) => {
          if (errorCb) {
            return errorCb(error);
          } else {
            return Promise.reject(error);
          }
        })
    );
  }

  /*****
   * PUT request with
   * AUTHORIZATION headers ( bearer )
   * @param httpUrl
   * @param data
   * @param successCb
   * @param errorCb
   */
  put(httpUrl, data, successCb, errorCb) {
    let formBody = this.createFormBody(data);
    let status = null;
    return fetch(ROOT_URL + httpUrl, {
      signal,
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + this.token,
      },
      body: formBody,
    })
      .then((response) => {
        status = response.status;
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        if (status >= 200 && status < 300) {
          return response;
        }
        throw response;
      })
      .then((response) => {
        if (successCb) {
          return successCb(response);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch((error) => {
        if (errorCb) {
          return errorCb(error);
        } else {
          return Promise.reject(error);
        }
      });
  }

  /*****
   * PUT request with
   * AUTHORIZATION headers ( bearer )
   * @param httpUrl
   * @param data
   * @param successCb
   * @param errorCb
   */
  putPure(httpUrl, data, successCb, errorCb) {
    //let formBody = this.createFormBody(data);
    //console.log(JSON.stringify(data));
    let status = null;
    return fetch(ROOT_URL + httpUrl, {
      signal,
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        status = response.status;
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        if (status >= 200 && status < 300) {
          return response;
        }
        throw response;
      })
      .then((response) => {
        if (successCb) {
          return successCb(response);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch((error) => {
        if (errorCb) {
          return errorCb(error);
        } else {
          return Promise.reject(error);
        }
      });
  }

  delete(httpUrl, data, successCb, errorCb) {
    let formBody = this.createFormBody(data);
    let status = null;
    return fetch(ROOT_URL + httpUrl, {
      signal,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + this.token,
      },
      body: formBody,
    })
      .then((response) => {
        status = response.status;
        return response;
      })
      .then((response) => response.json())
      .then((response) => {
        if (status >= 200 && status < 300) {
          return response;
        }
        throw response;
      })
      .then((response) => {
        if (successCb) {
          return successCb(response);
        } else {
          return Promise.resolve(response);
        }
      })
      .catch((error) => {
        if (errorCb) {
          return errorCb(error);
        } else {
          return Promise.reject(error);
        }
      });
  }

  isObject = (data) =>
    data && typeof data === 'object' && data.constructor === Object;

  ObjectToFormData = (data = {}, parentKey = '') => {
    if (!this.isObject(data)) return [];

    const arrayValues = Object.entries(data).reduce((acc, [key, value]) => {
      if (this.isObject(value)) {
        const child = this.ObjectToFormData(value, key);
        acc = [...acc, ...child];
      } else {
        const accKey = parentKey ? `${parentKey}[${key}]` : key;
        acc = [...acc, [accKey, value]];
      }
      return acc;
    }, []);

    return arrayValues;
  };
  appendRecursive = (formData, data, wrapper) => {
    for (var x in data) {
      if (typeof data[x] == 'object' || data[x].constructor === Array) {
        this.appendRecursive(formData, data[x], wrapper + '[' + x + ']');
      } else {
        formData.append(wrapper + '[' + x + ']', data[x]);
      }
    }
  };

  toFormData = (data) => {
    const formData = new FormData();
    if (!this.isObject(data)) {
      return formData;
    }

    const formattedArray = this.ObjectToFormData(data);

    formattedArray.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        this.appendRecursive(formData, value, key);
        return;
      }
      formData.append(key, value);
    });

    return formData;
  };

  createFormBody(data): any {
    let formBody = [];
    for (let property in data) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    // formBody.push('_dc='+new Date().getMilliseconds()+Math.random());
    return formBody.join('&');
  }

  setToken(token) {
    this.token = token;
  }

  isUnAuthorized() {
    toast.error(<span>401 Unauthorized</span>);
    this.setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('Logged');
    localStorage.removeItem('Token');
    localStorage.removeItem('CurrentUser');
    history.replace('/login');
  }

  /*uploadFile(data, successCb, errorCb) {
        const url = ROOT_URL+'/upload-files?location=' + data.location + '&entity_id='+ImageData.entity_id+ '&thumbnail='+data.thumbnail; //'&car_id='+data.car_id + '&reservation_id='+data.reservation_id;
        return request
        .post(url)
        .field('file', data.file)
        .set('Authorization', 'Bearer ' + this.token)
        .then((response) => {
            if (successCb) {
                return successCb(response);
            } else {
                return Promise.resolve(response);
            }
        })
        .catch((error) => {
            if (errorCb) {
                return errorCb(error);
            } else {
                return Promise.reject(error);
            }
        });
    }*/
}

const defaultHttpService = new HttpService();
export default defaultHttpService;
