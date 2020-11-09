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
  columnDefs2;
  columnDefs3;

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
      { field: 'uno', headerName: 'Player', valueFormatter: getUsername },
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
      { field: 'matchId', headerName: 'Match', minWidth:100, hide: true},
      { field: 'startTime', headerName: 'Time', width:170, valueFormatter: getTime },
      { field: 'mode', headerName: 'Mode', width:100 },
      { field: 'position', headerName: 'Pos', width:85 },      
      { field: 'team', headerName: 'Team', width:150, hide: true  },
      { field: 'totalKills', headerName: 'Kills', width:85 },
      { field: 'totalDeaths', headerName: 'Deaths', width:90 }
    ];

    this.columnDefs2 = [      
      { field: 'name', headerName: 'Team'},
      { field: 'players', headerName: 'Players', minWidth:100, valueFormatter: getPlayers },
      { field: 'score', headerName: 'Points'},
      { field: 'matches.length', headerName: 'Matches Played'},
      { field: 'totalWins', headerName: 'Wins'},
      { field: 'kd', headerName: 'K/D'},
      { field: 'totalKills', headerName: 'Kills'},
      { field: 'totalDeaths', headerName: 'Deaths'},
      { field: 'totalDmg', headerName: 'Dmg'},
      { field: 'totalDmgTkn', headerName: 'Dmg Tkn'}
    ];

    this.columnDefs3 = [      
      { field: 'team.name', headerName: 'Team', width:90},
      { field: 'team.players', headerName: 'Players', minWidth:130, valueFormatter: getPlayers },      
      { field: 'match.score', headerName: 'Score', width:90 },      
      { field: 'match.position', headerName: 'Position', width:90 },      
      { field: 'match.mode', headerName: 'Mode', width:100 },      
      { field: 'match.totalKills', headerName: 'Kills', width:90 },      
      { field: 'match.totalDeaths', headerName: 'Deaths', width:90 },      
      { field: 'match.kd', headerName: 'K/D', width:90 }    
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

  addTestEvent(): void {
    const event: EventDto = {
      "name": "Event1",
      "date": 1604780100000,
      "games": [],
      "teams": [
          { 
              "name": "Team1",
              "players": [
                  { "uno": "Streb#4872102", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] },
                  { "uno": "VanillaKillah76#1387096", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] }
              ],
              "matches": []
          },
          { 
              "name": "Team2",
              "players": [
                  { "uno": "ultronwar", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] },
                  { "uno": "Draculaj90#5796055", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] }
              ],
              "matches": []
          },
          { 
              "name": "Team3",
              "players": [
                  { "uno": "SiXf0ld#7965658", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] },
                  { "uno": "LowKeys22B#7990156", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] }
              ],
              "matches": []
          },
          { 
              "name": "Team4",
              "players": [
                  { "uno": "Stenna#4150802", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] },
                  { "uno": "Mupp3t#7430866", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] }
              ],
              "matches": []
          },
          { 
              "name": "Team5",
              "players": [
                  { "uno": "yes#7920564", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] },
                  { "uno": "SantinoGuap#2320316", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] }
              ],
              "matches": []
          },
          { 
              "name": "Team6",
              "players": [
                  { "uno": "Alinorth", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] },
                  { "uno": "Adirolf#8902313", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] }
              ],
              "matches": []
          },
          { 
              "name": "Team7",
              "players": [
                  { "uno": "Hitman420#8974167", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] },
                  { "uno": "Jkr#5734981", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] }
              ],
              "matches": []
          },
          { 
              "name": "Team8",
              "players": [
                  { "uno": "baldwolf", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] },
                  { "uno": "joshi0906", totalKills: 0, totalDeaths: 0, totalDmg: 0, totalDmgTkn:0, bestPosition:150, totalWins: 0, matches:0, kd: 0, wzMatches: [] }
              ],
              "matches": []
          }
      ]
    };
    this.mwstats.addEvent(event).subscribe(e => {
      this.getEvents();      
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getEventPlayers(event: EventDto) {
    return event.teams.flatMap(t=>t.players).sort((a, b) : number => {
        
      type PlayerFields = 'totalWins' | 'totalKills' | 'totalDeaths' | 'totalDmg' | 'totalDmgTkn' | 'bestPosition' | 'uno';

      const fieldSorter = (fields:PlayerFields[]) => (a, b) => fields.map((o:PlayerFields) => {
          let dir = -1;

          return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
      }).reduce((p, n) => p ? p : n, 0);

      return fieldSorter(['totalWins', 'totalKills', 'totalDmg'])(a, b);
  });
  } 

}

var getUsername = function (params){return  params.value.split('#')[0]};
var getTime = function (params){return  new Date(params.value*1000).toLocaleString()};
var getPlayers = function (params){return  params.value.map(n=>n.uno.split('#')[0]).join(', ')};