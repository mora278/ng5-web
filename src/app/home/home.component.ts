import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  itemCount: number = 4;
  btnText: String = 'Add an item';
  goalText: String = 'My first life goal'
  goals: Array<String> = [];

  constructor() { }

  ngOnInit(): void {
    this.itemCount = this.goals.length;
  }

  addItem(): void {
    this.goals.push(this.goalText);
    this.goalText = '';
    this.itemCount = this.goals.length;
  }

}
