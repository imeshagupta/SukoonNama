import React from "react";
import PoemsList from "../components/PoemsList";
import Hero from "../components/Hero";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>SukoonNama 🌸 | Shayarī & Jazbaat</title>
        <meta name="description" content="SukoonNama - दिल की बात, लफ़्ज़ों के साथ। Read beautiful shayari and poems by Esha Gupta." />
      </Helmet>
      <Hero />
      <PoemsList />
    </div>
  );
};

export default Home;
