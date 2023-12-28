"use client";

import Ranking from "@/components/Ranking";
import {
  ChevronDownCircle,
  ChevronUpCircle,
  ChevronsDown,
  ChevronsUp,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";

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
    const isNameExists = names.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    if (!isNameExists) {
      setNames((prev) => [...prev, { name }]);
    }
    setName("");
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newData = [...names];
      const temp = newData[index];
      newData[index] = newData[index - 1];
      newData[index - 1] = temp;
      setNames(newData);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < names.length - 1) {
      const newData = [...names];
      const temp = newData[index];
      newData[index] = newData[index + 1];
      newData[index + 1] = temp;
      setNames(newData);
    }
  };

  const handleMoveToFirst = (index: number) => {
    if (index > 0) {
      const newData = [...names];
      const temp = newData[index];
      newData[index] = newData[0];
      newData[0] = temp;
      setNames(newData);
    }
  };

  const handleMoveToLast = (index: number) => {
    if (index !== names.length - 1) {
      const newData = [...names];
      const temp = newData[index];
      newData[index] = newData[names.length - 1];
      newData[names.length - 1] = temp;
      setNames(newData);
    }
  };

  function handleDeleteTier(val: string) {
    const filteredNames = names.filter((item) => item.name !== val);
    setNames(filteredNames);
  }

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message =
        "All changes will be discarded. Are you sure you want to leave?";
      event.returnValue = message; // Standard for most browsers
      return message; // For some older browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-center mt-5 font-black text-3xl underline underline-offset-4">
        Tier List Maker
      </h1>
      {isTier && <Ranking theIncomingArr={names} />}

      {!isTier && (
        <div
          className="w-[400px] mx-auto mt-10 flex flex-col
     gap-4"
        >
          {names.length > 0 && (
            <p className="underline underline-offset-4 text-center">
              Tier List will be according to the same order as :
            </p>
          )}
          <div className="flex flex-col gap-4">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex gap-4 items-center justify-between p-2 border border-white rounded-lg"
              >
                <h1 className="font-black text-lg">
                  {index + 1}. {name.name}
                </h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDeleteTier(name.name)}
                    className="p-2 border border-red-400 rounded-lg"
                  >
                    <Trash className="w-4 h-4 text-red-400" strokeWidth={3} />
                  </button>
                  <div className="flex flex-col">
                    <button onClick={() => handleMoveToFirst(index)}>
                      <ChevronsUp className="w-4 h-5" />
                    </button>
                    <button onClick={() => handleMoveToLast(index)}>
                      <ChevronsDown className="w-4 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => handleMoveUp(index)}>
                      <ChevronUpCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleMoveDown(index)}>
                      <ChevronDownCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit}>
              <input
                required
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
