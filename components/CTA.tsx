import Image from 'next/image'
import Link from 'next/link'

const Cta = () => {
    return (
        <section className="cta-section">
            <div className="cta-badge">Strat Learning your way.</div>
            <h2 className="text-3xl font-bold">
                Shape Your Education, Your Way
            </h2>
            <p>Pick a course, craft your path, and start learning in a style that keeps you hooked.</p>
            <Image src="/images/cta.png" alt="cta" width={362} height={232} />
            <button className="btn-primary">
                <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
                <Link href="/courses/${1}">
                    <p>Learn a new skill</p>
                </Link>
            </button>
        </section>
    )
}

export default Cta