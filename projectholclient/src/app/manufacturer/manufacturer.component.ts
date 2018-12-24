import { Component, OnInit } from '@angular/core';
import { SawtoothService } from '../sawtooth.service';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrls: ['./manufacturer.component.css']
})
export class ManufacturerComponent implements OnInit {
//sawtooth services being imported for data type usage
  constructor(private data: SawtoothService) { }

  ngOnInit() {

  }

  onSubmit(f)
  {
    console.log(f)
    console.log(f.value)
    const bottleID = f.value.bottle_id;
    const bottleType= f.value.bottle_type;

    this.data.sendData('create',bottleID);
    

  }

}
