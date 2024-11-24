import React from 'react' 
import Form from 'next/form'
import SearchFormReset from './SearchFormReset'
import { Search } from 'lucide-react'

const SearchForm = ({query} : { query?: string}) => {  
  return (
    <Form action='/' scroll={false} className='search-form'> 
      <input 
       type='text'
       name='query'
       defaultValue={query}
       className='search-input'
       placeholder='Search Startups'      
      /> 
      {/*  Notes:
        How Next.js Handles Query Parameters:
        When a page is requested with a query parameter (e.g., /?query=anything), Next.js will automatically parse the URL and pass the query parameters to your page component as props. In your case, searchParams is likely being passed to the Home component with the resolved query parameter.
        Key Points:
        Form Behavior: When the user submits the form, the query data is sent to the server and added to the URL as a query parameter.
        URL Handling: Next.js reads the query parameters from the URL and makes them available in the page component via searchParams.
        React Query Parameters: The page receives the query from the URL, which is then passed as a prop to the SearchForm for default value or manipulation.
        To Summarize:
        The form submission causes a URL change with the query parameter.
        The query parameter is then available in the Next.js component via searchParams, which you use to set the input field's defaultValue in the SearchForm.
        Additional Notes:
        If you want to handle the search more dynamically (without a full form submission), you can use JavaScript to prevent the default form submission and update the URL using next/router or use a state management solution.
        For instance, to update the URL without reloading the page, you can use router.push or router.replace from next/router to modify the URL programmatically.
       */}
      <div className='flex gap-2'> 
         {query &&  <SearchFormReset />} 
         <button type='submit' className='search-btn text-white'>     
           <Search className='size-5'/>
         </button>
      </div>
    
    
    </Form>
  )
}

export default SearchForm