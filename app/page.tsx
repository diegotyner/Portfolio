import React from 'react'

const Home = () => {
  return (
    <section className='w-full flex-center flex-col'>
      <h1 className='head_text text-center'>
        Discover & Share
        <br className='max-md:hidden' />
        <span className='orange_gradient text-center'> AI-Powered Prompts</span>
      </h1>
      
      <p className='desc text-center'>
        Promptopia is an open-source AI prompting tool for modern world to
        discover, create and share creative prompts
      </p>

      <br /><br />
      
      <div className='wrapper flex justify-center'>
        <div className='outer_box group'>
          <div className='spinner group-hover:opacity-100'></div>
          <div className='inner_box'></div>
        </div>
      </div>
      <div className='wrapper flex justify-center'>
        <div className='outer_box group'>
          <div className='slider group-hover:w-full'></div>
          <div className='inner_box'></div>
        </div>
      </div>
      <div className='wrapper flex justify-center'>
        <div className='scissors'><span>Hover Me</span></div>
      </div>

      {/* Feed */}
    </section>
  )
}

export default Home