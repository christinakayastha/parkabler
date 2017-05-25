import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '~/store';
import { AddSpotSteps } from '~/util';


@Injectable()
export class AddSpotInfoActions {
    static SET_INFO = 'PA/ADDSPOTSTEP/SET_INFO';

    constructor(
        private ngRedux: NgRedux<IAppState>
    ) {}

    public setInfo(info: any) {
        this.ngRedux.dispatch({
            type: AddSpotInfoActions.SET_INFO,
            payload: info
        });
    }

    public setLocation() {
        const coordinates = this.ngRedux.getState().map.center;
        this.setInfo({
            coordinates: coordinates
        });
    }
}