import React from 'react'
import { Button } from "@/components/ui/button"
import CourseCard from "@/components/CourseCard";
import CTA from "@/components/CTA";
import CoursesList from "@/components/CoursesList";
import {recentSessions} from "@/constants";

const Page = () => {
  return (
    <main>
        <h1 className="text-2xl">Popular Courses</h1>
        <section className="home-section ">
            <CourseCard
                id="1"
                name="The Starter Course"
                topic="Your start point to IT"
                subject="General Skills"
                duration={120}
                color="#e89d0c"
            />
            <CourseCard
                id="2"
                name="Linux Level 1"
                topic="Linux Fundamentals"
                subject="Cyber Security"
                duration={45}
                color="#E5D0FF"
            />
            <CourseCard
                id="3"
                name="Cryptography Level 1"
                topic="Cryptography Fundamentals"
                subject="Cryptography"
                duration={200}
                color="#FFECC8"
            />
        </section>

        <section className="home-section">
            <CoursesList
                title="Recently completed modules"
                courses={recentSessions}
                classNames="w-2/3 max-lg:w-full"
            />
            <CTA />
        </section>
    </main>
  )
}

export default Page