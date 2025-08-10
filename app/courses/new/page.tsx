import CourseForm from "@/components/CourseForm";
import {auth} from "@clerk/nextjs/server"
import {redirect} from "next/navigation";

const NewCourse = async () => {
    const {userId} = await auth();
    if(!userId) redirect('/sign-in');

    return (
        <main className="min-lg:w-1/3 min-md:w-2/3 items-center justify-center">
            <article className="w-full gap-4 flex flex-col ">
                <h1>Course Builder</h1>

                <CourseForm />
            </article>
        </main>
    )
}

export default NewCourse