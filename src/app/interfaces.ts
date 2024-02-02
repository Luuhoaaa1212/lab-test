export interface Category {
  id: string;
  name: string;
}
export interface Utils {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface Color {
  id: string;
  name: string;
}
export interface Size {
  id: string;
  name: string;
}
export interface User {
  id: number;
  name: string;
  accsessToken: string | undefined;
}
export interface ProductDetail {
  id: string;
  product_id: string;
  image_details: string[];
}
export interface Address {
  _id: string;
  username: string;
  phone: string;
  detail: string;
  default: boolean;
  user_id: string;
}

export interface Product {
  _id: string;
  name: string;
  avt: string;
  price: number;
  price_old: number | null;
  discount_amount: number;
  brand_id: string;
  color_ids: number[];
  size_id: number[];
  createdAt: string;
  updatedAt:string;
  des:string;

}
export interface Cart {
  id: string;
  idProduct: string;
  idSize: string;
  idColor: string;
  quantity: number;
  typetranfer: any;
}
export interface CartState {
  carts: Cart[];
  quantity: number;
  user: User;
}
export interface Oders {
  _id:string;
  address_id:string;
  user_id:string;
  type_pay:string;
  createdAt: string;
  updatedAt:string;
}
export interface OdersDetail {
  _id:string;
  oder_id:string;
  product_id:string;
  quantity:number;
  size_id:string;
  color_id:string;
  type_tranfer:string;
  status:number
  createdAt: string;
  updatedAt: string;
}
export interface Reasons {
  id: string;
  oder_id: string;
  createdAt: string;
  reason_id: string;
 
    updateAt?: string;
}

export interface CartRender {
  id: string;
  color: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}
