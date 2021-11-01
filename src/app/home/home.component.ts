import { Component, OnInit } from '@angular/core';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import { DataService } from '../data.service';
import { GraphqlProductsService } from '../graphql.products.service';
import { Subscription } from 'rxjs';
import { GraphqlUsersService} from '../graphql.users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('goals', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('300ms', [
          animate('0.6s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: 0.5, transform: 'translateY(35px)', offset: .3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
          ]))]), { optional: true }),


        query(':leave', stagger('300ms', [
          animate('0.6s ease-in', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: 0.5, transform: 'translateY(35px)', offset: .3 }),
            style({ opacity: 0, transform: 'translateY(-%75)', offset: 1 })
          ]))]), { optional: true })
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  itemCount: number = 4;
  btnText: string = 'Add an item';
  goalText: string = 'My first life goal'
  goals: Array<string> = [];
  user: string = "";
  pass: string = "";
  token: string = "";

  loading: boolean = false;
  private querySubscription: Subscription;

  constructor(
    private _data: DataService,
    private graphqlProductsService: GraphqlProductsService,
    private graphqlUsersService : GraphqlUsersService
  ) { 
  }

  ngOnInit(): void {
    this._data.goal.subscribe(res => this.goals = res);
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals)
    this.querySubscription = this.graphqlProductsService.links("-")
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        //this.goals = JSON.parse(JSON.stringify(data)).links;
        var jsonData = JSON.stringify(data);
        var jsonLinks = JSON.parse(jsonData).links;
        var stringLinks = JSON.stringify(jsonLinks);
        console.log(jsonLinks);
        for (var count in jsonLinks) {
          this.addItemFromJson(jsonLinks[count].url);
          console.log(jsonLinks[count].description);
        }
      });
  }

  private addItemFromJson(urlString: string): void {
    this.goals.push(urlString);
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals)
  }

  addItem(): void {
    this.goals.push(this.goalText);
    this.goalText = '';
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals)
  }

  removeItem(i: number): void {
    this.goals.splice(i, 1);
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals)
  }

  loginUser() {
    alert(this.user + " - " + this.pass);
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
      // this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      //this.storageService.setLocal("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;
      

      //this.loginService.showData(mydata);
      // this.router.navigate(['/']);

    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  
  }  

  addItemTest() {
  //    this.goals.push(this.goalText);


    var mytoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imh1Z28iLCJleHAiOjE2MzU3NDA3MjUsIm9yaWdJYXQiOjE2MzU3NDA0MjV9.XDBvqSzMTlmLHKMHnWmnjxY0sBSnrQnj40QMGBqfWcs";
    //this.storageService.getSession("token");
    alert(this.goalText);

    this.graphqlProductsService.createLink(mytoken, "https://www.github.com", this.goalText)
    .subscribe(({ data }) => {
       console.log('link created :  ', data);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  }
}
