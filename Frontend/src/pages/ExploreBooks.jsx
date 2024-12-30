import React, { useState } from "react";

function ExploreBooks() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return alert("Please enter a Search term .");
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.log("error in fetching Books : ", error);
      alert("failed to fetch books . Please try again Later .");
    }
  };

  return (
    <div>
      <section className=" flex items-center justify-center">
        <div class="relative  w-96" id="input">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            class="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-green-950 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary- peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
            id="floating_outlined"
            type="text"
          />
          <label
            class="peer-placeholder-shown:-z-10 peer-focus:z-10 absolute text-[14px] leading-[150%] text-primary peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 origin-[0] bg-white data-[disabled]:bg-gray-50-background- px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            for="floating_outlined"
          >
            Search...
          </label>
        </div>
      </section>
      <div className="flex space-x-4 justify-center  py-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSearch}
        >
          Books
        </button>
       
      </div>
      <main>
        {books.length > 0 ? (
          <div className="book-list flex gap-6 flex-wrap justify-center py-7 border-2 border-green-950 mx-5 my-7">
            {books.map((book) => (
              <div class="relative  group cursor-pointer overflow-hidden duration-500 w-64 h-80 bg-green-950 text-gray-50 p-5">
                <div class="">
                  <div class="group-hover:scale-110 w-full h-60 bg-blue-400 duration-500">
                    <img
                      className="w-full h-60"
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt=""
                    />
                  </div>
                  <div class="absolute w-56 left-0 p-5 -bottom-16 duration-500 group-hover:-translate-y-12">
                    <div class="absolute -z-10 left-0 w-64 h-full opacity-0 duration-500 group-hover:opacity-50 group-hover:bg-blue-900">
                      {" "}
                    </div>
                    <span class="text-xl font-bold">
                      {book.volumeInfo.title}
                    </span>
                    <p class="group-hover:opacity-100 w-56 duration-500 opacity-0">
                      {book.volumeInfo.authors?.join(", ")}
                    </p>

                    <button class="bg-purple-500 text-white px-4 py-2 rounded-full transition duration-200 ease-in-out hover:bg-purple-700 active:bg-purple-900 focus:outline-none">
                      Add 
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Books</p>
        )}
      </main>
    </div>
  );
}

export default ExploreBooks;
