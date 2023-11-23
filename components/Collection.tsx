import { FC } from "react";
import {motion} from "framer-motion"
import NFTView from "./NftView";

const Collection: FC<{name:string, data:any[]}> = ({
    name, data
}) => {

    return (
      <motion.div
        className="mt-8 bg-orange-100 bg-opacity-[10%]"
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
        <p className="text-2xl pl-12 pt-5">{name}</p>
        <div
          className="py-10 md:px-4 bg-transparent rounded-lg grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:grid-cols-3  
          gap-20 w-full  max-w-full mx-auto px-10"
        >
          {data?.length == 0 && <p>No Assets Found</p>}
          {data?.length > 0 &&
            data?.map((nft, index) => (
              <motion.div
                className="flex justify-center "
                key={index}
                // variants={opacityAnimation}
                initial="initial"
                whileInView="final"
                viewport={{ once: true }}
                // transition={{
                //   ease: 'easeInOut',
                //   duration: 0.001,
                //   delay: handleAnimationDelay(index, width),
                // }}
              >
                <NFTView nft={nft} />
              </motion.div>
            ))}
        </div>
      </motion.div>
    );
}


export default Collection