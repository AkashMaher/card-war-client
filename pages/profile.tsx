/* eslint-disable jsx-a11y/alt-text */
import { motion } from "framer-motion";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useSwitchNetwork, useNetwork } from "wagmi";
import { opacityAnimation } from "../utils/animations";
import Head from "next/head";
import { QUERIES } from "../react-query/constants";
import { getUser, createUser, getUserNfts } from "../react-query/queries";
import { useMutation, useQuery } from "react-query";
import useIsMounted from "../utils/hooks/useIsMounted";
import { handleAnimationDelay } from "../utils";
import useWindowDimensions from "../utils/hooks/useWindowDimensions";
import NFTView from "../components/NftView";
import Image from "next/image";
import { queryClient } from "../react-query/queryClient";
import Collection from "../components/Collection";
const AccountPage: NextPage = () => {
  const intialUser = {
    user_name: "",
    user_id: "0",
    image:
      "https://i.seadn.io/gae/A75MNKwJ5tw7R6t0-2DMcdDqr0ekHIfbDSrGFUgKNg_uwTuzbkin3jCKjph87jgQYq1wkmXd7gZazIrbrTIZ2DEl3upvLe-Bok0u?w=500&auto=format",
  };

  const defaultImage = "/images/default.jpg";
  const isMounted = useIsMounted();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(intialUser);
  const [Loading, setLoading] = useState(true);
  const { chain } = useNetwork();
  const { width } = useWindowDimensions();
  const { switchNetwork } = useSwitchNetwork();
  const [culdAssets, setculdAssets] = useState<any[]>([]);
  const [TPFAssets, setTPFAssets] = useState<any[]>([]);
  const [SquishiAssets, setSquishiAssets] = useState<any[]>([]);
  const [MFAssets, setMFAssets] = useState<any[]>([]);
  const [pfp, setPfp] = useState<any>();
  const [isNewUser, setIsNewUser] = useState(false);
  const [editable, setEditable] = useState(false);
  const [hide, setHidden] = useState("hidden");

  const { data: user_nfts } = useQuery([QUERIES.get_user_nfts, address], () =>
    getUserNfts(address)
  );

  // useEffect(() => {
  //   if (user_nfts?.access) {
  //     setUserAccess(true);
  //   } else {
  //     setUserAccess(false);
  //   }
  // }, [user_nfts]);

  useEffect(() => {
    setculdAssets(user_nfts?.data?.the_cult_dao);
    setTPFAssets(user_nfts?.data?.the_plague);
    setSquishiAssets(user_nfts?.data?.squishiverse);
    setMFAssets(user_nfts?.data?.movinfrens);
    if (user_nfts?.data?.the_plague?.length > 0 && !pfp) {
      setPfp(user_nfts?.data?.the_plague?.[0].image_url);
    } else if (user_nfts?.data?.squishiverse?.length > 0 && !pfp) {
      setPfp(user_nfts?.data?.squishiverse?.[0].image_url);
    } else if (user_nfts?.data?.the_cult_dao?.length > 0 && !pfp) {
      setPfp(user_nfts?.data?.the_cult_dao?.[0].image_url);
    }
  }, [pfp, user_nfts]);

  const { data: UserData, isFetched } = useQuery(
    [QUERIES.getUser, address],
    () => getUser(address)
  );

  useEffect(() => {
    if (!isConnected && !address) {
      router.push("/login");
    }
  });

  useEffect(() => {
    if (isFetched && UserData?.success === true) {
      setUserInfo(UserData?.data);
    } else if (isFetched && UserData?.success === false) {
      setIsNewUser(true);
    }
  }, [UserData, isFetched]);

  const { mutate: createData } = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERIES.createUser);
    },
  });

  useEffect(() => {
    if (isNewUser === true || !userInfo?.image || userInfo?.image == "") {
      createData({ wallet_address: address, image: pfp });
    }
  }, [address, createData, isNewUser, pfp, userInfo]);

  useEffect(() => {
    if (window.ethereum) {
      (window as any).ethereum.on("accountsChanged", function (accounts: any) {
        setUserInfo([]);
        setLoading(true);
        //   checkUser();
        return;
      });
    }
  });

  return (
    <div>
      <Head>
        <title id="title">My Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <main className="p-4 pt-6 lg:px-16 min-h-screen">
          {isMounted && (
            <>
              <motion.div
                className="mt-8 text-center gap-3"
                // variants={opacityAnimation}
                initial="initial"
                whileInView="final"
                viewport={{ once: true }}
                // transition={{
                //   ease: "easeInOut",
                //   duration: 0.1,
                //   delay: 0.05,
                // }}
              >
                <div className="text-center gap-5">
                  {/* <h1 className="text-2xl font-bold text-center bg-[#63f7f5] bg-opacity-10">Account Info</h1> */}
                  <br></br>
                  <div className="relative justify-center flex gap-20 sm:gap-48">
                    <div className="relative w-24 h-24">
                      <Image
                        className="rounded-full border border-gray-100 shadow-sm"
                        src={userInfo?.image ? userInfo?.image : defaultImage}
                        objectFit="fill"
                        layout="fill"
                      />
                    </div>
                  </div>
                  <div className="pt-8 text-xl">
                    <ul>
                      <li className={`outline-0 inline-block`}>
                        {userInfo?.user_name ? userInfo?.user_name : ""}
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="mt-8"
                // variants={opacityAnimation}
                initial="initial"
                whileInView="final"
                viewport={{ once: true }}
                // transition={{
                //   ease: 'easeInOut',
                //   duration: 1,
                //   delay: 0.4,
                // }}
              >
                <h2 className="text-3xl  font-semibold text-center ">
                  User NFTs
                </h2>
              </motion.div>
              {MFAssets?.length > 0 && (
                <Collection name="Movin Frens" data={MFAssets} />
              )}
              {TPFAssets?.length > 0 && (
                <Collection name="The Plague Frogs" data={TPFAssets} />
              )}
              {SquishiAssets?.length > 0 && (
                <Collection name="The Squishiverse" data={SquishiAssets} />
              )}
              {culdAssets?.length > 0 && (
                <Collection name={"The Cult Dao"} data={culdAssets} />
              )}
            </>
          )}
        </main>
      </>
    </div>
  );
};

export default AccountPage;
