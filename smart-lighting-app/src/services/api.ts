import axios from 'axios';

const API_URL = 'http://192.168.0.104:3000'; // Certifique-se de que este é o IP correto do seu computador na rede local

console.log('API_URL:', API_URL); // Para debug

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de timeout
});

export const register = async (username: string, password: string): Promise<void> => {
  try {
    console.log('Iniciando requisição de registro...');
    const response = await api.post('/auth/register', { username, password });
    console.log('Resposta do servidor:', response.data);
    if (response.status !== 201) {
      throw new Error(response.data.error || 'Erro ao fazer cadastro');
    }
  } catch (error) {
    console.error('Erro detalhado durante o registro:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tempo de conexão esgotado. Verifique sua conexão de internet.');
      } else if (error.response) {
        throw new Error(`Erro do servidor: ${error.response.status} - ${error.response.data.error || 'Erro desconhecido'}`);
      } else if (error.request) {
        throw new Error('Não foi possível se conectar ao servidor. Verifique sua conexão de rede e o endereço do servidor.');
      }
    }
    throw new Error('Erro ao fazer cadastro: ' + (error instanceof Error ? error.message : String(error)));
  }
};

export const login = async (username: string, password: string): Promise<string> => {
  try {
    console.log('Iniciando requisição de login...');
    const response = await api.post('/auth/login', { username, password });
    console.log('Resposta do servidor (login):', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Erro detalhado durante o login:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Tempo de conexão esgotado. Verifique sua conexão de internet.');
      } else if (error.response) {
        throw new Error(`Erro do servidor: ${error.response.status} - ${error.response.data.error || 'Erro desconhecido'}`);
      } else if (error.request) {
        throw new Error('Não foi possível se conectar ao servidor. Verifique sua conexão de rede e o endereço do servidor.');
      }
    }
    throw new Error('Erro ao fazer login: ' + (error instanceof Error ? error.message : String(error)));
  }
};

export const getLightStatus = async () => {
  try {
    console.log('Obtendo status da luz...');
    const response = await api.get('/light/status');
    console.log('Resposta do servidor (status da luz):', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter status da luz:', error);
    throw error;
  }
};

export const setLightStatus = async (isOn: boolean) => {
  try {
    console.log('Definindo status da luz:', isOn);
    const response = await api.post('/light/status', { isOn });
    console.log('Resposta do servidor (definir status da luz):', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao definir status da luz:', error);
    throw error;
  }
};

