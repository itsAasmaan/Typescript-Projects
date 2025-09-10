import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import weatherService from '../services/weatherService';

console.log('Environment Debug:');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Env file path:', path.resolve(__dirname, '../.env'));
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('WEATHER_API_KEY present:', !!process.env.WEATHER_API_KEY);
console.log('WEATHER_API_KEY length:', process.env.WEATHER_API_KEY?.length || 0);

async function testWeatherService() {
  console.log('Testing Weather Service...\n');

  try {
    // Test 1: Current weather by city
    console.log('Test 1: Current weather for Delhi');
    const delhiWeather = await weatherService.getCurrentWeather({ 
      city: 'Delhi' 
    });
    console.log('Success:', JSON.stringify(delhiWeather, null, 2));
    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Current weather by coordinates
    console.log('Test 2: Current weather by coordinates (New York: 40.7128, -74.0060)');
    const nyWeather = await weatherService.getCurrentWeather({ 
      lat: 40.7128, 
      lon: -74.0060 
    });
    console.log('Success:', JSON.stringify(nyWeather, null, 2));
    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Weather forecast
    console.log('Test 3: 3-day forecast for Tokyo');
    const tokyoForecast = await weatherService.getWeatherForecast({ 
      city: 'Tokyo',
      days: 3 
    });
    console.log('Success:', JSON.stringify(tokyoForecast, null, 2));
    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Different units
    console.log('📍 Test 4: Weather in Fahrenheit for Miami');
    const miamiWeather = await weatherService.getCurrentWeather({ 
      city: 'Miami',
      units: 'imperial' 
    });
    console.log('Success:', JSON.stringify(miamiWeather, null, 2));

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Test error handling
async function testErrorCases() {
  console.log('\nTesting Error Cases...\n');

  try {
    // Test invalid city
    console.log('Test: Invalid city name');
    await weatherService.getCurrentWeather({ city: 'InvalidCityName12345' });
  } catch (error) {
    console.log('Expected error caught:', (error as Error).message);
  }

  try {
    // Test missing parameters
    console.log('Test: Missing parameters');
    await weatherService.getCurrentWeather({});
  } catch (error) {
    console.log('Expected error caught:', (error as Error).message);
  }
}

// // Run tests
async function runAllTests() {
  await testWeatherService();
  await testErrorCases();
  
  console.log('\nAll tests completed!');
  process.exit(0);
}

if (process.env.WEATHER_API_KEY) {
    runAllTests();
}