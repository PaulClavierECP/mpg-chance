import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { User, League } from '../../mpg-client/types';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input() user: User;

  ngOnInit(): void {}
}
