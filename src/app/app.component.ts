import { Component, OnInit, TemplateRef } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
      { field: 'totalKills', headerName: 'Kills' },
      { field: 'totalDeaths', headerName: 'Deaths' },
      { field: 'totalDmg', headerName: 'Dmg' },
      { field: 'totalDmgTkn', headerName: 'Dmg Tkn' },
      { field: 'bestPosition', headerName: 'Best Pos' },
      { field: 'totalWins', headerName: 'Wins' },
      { field: 'matches', headerName: 'Matches' },
      { field: 'kd', headerName: 'K/D' }
    ];
  }

  ngOnInit(): void {
    this.getEvents();
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
    const mIds: string[] = event.teams.flatMap((t)=>t.players.flatMap((p)=>p.matchIds));
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