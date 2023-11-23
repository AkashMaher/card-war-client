import { motion } from 'framer-motion'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect,FC, useState } from 'react'
import { useAccount, useConnect, useDisconnect,useSwitchNetwork,useNetwork, chainId } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Head from 'next/head';
import { opacityAnimation } from '../utils/animations'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import useIsMounted from '../utils/hooks/useIsMounted'
import { createUser, getUser } from '../react-query/queries'
import { QUERIES } from '../react-query/constants'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from '../react-query/queryClient'
// const chainId = '80001'
 type selectDataType = {
  name: string
  value: string
}

const CreateAccount: FC<{ handleUserInput: (_name:any, _value: any) => void, createUser:()=> void
}> = ({ handleUserInput, createUser }) => {
  const { address } = useAccount()


  return (
    <>
    <motion.div
              className="mt-8 text-xs justify-center"
              // variants={opacityAnimation}
              initial="initial"
              whileInView="final"
              viewport={{ once: true }}
              // transition={{
              //   ease: 'easeInOut',
              //   duration: 1,
              //   delay: 0.5,
              // }}
            >

     <div><p>Enter Username</p></div>
        <div className="h-[35px] relative rounded-lg">
            <input
                onChange={(e) => handleUserInput("name",e.target.value)}
                type="any"
                id="name"
                className="outline-none w-30 h-full bg-[#585858] px-[5%] text-white rounded-lg"
            />
        </div>
        <div>
        <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#585858] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> createUser()}>Update Username</button>
        </div>
    </motion.div>
    </>
  )
}
const SettingPage: NextPage = () => {
    const router = useRouter()
    const initialFormState = {
    name:'',
  }
  const isMounted = useIsMounted()
    const { chain } = useNetwork()
    const { switchNetwork } = useSwitchNetwork()
    const [isUser,setUser] = useState()
    const { address, isConnected } = useAccount()
    const [Loading,setLoading] = useState(false)
    const [formData, setFormData] = useState(initialFormState)
    const [checkIfNewUser,setIfNewUser] = useState(false)
    const [userInfo,setUserInfo] = useState<any>()
    const { connect:connectInjector } = useConnect({
    connector: new InjectedConnector(),
    })
    const { connect:connectMetamask } = useConnect({
    connector: new MetaMaskConnector(),
    })
    const { disconnect } = useDisconnect()

    const handleConnect =async () => {
        await connectInjector();
        if(!checkIfNewUser) {
            // await router.push('./profile');
        }
    }

    const { data: UserData, isFetched } = useQuery(
      [QUERIES.getUser, address],
      () => getUser(address)
    );

    const handleUserInput = (_name:any,_value:any) => {
        if(!_name || !_value) return;
        setFormData((prevData) => ({
        ...prevData,
        [_name]: _value,
        }))
    }




  useEffect(() => {
    if (isFetched && UserData?.success === true) {
      setUserInfo(UserData?.data);
    } else if (isFetched && UserData?.success === false) {
      setIfNewUser(true);
    }
  }, [UserData, isFetched]);


  const { mutate:createData } = useMutation(
    createUser,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERIES.createUser)
      },
    }
  )

    const updateUser = async ()=> {
        if(address) {
        const { name } = formData
         await createData({user_name:name,wallet_address:address})
         return await router.push('/profile');
        }
    }
        useEffect(()=> {
  if (window.ethereum) {
        (window as any).ethereum.on('accountsChanged', function (accounts:any) {
  // Time to reload your interface with accounts[0]!
        
        return
        })
  }
})
    // useEffect(()=> {
    //     // if(isConnected && isUser) router.back()
    // })
    // // let checkIfNewUser = isConnected && !isUser

  return (
    <>
    {isMounted &&
    <div>
      <Head>
        <title id="title">Setting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <>
    
    <main className="p-4 pt-6 lg:px-16 justify-between text-center min-h-screen">
        <div>
            <h1 className="text-2xl font-bold ">{'Setting'}</h1>
            <div>
                {isConnected && 
                <>
               {/* <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#6a0303] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> disconnect()}>Disconnect</button> */}
                <p className='text-xs'> Connected to : {address ? address : ''} </p>
                </>
                }
                {/* {!isConnected && <> <br></br> <button className="outline-none mr-4 mt-4 w-30 h-full bg-[#01850c] py-[1%] px-[9.5%] text-white rounded-lg" onClick={()=> handleConnect()}>Connect Wallet</button></>} */}
            </div>
        
                <>
                <CreateAccount handleUserInput={handleUserInput} createUser={updateUser}/>
                </>
        </div>
        <div>

        </div>
    </main>
    </>
    </div>
    }
    </>
  )
}

export default SettingPage
