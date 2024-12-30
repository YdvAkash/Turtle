import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import ExploreBooks from "./ExploreBooks";

function Home() {
  return (
    <div className="">
      <div className="flex py-10 items-center justify-center">
        <h1 className="text-6xl">Welcome to Turtle ! </h1>
      </div>
      <ExploreBooks />
    </div>
  );
}

export default Home;
