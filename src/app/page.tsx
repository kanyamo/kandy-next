import React from "react";
import GameBoard from "@/components/GameBoard";

const Home: React.FC = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GameBoard />
    </main>
  );
}

export default Home;
