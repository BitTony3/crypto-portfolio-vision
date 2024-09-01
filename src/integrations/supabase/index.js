// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import {
  useDataSets,
  useAddDataSet,
  useUpdateDataSet,
  useDeleteDataSet,
} from './hooks/data_sets.js';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  useDataSets,
  useAddDataSet,
  useUpdateDataSet,
  useDeleteDataSet,
};