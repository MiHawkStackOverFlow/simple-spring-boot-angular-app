import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { myData } from './mock-data/data-neuro';
import { Leaf } from './mock-data/leaf';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bike-ui';
  neuroData: Leaf[] = myData;
  childCounts: number = 0;

  constructor(private authService: AuthService) {
    authService.handleAuthentication();
  }

  ngOnInit() {
    console.log('my data', this.neuroData);
    this.checkChildCount(this.neuroData);
    console.log('child count', this.childCounts);
    console.log('second problem', this.checkProblem2(4, 3));
  }

  /** Problem 1 */
  incrementCount() {
    this.childCounts = this.childCounts + 1;
  }

  checkNestedChildren(data: Leaf) {
    if (data.children && data.children.length > 0) {
      this.checkChildCount(data.children);
    }
  }

  checkChildCount(arrayData: Leaf[]) {
    if (arrayData.length > 0) {
      _.forEach(arrayData, (data: Leaf) => {
        if (!data.isLeaf) {
          this.incrementCount();
          this.checkNestedChildren(data);
        } else if (data.children) {
          this.incrementCount();
          this.checkNestedChildren(data);
        }
      });
    }
  }

  /** Problem 2 */
  multiply(x: number, y: number) {
    if (y > 0) {
      return (x + this.multiply(x, y - 1));
    } else if (y < 0) {
      return -this.multiply(x, -y);
    }

    return 0;
  }

  factorialize(num: number) {
    if (num < 0) {
      return -1;
    } else if (num === 0) {
      return 1;
    } else {
      return (num * this.factorialize(num - 1));
    }
  }

  checkProblem2(num1: number, num2: number) {
    const multiplicatedData = this.multiply(num1, num2);
    const factData = num1 > num2 ? this.factorialize(num1) : this.factorialize(num2);
    const result = this.multiply(multiplicatedData, factData);
    return result;
  }


}
