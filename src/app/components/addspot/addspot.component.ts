import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddSpotSteps, StepStates, AppModes } from '~/util';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '~/store';
import { AppModeActions, AddSpotStepActions, AddSpotInfoActions, SpotsAddActions } from '~/actions';
import { Observable } from 'rxjs';
import Animations from '~/animations';

@Component({
  selector: 'pa-add-spot',
  templateUrl: './addspot.component.html',
  styleUrls: ['./addspot.component.scss'],
  animations: Animations
})

export class AddSpotComponent implements OnInit {
  public isAppMode: boolean;
  public showAddButton: boolean;
  public addSpotStep: AddSpotSteps;
  public addSpotSteps = AddSpotSteps;

  @select() private appMode$: Observable<AppModes>;
  @select() private addSpotStep$: Observable<AddSpotSteps>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private appModeActions: AppModeActions,
    private addSpotStepActions: AddSpotStepActions,
    private addSpotInfoActions: AddSpotInfoActions,
    private spotsAddActions: SpotsAddActions
  ) {}

  ngOnInit() {
    this.appMode$.subscribe((mode: AppModes) => {
      this.isAppMode = mode === AppModes.AddSpot;
      this.showAddButton = mode !== AppModes.AddSpot && mode !== AppModes.ReportSpot;
    });

    this.addSpotStep$.subscribe((step: AddSpotSteps) => {
      this.addSpotStep = step;
    });
  }

  onOpenAddSpot() {
    this.appModeActions.setModeAddSpot();
  }

  onCloseAddSpot() {
    this.appModeActions.unsetModeAddSpot();
  }

  onAddSpotStepChange(step) {
    this.addSpotStepActions.setStep(step);
  }

  onSetLocation() {
    this.addSpotInfoActions.setLocation();
  }

  onSubmitAddSpot(state) {
    this.addSpotInfoActions.setInfo(state);
    this.spotsAddActions.addSpot();
  }
}