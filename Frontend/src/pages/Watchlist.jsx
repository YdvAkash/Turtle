import React, { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";

function Watchlist() {
  const { user } = useUser();
  const username = user?.username || "";
  const [bookTitles, setBookTitles] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookTitles = async () => {
      if (!username) {
        return alert("You must be logged in to view your watchlist.");
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/getbooks?username=${encodeURIComponent(username)}`);
        const data = await response.json();

        if (response.ok) {
          setBookTitles(data.books || []);
        } else {
          alert(data.error || "Failed to fetch books.");
        }
      } catch (error) {
        console.error("Error fetching watchlist titles:", error);
        alert("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookTitles();
  }, [username]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const detailedBooks = [];
      for (const title of bookTitles) {
        try {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`);
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            detailedBooks.push({
              title: title,
              authors: data.items[0].volumeInfo.authors || ["Unknown Author"],
              image: data.items[0].volumeInfo.imageLinks?.thumbnail || "/placeholder-image.png",
            });
          } else {
            detailedBooks.push({
              title: title,
              authors: ["Unknown Author"],
              image: "/placeholder-image.png",
            });
          }
        } catch (error) {
          console.error(`Error fetching details for book: ${title}`, error);
          detailedBooks.push({
            title: title,
            authors: ["Unknown Author"],
            image: "/placeholder-image.png",
          });
        }
      }
      setBooks(detailedBooks);
    };

    if (bookTitles.length > 0) {
      fetchBookDetails();
    }
  }, [bookTitles]);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-5">Your Watchlist</h1>
      {isLoading ? (
        <p className="text-center">Loading your watchlist...</p>
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
                  src={book.image} // Display book cover
                  alt={book.title || "Book cover"}
                />
              </div>
              <div className="absolute w-56 left-0 p-5 -bottom-16 duration-500 group-hover:-translate-y-12">
                <div className="absolute -z-10 left-0 w-64 h-full opacity-0 duration-500 group-hover:opacity-50 group-hover:bg-blue-900"></div>
                <span className="text-xl font-bold">{book.title}</span>
                <p className="group-hover:opacity-100 w-56 duration-500 opacity-0">
                  {book.authors.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No books in your watchlist.</p>
      )}
    </div>
  );
}

export default Watchlist;
