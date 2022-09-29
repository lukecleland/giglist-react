import { createStore, createHook } from 'react-sweet-state';
import { TGiglist } from '../types/types';

const Store = createStore({
  // value of the store on initialisation
  initialState: {
    gigdata: {}
  },
  // actions that trigger store mutation
  actions: {
    setListings:
      (gigdata:TGiglist) =>
      ({ setState, getState }) => {
        // mutate state synchronously
        gigdata && setState({
            gigdata
        });
      },
  }
});

export const useListStore = createHook(Store);