const CoursesLibrary = async ({searchParams} : SearchParams) => {
    const filters = await searchParams;

    return (
        <div>Courses Library</div>
    )
}

export default CoursesLibrary