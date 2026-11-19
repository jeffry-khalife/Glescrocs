import React from "react";
import Navbar from "../components/Navbar";
import MenuSection from "../components/MenuSection";
import Queue from "../components/Queue";

export default function Home() {
  return (
    <>
      <Navbar />
      <MenuSection />
      <Queue />
    </>
  );
}
