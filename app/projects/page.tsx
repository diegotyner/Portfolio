import Link from 'next/link';


const Projects = () => {
  return (
    <section className='w-full flex-center flex-col'>
      <h1 className='text-2xl'>
        What am I working on? &#129300;
      </h1>
      <span className='text-slate-400'>
        I have a couple projects that I want to work on: <br/>
        - A transplantable neural network, where you train neural networks seperately then combine them together later.<br/>
        - A song recommender app.<br/>
        - An android app: Minimalist Phone. I'd love to cut back on screen time, and the official app is paid only. Will try to make myself soon. <br/>
      </span>


      <br/>
      <h1 className='text-2xl'>
        What have I done?
      </h1>
      <h2 className='text-l'>Calender Merger App</h2>
      <span className='text-slate-400'>
        A full stack web app with a Node.js/Express.js backend and MongoDB for storing Google OAuth tokens.<br/>
        Fetches events from Google Calendar using the API and merges and displays them on a unified calendar.<br/>
        Plans to remake with Next.js and make a demo public.<br/> 
      </span>
      <h2 className='text-l'>Sentiment Analysis Classifier</h2>
      <h2 className='text-l'>Connect Four Server</h2>
      <h2 className='text-l'>Sentiment Analysis Classifier</h2>
      <h2 className='text-l'>Movie Searching Website</h2>
      <h2 className='text-l'>Research Paper Summarizer</h2>
      <h2 className='text-l'>Web Scraping Application</h2>


    </section>
  )
}

/* 
Calendar Merger Website | Personal Project	May 2024 - July 2024
Developed a user-friendly full-stack web application with a Node.js/Express.js backend and MongoDB for user credentials
Integrated Google Calendar API to merge and display events on a unified calendar
Designed a JavaScript frontend to display events, handle event collisions, allow calendar filtering, and distinguish between user 
events with color-coding and labels
Sentiment Analysis Classifier | AISC Club Group Project	April 2024 - May 2024
Collaborated with a team of 4 to train a TensorFlow transformer model for classifying sentiment of IMDB movie reviews 
Cleaned and preprocessed data with NLTK and Pandas, ensuring high-quality input for the model
Studied and implemented transformer architecture and word vectorization techniques, gaining a deep understanding of LLM models
Presented the project to an audience of 50 peers, highlighting key findings and model performance
Connect Four Server | Personal Project                                              	December 2023
Created a JavaScript server using Node.js, Express.js, and the Socket.IO library to facilitate online Connect Four games
Designed the server to support simultaneous online games with multiple matched players
Created a responsive HTML player interface, dynamically styled based on server input
Movie Searching Website | Personal Project 	October 2023
Created an HTML website styled with CSS and backed by Javascript to display popular movies and allow keyword-based searches
Integrated an API to dynamically generate current popular movies and allow user queries for other movies
Research Paper Summarizer | SacHacks Project	 November 2023
Collaborated with a team of 4 to develop a Flask application for summarizing research papers
Implemented back-end PDF extractor and NLP summarizer to assess sentence importance and extract key information
Designed and styled a front-end webpage to output key points in clear bullet-points
Web Scraping Application | Personal Project	September 2023
Developed a Python web scraping application utilizing Beautiful Soup to parse UC Davis major requirements webpages and extract relevant data 
Compiled information into a CSV and analyzed against other majors' CSV files to identify overlaps
*/
export default Projects