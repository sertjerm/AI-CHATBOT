import axios from 'axios';

const API_URL = 'https://apps4.coop.ku.ac.th/chatbotai/itkuscc_chat_proxy.php';

const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    return Promise.reject(error);
  }
);

export const chatAPI = {
  sendMessage: async (message) => {
    try {
      const data = JSON.stringify({
        input: message,
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: API_URL,
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
      };

      const response = await apiClient.request(config);
      
      // Extract AI response from the API response format
      if (response.data && response.data.choices && response.data.choices[0]) {
        return {
          content: response.data.choices[0].message.content,
          usage: response.data.usage,
          id: response.data.id,
          model: response.data.model
        };
      } else {
        throw new Error('Invalid response format from API');
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message || 
                            'Network error occurred';
        throw new Error(errorMessage);
      }
      throw new Error('An unexpected error occurred');
    }
  },
};
