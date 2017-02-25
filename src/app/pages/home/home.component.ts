import { Component, OnInit } from '@angular/core';
import { PlacesActions, SpotsActions, NearbySpotsActions } from '~/actions';
import { Position, Place, Spots, NearbySpots, AppModes } from '~/util';
import { select } from 'ng2-redux';
import { Observable } from 'rxjs';
import Animations from '~/animations';

@Component({
  selector: 'pa-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: Animations
})
export class HomeComponent implements OnInit {
  public mode: AppModes;
  public appModes = AppModes;

  @select() private destination$: Observable<Position>;
  @select() private spots$: Observable<Spots>;
  @select() public nearbySpots$: Observable<NearbySpots>;
  @select() private appMode$: Observable<AppModes>;

  constructor(
    private placesActions: PlacesActions,
    private spotsActions: SpotsActions,
    private nearbySpotsActions: NearbySpotsActions
  ) {}

  ngOnInit() {
    this.spotsActions.getSpots();

    // This combines both destination$ & spots$ observables
    // We then use the latest values from both to get nearby spots
    this.destination$.combineLatest(
      this.spots$,
      (destination, spots) => ({destination, spots})
    ).subscribe(({destination, spots}) => {
      this.nearbySpotsActions.getNearbySpots(destination, spots);
    });

    // Whenever the app mode changes, show/hide appropriate components
    this.appMode$.subscribe((mode: AppModes) => {
        this.mode = mode;
    });
  }

  onPlaceUpdate(newPlace: Place) {
    this.placesActions.setPlace(newPlace);
  }
}
