import {
  AuthError,
  BadRequestError,
  ConnectionError,
  ForbidenError,
  MethodNotAllowed,
  NotFoundError,
  ServerError,
} from "../utility/errorTypes.utility";

const ABORT_REQUEST = 6000; // Time in miliseconds

interface HttpOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS";
  headers?: HeadersInit;
  body?: any;
  signal?: AbortSignal;
}

interface HttpResponse {
  data: any;
  error:
    | typeof ConnectionError
    | typeof BadRequestError
    | typeof AuthError
    | typeof ForbidenError
    | typeof NotFoundError
    | typeof MethodNotAllowed
    | typeof ServerError
    | null;
  options: any;
  flags: string[];
}

class HttpHandler {
  constructor() {}

  static async customFetch(
    endpoint: string,
    options?: HttpOptions
  ): Promise<HttpResponse> {
    const controller = new AbortController();
    const defaultHeader = {
      accept: "application/json; charset=utf-8",
      // Token here
    };

    options = options || ({} as HttpOptions);

    options.method = options.method || "GET";

    options.headers = options.headers
      ? { ...defaultHeader, ...options.headers }
      : defaultHeader;

    options.body = JSON.stringify(options.body) || false;
    if (!options.body) delete options.body;

    options.signal = controller.signal;

    try {
      setTimeout(
        () =>
          controller.abort(new ConnectionError("Error Connection", options)),
        ABORT_REQUEST
      );

      const response = await fetch(endpoint, options);

      const resJson = await response.json();

      if (!response) throw new ConnectionError("Fallo de red", response);

      if (response.status === 400)
        throw new BadRequestError(resJson.message, resJson);

      if (response.status === 401)
        throw new AuthError("No autorizado", response);

      if (response.status === 403)
        throw new ForbidenError("No permitido", response);

      if (response.status === 404)
        throw new NotFoundError("No encontrado", response);

      if (response.status === 405)
        throw new MethodNotAllowed("Metodo no admitido", response);

      if (response.status >= 500)
        throw new ServerError("Error de servidor", response);

      return {
        data: resJson,
        error: null,
        options: {},
        flags: [],
      };
    } catch (error: any) {
      let newError = error;
      if (error instanceof TypeError)
        newError = new ConnectionError("Fallo de red", options);

      return {
        data: null,
        error: newError,
        options: {},
        flags: [],
      };
    }
  }

  static get(endpoint: string, options?: HttpOptions) {
    return this.customFetch(endpoint, options);
  }

  static post(endpoint: string, options: HttpOptions) {
    options.method = "POST";
    return this.customFetch(endpoint, options);
  }

  static put(endpoint: string, options: HttpOptions) {
    options.method = "PUT";
    return this.customFetch(endpoint, options);
  }

  static del(endpoint: string, options: HttpOptions) {
    options.method = "DELETE";
    return this.customFetch(endpoint, options);
  }
}

export default HttpHandler;
