import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { EventDto } from './models/api.models';
import { MwstatsService } from './services/mwstats.service';

@Component({
    selector: 'app-event-form',
    template: `
    {{diagnostic}}
    <form (ngSubmit)="onSubmit()" #eventForm="ngForm">
        <div class="form-group">
            <input class="form-control" [formControl]="name" placeholder="Event Name" />
        </div>         
        <div class="row">
            <div class="form-group col-md-12 form-inline">
                <input class="form-control" type="text"
                    placeholder="Date"
                    class="form-control"
                    bsDatepicker
                    [bsConfig]="{ isAnimated: true, containerClass: 'theme-dark-blue' }"
                    [formControl]="date">
                <input class="form-control" type="time" [formControl]="time">
            </div>
        </div>
        <div class="form-group" *ngFor="let team of teams.controls; index as i">
            <div class="form-group col-md-11 offset-md-1">
                <input class="form-control" [formControl]="team.controls.name" placeholder="Team Name" />
            </div>
            <div class="form-group" *ngFor="let player of team.controls.players.controls; index as j">
                <input class="form-control col-md-10 offset-md-2" placeholder="Activistion ID"
                    [formControl]="player.controls.uno"
                    [typeahead]="players"
                    [isAnimated]="true"/>
            </div>
            <div class="col-md-11 offset-md-1">
                <button type="button" class="btn btn-primary" (click)="addPlayer(i)">Add Player</button>
            </div>
            <hr /> 
        </div>
        <div class="form-group">
            <button type="button" class="btn btn-primary" (click)="addTeam()" >Add Team</button>
        </div>
        <hr />         
        <div class="form-group"> 
            <button type="submit" class="btn btn-primary">submit</button>
        </div>
    </form>    
    `,
})
export class EventFormComponent implements OnInit {

    @Output() submitEvent: EventEmitter<EventDto> = new EventEmitter<EventDto>();
    name = new FormControl('');
    teams = new FormArray([]);
    players: string[];
    date = new FormControl('');
    time = new FormControl('');

    constructor(private mwStatsService: MwstatsService){}

    ngOnInit(): void {
        this.mwStatsService.getFriends().subscribe((friends)=>this.players = friends.uno.map((uno)=>uno.username));
    }

    onSubmit() {         
        const date:Date = this.date.value;
        const time:string[] = this.time.value.split(':');
        date.setHours(Number.parseInt(time[0]));
        date.setMinutes(Number.parseInt(time[1]));
        date.setSeconds(0);
        this.submitEvent.emit(<EventDto>{
            name: this.name.value,
            date: date.getTime(),
            teams: this.teams.value
        });
    }

    addTeam(){
        this.teams.push(new FormGroup({name:new FormControl(''), players: new FormArray([])}));        
    }

    addPlayer(i: number){
        (<FormArray>(<FormGroup>this.teams.controls[i]).controls.players).push(new FormGroup({uno:new FormControl('')}));
    }

    // TODO: Remove this when we're done
    get diagnostic() { 
        console.log("date/time", this.date, this.time)
        return this.date.value;
    }
}