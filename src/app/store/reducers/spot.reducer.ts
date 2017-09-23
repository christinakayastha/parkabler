import { SpotActions } from '~/actions';
import { Action, Spot2 } from '~/util';

const INITIAL_STATE = null;


export function spotReducer(
    state: string = INITIAL_STATE,
    action: Action
) {
    switch (action.type) {
        case SpotActions.SET_FOCUS:
            return action.payload;

        default:
            return state;
    }
}
