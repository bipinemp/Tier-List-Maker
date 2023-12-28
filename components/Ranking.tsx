"use client";

import { NamesType } from "@/app/page";
import Image from "next/image";
import React, { FC, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface RankingProps {
  theIncomingArr: NamesType[];
}

type ImageFiles = {
  file: File;
  id: string;
  url: string;
};

type DynamicImageFiles = {
  file?: File;
  id?: string;
  url?: string;
  index?: number;
  name?: string;
};

const Ranking: FC<RankingProps> = ({ theIncomingArr }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgFiles, setImgFiles] = useState<ImageFiles[] | null>([]);

  const initialDynamicBoxes = theIncomingArr.map((item) => [
    { name: item.name },
  ]);

  // Dynamic boxes
  const [dynamicBoxes, setDynamicBoxes] =
    useState<Array<DynamicImageFiles[]>>(initialDynamicBoxes);

  const handleImgFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFileList = e.target.files;
    if (imgFileList) {
      const imgFilesArray = Array.from(imgFileList).map((file) => ({
        file: file,
        id: uuidv4(),
        url: URL.createObjectURL(file),
      }));
      setImgFiles(imgFilesArray);
    } else {
      setImgFiles(null);
    }
  };

  function handleOnDrag(e: React.DragEvent, fileId: string) {
    e.dataTransfer.setData("fileId", fileId);
  }

  function handleOnDropDynamicBox(e: React.DragEvent, boxIndex: number) {
    e.preventDefault();

    const fileId = e.dataTransfer.getData("fileId") as string;
    const reqImage = imgFiles?.find((file) => file.id === fileId);

    // Ensure reqImage exists before proceeding
    if (!reqImage) return;

    // original box index
    const originalBoxIndex = dynamicBoxes.findIndex((box) =>
      box.some((file) => file.id === fileId)
    );

    if (originalBoxIndex !== boxIndex) {
      setDynamicBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes];

        // Check for undefined box before filtering
        if (newBoxes[originalBoxIndex]) {
          newBoxes[originalBoxIndex] = newBoxes[originalBoxIndex].filter(
            (file) => file.id !== fileId
          );
        }

        return newBoxes;
      });

      setDynamicBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes];
        newBoxes[boxIndex] = [
          ...newBoxes[boxIndex],
          { ...reqImage, index: boxIndex },
        ];
        return newBoxes;
      });
    }
  }

  function handleDragOverDynamicBoxes(e: React.DragEvent) {
    e.preventDefault();
  }

  return (
    <div className="relative flex flex-col gap-10 w-[700px] mx-auto mt-10 mb-20 overflow-x-hidden">
      {/* list of Boxes */}
      <div className="border-[1px] border-white w-full h-auto rounded-xl">
        {dynamicBoxes.map((box, index) => (
          <div
            key={index}
            onDrop={(e) => handleOnDropDynamicBox(e, index)}
            onDragOver={handleDragOverDynamicBoxes}
            className={`relative min-h-[100px] flex gap-4 items-center ${
              dynamicBoxes.length === index + 1 ? "" : "border-b border-b-white"
            }`}
          >
            <div
              className={`w-[100px] flex items-center justify-center px-5 ${
                index === 0 ? "rounded-tl-xl" : ""
              } ${index + 1 === dynamicBoxes.length ? "rounded-bl-xl" : ""} `}
            >
              {box?.map((file) => (
                <h1
                  key={file.id}
                  className={`font-black text-lg tracking-wide`}
                >
                  {file.name}
                </h1>
              ))}
            </div>

            <div className="w-[580px] min-h-[100px] h-auto flex flex-row flex-wrap gap-3 py-2 border-l border-l-white pl-4">
              {box?.map((fileobject) => (
                <>
                  {fileobject.url && fileobject.id && (
                    <div
                      className="relative shrink-0 w-[80px] h-[80px]"
                      key={fileobject.id}
                    >
                      <Image
                        draggable
                        onDragStart={(e) => handleOnDrag(e, fileobject.id!)}
                        src={fileobject.url || ""}
                        fill
                        alt=""
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Image Draggable Container */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-4 relative flex items-center justify-between border-[1px] border-white w-full min-h-[100px] h-auto rounded-xl cursor-pointer"
      >
        <div className="w-full h-full flex flex-col justify-center">
          <input
            type="file"
            name="image"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleImgFilesChange}
          />
          {imgFiles?.length === 0 && (
            <p className="font-bold text-xl self-center">
              Click to Select Images
            </p>
          )}
          <div className="flex gap-4 flex-wrap items-center justify-center">
            {imgFiles?.map((fileobject) => (
              <div
                className="relative w-[100px] aspect-square"
                key={fileobject.id}
              >
                <Image
                  src={fileobject.url}
                  fill
                  alt=""
                  draggable
                  onDragStart={(e) => handleOnDrag(e, fileobject.id)}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
