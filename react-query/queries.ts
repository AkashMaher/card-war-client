import {
  axiosInstance,
  createAxiosInstance,
  Instance,
} from '../axiosInstance'

import axios from 'axios';
const OPENSEA_API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY


const header = {
      accept: "application/json",
      "X-API-KEY": OPENSEA_API_KEY,
    }



const axiosFileInstance = createAxiosInstance('form-data')

export const getUserNfts = (userAddress: any) => {
  if (userAddress == "NA" || userAddress == "") return;
  return axios
    .get(`/api/get_user_nfts?userAddress=${userAddress}`)
    .then((response) => {
      // Handle the response data here
      // console.log(response.data);
      return response.data
    })
    .catch((error) => {
      // Handle errors here
      console.error(error);
      return {access:false, error}
    });
};
export const createUser = (data: any) => {
  return axios
    .post("api/users", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return { access: false, error };
    });
}


export const getUser = (ownerAddress: any) => {
  if(ownerAddress == 'NA' || ownerAddress =='') return
  return axios
    .get(`/api/users?userAddress=${ownerAddress}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return { access: false, error };
    });
}

export const getOpponent = (address: any) => {
  if(address == 'NA' || address =='') return console.log("wallet not found")
  return axios
    .get(`/api/users?userAddress=${address}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return { access: false, error };
    });
}


export const updateGame = (data: any) => {
  console.log(data)
  return axios
    .post("api/game", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return { access: false, error };
    });
}

export const winGame = (data: any) => {
  return axios
    .post("api/game", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return { access: false, error };
    });
}

export const getGame = (roomId: string) => {
  if(roomId == 'NA' || roomId =='' || roomId == null) return
  return axios
    .get(`/api/game?id=${roomId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return { access: false, error };
    });
}