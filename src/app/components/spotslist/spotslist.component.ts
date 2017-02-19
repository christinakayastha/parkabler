import { Component, OnInit, NgZone } from '@angular/core';
import { DistanceService, EditSpotStateService, MapLocationService, States } from '~/services';
import { Position, Spots, distanceBetween } from '~/util';
import { select, NgRedux } from 'ng2-redux';
import { IAppState } from '~/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'pa-spots-list',
  templateUrl: './spotslist.component.html',
  styleUrls: ['./spotslist.component.scss']
})
export class SpotsListComponent implements OnInit {
  @select() private spots$: Observable<Spots>;

  public expanded: boolean;
  public filteredSpots: any[];
  public hidden: boolean;
  public enabled: boolean;
  public numSpot: number;

  private spots: any[];

  private updateFilteredSpots = function(destination) {
    if (this.spots) {
      this.filteredSpots = this.spots.filter(function(spot){
        return distanceBetween(spot, destination) < 0.2;
        // Alternative:
        // return Math.abs(destination.lat - spot.lat) < 0.001
        //     && Math.abs(destination.lng - spot.lng) < 0.001
      });
    }
    this.numSpot = this.filteredSpots.length;
    this.enabled = this.numSpot > 0;
  };

  constructor(
    private distanceService: DistanceService,
    private ngRedux: NgRedux<IAppState>,
    private editSpotStateService: EditSpotStateService,
    private mapLocationService: MapLocationService,
    private zone: NgZone
  ) {
    this.expanded = false;
    this.enabled = false;
    this.hidden = false;
    this.numSpot = 100;
    this.filteredSpots = [];
    this.spots$.subscribe(res => {
      this.zone.run(() => {
        this.spots = res.map(function(r){
          return {
            lat: r.position.lat,
            lng: r.position.lng
          };
        });
        let { destination } = this.ngRedux.getState();
        this.updateFilteredSpots(destination);
      });
    });
    let { destination } = this.ngRedux.getState();
    this.updateFilteredSpots(destination);
  }

  ngOnInit() {
    this.editSpotStateService.state.subscribe((res) => {
      if (res === 0) {
        this.hidden = false;
      } else {
        this.hidden = true;
      }
    });
  }

  toggleExapand() {
    this.expanded = !this.expanded;
    let spotsPositions = this.filteredSpots.map(function(spot){
      return {
        lat: spot.lat,
        lng: spot.lng
      };
    });
    if (spotsPositions.length > 0) {
      let me = this;
      this.distanceService.getDistanceToDestinationFrom(spotsPositions).then(function(distance){
        for (let i = 0; i < distance.length; i++) {
            me.filteredSpots[i].distanceToDest = distance[i];
        }
      }).catch(function(err){
        console.log(err);
      });
    }
  }

  onReport(position) {
    this.expanded = false;
    // this.mapLocationService.set(position);
    this.editSpotStateService.set(States.ReportDetails);
  }

  onClickSpot(position) {
    this.mapLocationService.setZoom(20);
    this.mapLocationService.set(position);
  }
}
