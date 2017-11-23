import { Component, OnInit, Input } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Location } from '../../domain';

@Component({
  selector: 'saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent {
  
    public loggedIn:boolean;
    public name:string;
    public noSaved:boolean;
    locations: Location[] = [];
    private hiddenArray: boolean[];

    constructor(private router: Router, private http: HttpClient){}

    ngOnInit(){
        if(localStorage.getItem('session_id') !== null){
            this.http.get('http://ec2-18-216-113-131.us-east-2.compute.amazonaws.com/session/' + localStorage.getItem('session_id')
            ).subscribe(data => { console.log(data)
                if(data['valid'] == 1){
                    this.loggedIn = true;
                    this.http.get<Location[]>('http://ec2-18-216-113-131.us-east-2.compute.amazonaws.com/account/' + localStorage.getItem('session_id') + '/location/save/get',
                    ).subscribe(data => {
                        console.log(data);
                        for(var i = 0; i < data['locations'].length; i++){
                            this.locations.push(data['locations'][i]);
                        }
                    this.noSaved = false;
                });
                }else{
                    this.loggedIn = false;
                    localStorage.removeItem('session_id');
                    this.router.navigate(['/']);
                }
            });
        }else{
            this.loggedIn = false;
            this.router.navigate(['/']);
            this.noSaved = true;
        }

        this.hiddenArray = Array(this.locations.length).fill(true);
    }

    private unsave(location: number){
        this.http.delete('http://ec2-18-216-113-131.us-east-2.compute.amazonaws.com/account/deletesavedlocation/' + localStorage.getItem('session_id') + '/' + location
        ).subscribe(data => {console.log(data);
          if (data['valid'] == 1) {
            window.location.reload();
          } else {
            console.log('didnt work');
          }
        });
      }

      private removeFromView(x: number) {
        this.hiddenArray[x] = false;
      }
    
      isNull(array: any[]) {
        if (array) {
          array.forEach(element => {
            if (element)
              return false;
          });
        return true;
        }
      }
    


   
}