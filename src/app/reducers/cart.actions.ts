import { createAction, props } from "@ngrx/store";
import { Cart } from "../interfaces";

export const addCart = createAction('[Cart Component] AddCart', props<{ cart: Cart }>());
export const editCart = createAction('[Cart Component] EditCart', props<{id:string, quantity: number }>());
export const deleteCart = createAction('[Cart Component] DeleteCart', props<{ id:string,quantity:number }>());