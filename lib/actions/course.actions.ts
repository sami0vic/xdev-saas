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

export const getAllCourses = async ({limit = 10, page = 1, subject, topic}: GetAllCourses) => {
    const supabase = createSupabaseClient();

    let query = supabase.from('courses').select();

    if(subject && topic) {
        query = query.ilike('subject', `%${subject}%`).or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if (subject) {
        query = query.ilike('subject', `%${subject}%`)
    } else if (topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const {data: courses, error} = await query;

    if (error) throw new Error(error.message);

    return courses;
}