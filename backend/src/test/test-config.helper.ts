export interface TestConfig {
    useRealDatabase: boolean;
    useMocks: boolean;
    environment: 'local' | 'ci' | 'test';
  }
  
  export const getTestConfig = (): TestConfig => {
    const nodeEnv = process.env.NODE_ENV;
    const testEnv = process.env.TEST_ENV;
    
    // Determinar si usar BD real o mocks
    const isLocal = nodeEnv === 'local' || 
                    testEnv === 'local' || 
                    process.env.USE_REAL_DB === 'true';
    
    const environment = isLocal ? 'local' : 
                       nodeEnv === 'test' ? 'test' : 'ci';
    
    return {
      useRealDatabase: isLocal,
      useMocks: !isLocal,
      environment
    };
  };
  
  export const logTestConfig = () => {
    const config = getTestConfig();
    console.log(`🧪 Test Configuration:
      Environment: ${config.environment}
      Database: ${config.useRealDatabase ? 'Real PostgreSQL' : 'Mocked'}
      Strategy: ${config.useRealDatabase ? 'Integration Tests' : 'Unit Tests'}
    `);
  }; 