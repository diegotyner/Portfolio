
import React from 'react'
import Image from 'next/image'

const Home = () => {
  return (
    <section className='w-full'>
      <div className='hero_section flex flex-col items-center sm:flex-row sm:justify-around'>
        <Image src='assets/icons/brain.svg' alt='pickaxe icon' width={250} height={250}></Image>
        <div className='hero_text flex flex-col pl-10 w-2/3'> {/*sm:min-w-2/5 w-2/3*/}
          <h1 className='text-2xl'>Hi There! </h1>
          <span>I'm Diego Tyner, a third year college student.</span>
          <span>I love putting together websites, being able to share things on the internet is awesome!</span>
          <span>Check back in to this website later, plans are in the works to pretty it up.</span>
        </div>
      </div>


      <br /><br />
      


      {/* Feed */}
      <div className='page flex items-center'>
        <Image src='assets/icons/pickaxe.svg' alt='pickaxe icon' width={100} height={100}></Image>
        <span>Working On</span>
      </div>
      <div>Frontend Development, Machine Learning, Computational Neuroscience</div>
    </section>
  )
}

export default Home