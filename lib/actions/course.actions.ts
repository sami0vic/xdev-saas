'use server';

import {auth} from "@clerk/nextjs/server";
import {createSupabaseClient} from "@/lib/supabase";

export const createCourse = async (formData: CreateCourse) => {
    const {userId: author} = await auth();

    if (!author) {
        throw new Error('User not authenticated');
    }

    const supabase = createSupabaseClient();

    const {data, error} = await supabase
        .from('courses')
        .insert({...formData, author})
        .select();

    if (error) {
        throw new Error(`Failed to create course: ${error.message}`);
    }

    if (!data || data.length === 0) {
        throw new Error('Course created but no data returned');
    }

    return data[0];
}