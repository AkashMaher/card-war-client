
export type AvatarType = {
  _id: string
  contract_address: string
  contract_type: string
  token_id: string
  meta_data_url: string
  number_of_tokens?: number
  listed_tokens?: number
  is_in_auction: boolean
  is_in_sale: boolean
  token_owner: string
  createdAt: string
  updatedAt: string
  __v: number
  meta_data: {
    name: string
    image: string
    description: string
    external_uri: string
    attributes: { name: string; value: string }[]
  }
}
