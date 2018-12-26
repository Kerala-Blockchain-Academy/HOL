import { Component, OnInit } from '@angular/core';
import { SawtoothService } from '../sawtooth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  constructor(private data: SawtoothService) { }

  ngOnInit() {
  }

  onSubmit(f)
  {
    const address = this.data.hash(f.value.bottle_id).substr(0, 70)
    let response = this.data.getState(address);
    response.subscribe((resp)=>{console.log("RESPONSE: ",resp)},
    (error)=>{console.log("ERROR !: ",error)})
    
    console.log("THE RESPONSE FROM API: ",response)
  }

}
