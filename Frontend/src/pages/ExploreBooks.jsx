import React, { useState } from "react";
import { useUser } from "../components/UserContext";

function ExploreBooks() {
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const username = user?.username || ""; // Ensure username is safely retrieved

  const handleSubmit = async (book) => {
    if (!username) {
      return alert("You must be logged in to add books.");
    }

    // Extract the title from the book object
    const bookTitle = book.volumeInfo.title;
     console.log(bookTitle)
    try {
      const response = await fetch("/api/addbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, books :bookTitle }), // Send only the title
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Book added successfully!");
      } else {
        alert(data.error || "Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      return alert("Please enter a search term.");
    }

    setIsLoading(true); // Start loader
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <div>
      <section className="flex items-center justify-center">
        <div className="relative w-96" id="input">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-green-950"
            type="text"
          />
        </div>
      </section>
      <div className="flex space-x-4 justify-center py-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSearch}
        >
          {isLoading ? "Searching..." : "Search Books"}
        </button>
      </div>
      <main>
        {books.length > 0 ? (
          <div className="book-list flex gap-6 flex-wrap justify-center py-7 border-2 border-green-950 mx-5 my-7">
            {books.map((book) => (
              <div
                key={book.id} // Add unique key prop
                className="relative group cursor-pointer overflow-hidden duration-500 w-64 h-80 bg-green-950 text-gray-50 p-5"
              >
                <div className="group-hover:scale-110 w-full h-60 bg-blue-400 duration-500">
                  <img
                    className="w-full h-60"
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "/placeholder-image.png" // Placeholder image
                    }
                    alt={book.volumeInfo.title || "Book cover"}
                  />
                </div>
                <div className="absolute w-56 left-0 p-5 -bottom-16 duration-500 group-hover:-translate-y-12">
                  <div className="absolute -z-10 left-0 w-64 h-full opacity-0 duration-500 group-hover:opacity-50 group-hover:bg-blue-900"></div>
                  <span className="text-xl font-bold">
                    {book.volumeInfo.title}
                  </span>
                  <p className="group-hover:opacity-100 w-56 duration-500 opacity-0">
                    {book.volumeInfo.authors?.join(", ")}
                  </p>

                  <button
                    onClick={() => handleSubmit(book)} // Submit specific book
                    disabled={!username} // Disable if no user
                    className={`${
                      username
                        ? "bg-purple-500 hover:bg-purple-700 active:bg-purple-900"
                        : "bg-gray-400 cursor-not-allowed"
                    } text-white px-4 py-2 rounded-full transition duration-200 ease-in-out focus:outline-none`}
                  >
                    {username ? "Add" : "Login Required"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">{isLoading ? "Loading..." : "No books found. Please search for a book."}</p>
        )}
      </main>
    </div>
  );
}

export default ExploreBooks;
