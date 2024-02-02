import { Cart, CartState, User } from './../interfaces';
import { createReducer, on } from '@ngrx/store';
import { addCart, deleteCart, editCart } from './cart.actions';

const storedData = localStorage.getItem('carts');
let optionState;
if(storedData){
  const stateLocal:CartState = JSON.parse(storedData)
  optionState = {...stateLocal}
}else{
  optionState = {
    carts:[] as Cart[],
    quantity: 0,
    user:{} as User
  }
}
export const initialState = {
  ...optionState,
};

export const cartReducer = createReducer(
  initialState,

  on(addCart, (state, { cart }) => {
    const existingCartItem = state.carts.find(item => 
      item.idProduct === cart.idProduct &&
      item.idColor === cart.idColor &&
      item.idSize === cart.idSize
    );
    if (existingCartItem) {
      const updatedCarts = state.carts.map(item =>
        item.idProduct === cart.idProduct && item.idColor === cart.idColor && item.idSize === cart.idSize
          ? { ...item, quantity: item.quantity + cart.quantity }
          : item
      );
      return {
        quantity:state.quantity + cart.quantity,
        carts: updatedCarts,
        user:state.user,
      };
    } else {
      return {
        quantity:state.quantity + cart.quantity,
        carts: [...state.carts, cart],
        user:state.user,
      };
    } 

  }),

  on(deleteCart, (state, { id,quantity }) => ({
    carts: state.carts.filter((cart: Cart) => cart.id !== id),
    quantity: state.quantity - quantity < 0 ? 0 : state.quantity - quantity,
    user:state.user,
  })),

  on(editCart, (state, { id, quantity }) => ({
    carts: state.carts.map((cart: Cart) => {
      if (cart.id === id) {        
        return { ...cart, quantity:quantity };
      }
      return cart;
    }),
    quantity:state.carts.reduce((sum , cart) =>{
      if(cart.id === id) {
        return sum + quantity
      }
      return sum + cart.quantity
    },0),
    user:state.user,

    
  }))
);
