import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '~/store';
import { AppModes } from '~/util';
import { MapActions } from '~/actions/map.actions';


@Injectable()
export class AppModeActions {
    static SET_MODE_HOME = 'PA/MODE/HOME';
    static SET_MODE_ADDSPOT = 'PA/MODE/ADDSPOT';
    static SET_MODE_SPOTSLIST = 'PA/MODE/SPOTSLIST';
    static SET_MODE_REPORTSPOT = 'PA/MODE/REPORTSPOT';
    static SET_MODE_PREVIOUS = 'PA/MODE/PREVIOUS';

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private mapActions: MapActions
    ) {}


    public setModeHome() {
        this.ngRedux.dispatch({
            type: AppModeActions.SET_MODE_HOME
        });
    }

    public setModeAddSpot() {
        this.ngRedux.dispatch({
            type: AppModeActions.SET_MODE_ADDSPOT
        });

        this.mapActions.setZoom(18);
    }

    public unsetModeAddSpot() {
        this.ngRedux.dispatch({
            type: AppModeActions.SET_MODE_PREVIOUS
        });
    }

    public setModeSpotsList() {
        // Only set to spotsList mode if current mode is home
        if (this.ngRedux.getState().appMode === AppModes.Home) {
            this.ngRedux.dispatch({
                type: AppModeActions.SET_MODE_SPOTSLIST
            });
        }
    }

    public setModeReportSpot() {
        this.ngRedux.dispatch({
            type: AppModeActions.SET_MODE_REPORTSPOT
        });
    }
}