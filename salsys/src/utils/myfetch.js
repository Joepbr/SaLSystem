class HttpError extends Error {
    constructor(status, message) {
      super(message)
      this.name = 'HttpError'
      this.status = Number(status)
    }
  }
  
  const myfetch = {}  // Objeto vazio
  
  // Lê o endereço do back-end a partir do arquivo .env.local
  const baseUrl = import.meta.env.VITE_API_BASE
  
  function defaultOptions(body = null, method = 'GET') {
    const options = {
      method,
      headers: {},
      credentials: 'include'
    }

    if (body instanceof FormData) {
      options.body = body
    } else {
      options.headers["Content-type"] = "application/json; charset=UTF-8"
    
      if(body) options.body = JSON.stringify(body)
  
      // Verifica se existe um token gravado no localStorage e o inclui
      // nos headers, nesse caso
      const token = window.localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_NAME)
  
      if(token) options.headers.Authentication = `Bearer ${token}`
    }
    
    return options
  }
  
  function getErrorDescription(response) {
    switch(response.status) {
      case 401:   // Unauthorized
        return 'ERRO: usuário ou senha incorretos'

      case 403:
        return 'ERRO: acesso não autorizado'

      case 500:
        return 'ERRO: problema no servidor remoto'
  
      default:
        return `ERRO: HTTP ${response.status}: ${response.statusText}`
  
    }
  }
  
  myfetch.post = async function(path, body) {
    const response = await fetch(baseUrl + path, defaultOptions(body, 'POST'))
    if(response.ok) return response.json()
    else throw new HttpError(response.status, getErrorDescription(response))
  }
  
  myfetch.put = async function(path, body) {
    const response = await fetch(baseUrl + path, defaultOptions(body, 'PUT'))
    if(response.ok) return true
    else throw new HttpError(response.status, getErrorDescription(response))
  }
  
  myfetch.get = async function(path, responseType = 'json') {
    const options = defaultOptions()
    options.method = 'GET'
    options.responseType = responseType

    const response = await fetch(baseUrl + path, options)

    if(response.ok) {
      if (responseType === 'json') {
        return response.json()
      } else if (responseType === 'blob') {
        return response.blob()
      } else {
        throw new Error(`Unsupported responseType: ${responseType}`)
      }
    } else {
      throw new HttpError(response.status, getErrorDescription(response))
    }
  }
  
  myfetch.delete = async function(path) {
    const response = await fetch(baseUrl + path, defaultOptions(null, 'DELETE'))
    if(response.ok) return true   // Não retorna json()
    else throw new HttpError(response.status, getErrorDescription(response))
  }
  
  export default myfetch