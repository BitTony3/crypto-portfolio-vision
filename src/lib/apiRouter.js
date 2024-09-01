import { supabase } from '../integrations/supabase/supabase';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const apiRouter = async (endpoint, method = 'GET', data = null) => {
  if (endpoint.startsWith('/supabase')) {
    // Route to Supabase
    const supabaseEndpoint = endpoint.replace('/supabase/', '');
    const { data: supabaseData, error } = await supabase
      .from(supabaseEndpoint)
      .select('*');
    
    if (error) throw new Error(error.message);
    return supabaseData;
  } else {
    // Route to external API (e.g., CoinGecko)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};