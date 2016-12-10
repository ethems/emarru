import axios from 'axios';

export const ActionTypes = {
    GET_PRODUCTS: 'GET_PRODUCTS',
    GET_PRODUCTS_PENDING: 'GET_PRODUCTS_PENDING',
    GET_PRODUCTS_FULFILLED: 'GET_PRODUCTS_FULFILLED',
    GET_PRODUCTS_REJECTED: 'GET_PRODUCTS_REJECTED'
};

export function getProducts() {
    return {type: ActionTypes.GET_PRODUCTS, payload: axios.get(`/api/products`)};
}
