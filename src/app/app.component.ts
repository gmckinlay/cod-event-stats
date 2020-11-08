import { Component, OnInit, TemplateRef } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { interval } from 'rxjs';
import { EventDto, TeamDto } from './models/api.models';
import { MwstatsService } from './services/mwstats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mwstats';
  events: EventDto[];
  columnDefs;
  columnDefs1;

  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter'
    },
    onGridReady: function (params) {
      params.api.sizeColumnsToFit();
  
      window.addEventListener('resize', function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });
    },
  }
  
  modalRef: BsModalRef;
  
  constructor(private modalService: BsModalService, private mwstats: MwstatsService){
    this.columnDefs = [
      { field: 'uno', headerName: 'Acti ID', minWidth:150, valueFormatter: getUsername },
      { field: 'totalKills', headerName: 'Kills', width:100  },
      { field: 'totalDeaths', headerName: 'Deaths', width:100  },
      { field: 'totalDmg', headerName: 'Dmg', width:100 },
      { field: 'totalDmgTkn', headerName: 'Dmg Tkn', width:100 },
      { field: 'bestPosition', headerName: 'Best Pos', width:100 },
      { field: 'totalWins', headerName: 'Wins', width:100 },
      { field: 'matches', headerName: 'Matches', width:100 },
      { field: 'kd', headerName: 'K/D', width:100 }
    ];

    this.columnDefs1 = [      
      { field: 'matchId', headerName: 'Match', minWidth:100},
      { field: 'mode', headerName: 'Mode', width:100 },
      { field: 'position', headerName: 'Pos', width:60 },
      { field: 'startTime', headerName: 'Time', width:175, valueFormatter: getTime },
      { field: 'team', headerName: 'Team', width:150  },
      { field: 'totalKills', headerName: 'Kills', width:75 },
      { field: 'totalDeaths', headerName: 'Deaths', width:100 }
    ];
  }

  ngOnInit(): void {
    this.getEvents();
    interval(5 * 60 * 1000).subscribe(()=>this.getEvents());
  }

  getEvents(): void {
    this.mwstats.getEvents().subscribe(events=>this.events = events);
  }

  getEventKD(event: EventDto) {
    return Math.round(((event.teams
      .map((t) => t.players
        .map((p) => p.kd)
        .reduce((a, b) => a + b, 0) / t.players.length)
      .reduce((a, b) => a + b, 0) / event.teams.length) +  Number.EPSILON) * 100) / 100;
  }

  getEventStatCount(event: EventDto, stat: string) {
    return event.teams
      .map((t) => t.players
        .map((p) => p[stat])
        .reduce((a, b) => a + b, 0))
      .reduce((a, b) => a + b, 0);
  }

  getEventAttendees(event: EventDto) {
    return event.teams.flatMap((t) => t.players).length;       
    
  }

  getEventMatches(event: EventDto): number {
    const mIds: string[] = event.teams.flatMap((t)=>t.players.flatMap((p)=>p.wzMatches)).map((m)=>m.matchID);
    return mIds.filter((n, i) => mIds.indexOf(n) === i).length;
  }

  getEventDate(event: EventDto): string {
    return new Date(event.date).toLocaleString();
  }

  addEvent(event: EventDto): void {
    this.mwstats.addEvent(event).subscribe(e => {
      this.getEvents();
      this.modalRef.hide();
    });

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}

var getUsername = function (params){return  params.value.split('#')[0]};
var getTime = function (params){return  new Date(params.value*1000).toLocaleString()};