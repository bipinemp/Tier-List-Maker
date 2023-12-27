"use client";

import Ranking from "@/components/Ranking";
import { useState } from "react";

export type NamesType = {
  name: string;
};

export default function Home() {
  const [names, setNames] = useState<NamesType[]>([]);
  const [name, setName] = useState<string>("");
  const [isTier, setIsTier] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNames((prev) => [...prev, { name }]);
    setName("");
  };

  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-center mt-5 font-black text-3xl underline underline-offset-4">
        Tier List Maker
      </h1>
      {isTier && <Ranking theIncomingArr={names} />}

      {!isTier && (
        <div
          className="w-[400px] mx-auto mt-20 flex flex-col
     gap-4"
        >
          {names.length > 0 && (
            <p className="underline underline-offset-4">
              Tier List will according to this order
            </p>
          )}
          <div className="flex flex-col gap-2">
            {names.map((name, index) => (
              <h1 key={index}>
                {index + 1}. {name.name}
              </h1>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                onChange={handleChange}
                value={name}
                placeholder="Enter Names for Tier List"
                className="w-full border border-white outline-none bg-transparent text-white py-3 px-5 rounded-lg"
              />
            </form>
            {names.length > 0 && (
              <button
                onClick={() => setIsTier(true)}
                className="bg-white text-black text-lg font-semibold py-3 px-5 rounded-lg"
              >
                Make Tier List
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
