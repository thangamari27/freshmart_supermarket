// Environment configuration
const config = {
  development: {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
    environment: 'development',
    debug: true,
    catalyst: {
      projectId: process.env.REACT_APP_CATALYST_PROJECT_ID || '15199000000025969',
      envId: process.env.REACT_APP_CATALYST_ENV_ID || '60045464861',
      envName: process.env.REACT_APP_CATALYST_ENV_NAME || 'Development'
    }
  },
  production: {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://appsail-50034579098.development.catalystappsail.in/api',
    environment: 'production',
    debug: false,
    catalyst: {
      projectId: process.env.REACT_APP_CATALYST_PROJECT_ID || '15199000000025969',
      envId: process.env.REACT_APP_CATALYST_ENV_ID || '60045464861',
      envName: process.env.REACT_APP_CATALYST_ENV_NAME || 'Development'
    }
  }
};

// Determine current environment
const currentEnv = process.env.REACT_APP_ENVIRONMENT || 'development';

export default config[currentEnv];