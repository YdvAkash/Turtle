import React, { useState, useEffect } from 'react';

function About() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const username = 'YdvAkash'; // Replace with your GitHub username

  useEffect(() => {
    // Fetch GitHub API data
    const fetchGitHubData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Failed to fetch GitHub data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchGitHubData();
  }, [username]);

  if (error) {
    return <div className="px-10 py-6 text-center text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div className="px-10 py-6 text-center">Loading...</div>;
  }

  return (
    <div className="px-10 py-6">
      <div className="group relative w-80 h-72 bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
        {/* Hover Background */}
        <div className="absolute top-0 w-80 h-24 rounded-t-2xl bg-gradient-to-bl from-sky-200 via-orange-200 to-orange-700 transition-all duration-500 group-hover:h-72 group-hover:w-80 group-hover:rounded-b-2xl"></div>

        {/* Profile Image */}
        <div className="w-28 h-28 mt-8 bg-blue-700 rounded-full border-4 border-slate-50 z-10 transition-all duration-500 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20">
          <img
            className="w-full h-full object-cover rounded-full"
            src={userData.avatar_url}
            alt={userData.login}
          />
        </div>

        {/* User Info */}
        <div className="z-10 transition-all duration-500 group-hover:-translate-y-10">
          <span className="text-2xl font-semibold">{userData.name || "Unknown"}</span>
          <p className="text-sm text-gray-600">
            {userData.bio || "No bio available"}
          </p>
        </div>

        {/* Follow Button */}
        <a
          className="bg-blue-700 px-4 py-1 text-slate-50 rounded-md z-10 hover:scale-125 transition-all duration-500 hover:bg-blue-500"
          href={userData.html_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow
        </a>
      </div>
    </div>
  );
}

export default About;
