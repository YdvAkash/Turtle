import React, { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { useLocation } from "react-router-dom"; // For URL parameters (optional)

function OtherWatchlist() {
  const { user } = useUser();
  const [username, setUsername] = useState(user?.username || "");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [error, setError] = useState("");

  // Optionally: Read the username from URL query parameter (if you allow URL-based search)
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queriedUsername = queryParams.get("username");
    if (queriedUsername) {
      setUsername(queriedUsername); // Update username to the one from the URL query
    }
  }, [location]);

  const handleSearchChange = (event) => {
    setSearchUsername(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchUsername.trim()) {
      setUsername(searchUsername);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      if (!username) {
        setError("Username is required to view a watchlist.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/watchlist?username=${encodeURIComponent(username)}`);
        const data = await response.json();

        if (response.ok) {
          setBooks(data.watchlist.books || []);
        } else {
          setError(data.error || "Failed to fetch books.");
        }
      } catch (error) {
        console.error("Error fetching watchlist books:", error);
        setError("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [username]);

  const handleAddToWatchlist = (book) => {
    // Handle adding book to watchlist (only when viewing another user's watchlist)
    if (!user) {
      alert("You must be logged in to add books to your watchlist.");
      return;
    }

    fetch("/api/addtowatchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user.username, item: book }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert("Book added to your watchlist!");
        } else {
          alert("Failed to add book.");
        }
      })
      .catch((error) => {
        console.error("Error adding book:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-5">
        {username ? `${username}'s Watchlist` : "Your Watchlist"}
      </h1>

      {/* Search Input for Other User's Watchlist */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={searchUsername}
          onChange={handleSearchChange}
          placeholder="Enter username to search"
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={handleSearchSubmit}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {isLoading ? (
        <p className="text-center">Loading watchlist...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : books.length > 0 ? (
        <div className="book-list flex gap-6 flex-wrap justify-center py-7 border-2 border-green-950 mx-5 my-7">
          {books.map((book, index) => (
            <div
              key={index} // Using index as key since books might not have unique IDs
              className="relative group cursor-pointer overflow-hidden duration-500 w-64 h-80 bg-green-950 text-gray-50 p-5"
            >
              <div className="group-hover:scale-110 w-full h-60 bg-blue-400 duration-500">
                <img
                  className="w-full h-60"
                  src={book.imageURL || "/placeholder-image.png"} // Use the book's imageURL
                  alt={book.title || "Book cover"}
                />
              </div>
              <div className="absolute w-56 left-0 p-5 -bottom-16 duration-500 group-hover:-translate-y-12">
                <div className="absolute -z-10 left-0 w-64 h-full opacity-0 duration-500 group-hover:opacity-50 group-hover:bg-blue-900"></div>
                <span className="text-xl font-bold">{book.title}</span>
                <p className="group-hover:opacity-100 w-56 duration-500 opacity-0">
                  {book.author}
                </p>
                {/* Add to Watchlist button only if the username is not the current user's username */}
                {username !== user?.username && (
                  <button
                    onClick={() => handleAddToWatchlist(book)}
                    className="mt-3 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-700"
                  >
                    Add to Watchlist
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No books in the watchlist.</p>
      )}
    </div>
  );
}

export default OtherWatchlist;
