import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### data sets

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| created_at | timestamp with time zone | string | true     |

Note: id is a Primary Key.
*/

export const useDataSets = () => useQuery({
    queryKey: ['dataSets'],
    queryFn: () => fromSupabase(supabase.from('data sets').select('*')),
});

export const useAddDataSet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newDataSet) => fromSupabase(supabase.from('data sets').insert([newDataSet])),
        onSuccess: () => {
            queryClient.invalidateQueries('dataSets');
        },
    });
};

export const useUpdateDataSet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('data sets').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('dataSets');
        },
    });
};

export const useDeleteDataSet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('data sets').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('dataSets');
        },
    });
};