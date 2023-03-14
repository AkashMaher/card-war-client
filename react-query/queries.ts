import {
  axiosInstance,
  createAxiosInstance,
  Instance,
} from '../axiosInstance'


const axiosFileInstance = createAxiosInstance('form-data')

export const getTpfNFTs = (
  ownerAddress:any,
  asset_contract_addresse:string
) => {
  if(ownerAddress == 'NA') return
  return Instance.get(
    `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&asset_contract_address=${asset_contract_addresse}`
  )
}

export const getCultNFTs = (
  ownerAddress:any,
  asset_contract_addresse:string
) => {
  if(ownerAddress == 'NA') return
  return Instance.get(
    `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&asset_contract_address=${asset_contract_addresse}`
  )
}


export const createUser = (data: any) => {
  return axiosInstance.post('/create_user', data)
}


export const getUser = (ownerAddress: any) => {
  if(ownerAddress == 'NA' || ownerAddress =='') return
  return axiosInstance.get(`/get_user/${ownerAddress}`)
}

export const getOpponent = (address: any) => {
  if(address == 'NA' || address =='') return
  return axiosInstance.get(`/get_user/${address}`)
}


export const updateGame = (data: any) => {
  return axiosInstance.post('/update_game', data)
}

export const winGame = (data: any) => {
  return axiosInstance.post('/win_game', data)
}

export const getGame = (roomId: string) => {
  if(roomId == 'NA' || roomId =='' || roomId == null) return
  return axiosInstance.get(`/get_game/${roomId}`)
}