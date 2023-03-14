/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
import React, { FC, useContext, useEffect, useState } from "react";
import useIsMounted from "../utils/hooks/useIsMounted";
import Image from "next/image";
import { toast } from "react-toastify";
import JoinRoom from "./joinRoom";
import { User } from "../pages/play";
const defaultImage = '/images/default.jpg'
const Player:FC<{you:User, opponent:User}> = ({you, opponent}) => {
   
    // const PlayerData = {
    //     you : {
    //         name:'Ak',
    //         image:'https://i.seadn.io/gae/A75MNKwJ5tw7R6t0-2DMcdDqr0ekHIfbDSrGFUgKNg_uwTuzbkin3jCKjph87jgQYq1wkmXd7gZazIrbrTIZ2DEl3upvLe-Bok0u?w=500&auto=format'
    //     },
    //     opponent : {
    //         name : 'Zack',
    //         image:'https://i.seadn.io/gcs/files/6f60e7f345227b72d4dd120eb61e82f5.png?auto=format'
    //     }
    // }


  return (
    <>
    <div className="relative justify-center flex gap-20 sm:gap-48">
    <div><div className="relative w-24 h-24"><Image className="rounded-full border border-gray-100 shadow-sm" src={you?.image?you?.image:defaultImage} objectFit="fill" layout="fill"/></div><p>{you?.user_name?you?.user_name:'You'}</p></div>
    <div><div className="relative w-24 h-24"><Image className="rounded-full border border-gray-100 shadow-sm" src={opponent?.image?opponent?.image:defaultImage} objectFit="fill" layout="fill"/></div><p>{opponent?.user_name?opponent?.user_name:'Opponent'}</p></div>
    </div>
    </>
  );
}


export default Player




