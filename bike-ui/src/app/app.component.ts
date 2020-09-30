import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { myData } from './mock-data/data-neuro';
import { Leaf } from './mock-data/leaf';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bike-ui';
  neuroData: Leaf[] = myData;
  childCounts: number = 0;
  fileUploaded: any;
  counter: number = 0;
  currentLine: string = ``;
  numbersData: string[] = [];

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


  /** Problem 3 */
  get7segment(ascii) {
      return ascii.
          split('*').
          reduce((r, a, i) => {
              a.match(/.../g).forEach((b, j) => {
                  r[j] = r[j] || [];
                  r[j][i] = b;
              });
              return r;
          }, []).
          map((a) => {
              return a.join('');
          }).
          map((a) => {
              var bits = { 63: 0, 6: 1, 91: 2, 79: 3, 102: 4, 109: 5, 125: 6, 7: 7, 127: 8, 111: 9, 0: ' ' },
                  v = '909561432'.split('').reduce((r, v: any, i) => {
                      return r + (<any>(a[i] !== ' ') << v);
                  }, 0);
              return v in bits ? bits[v] : '*'; // * is an illegal character
          }).
          join('');
  }

  reset() { 
    this.counter = 0;
    this.currentLine = ``; 
  }

  concatLines(line) {
    if(this.counter === 3) { 
      this.currentLine = this.currentLine + line;
    } else {
      this.currentLine = this.currentLine + line + `*`;
    }
  }

  createTextData(allLines) {
    // Reading line by line
    allLines.forEach((line) => {
      this.counter = this.counter + 1;
      if(line.length > 0) {
        this.concatLines(line);
      } else if(line.length === 0) {
        if(this.currentLine !== "") {
          this.numbersData.push(this.get7segment(this.currentLine));
          this.numbersData.push('\n');
        }
        this.reset();  
      }
    });
  }
  
  public onSelectFile(input) { // called each time file input changes
    const file = input.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const file = <any>event.target.result;
        const allLines = file.split(/\r\n|\n/);
        this.createTextData(allLines);
    };

    reader.onerror = (event) => {
      console.log('error', event.target.error.name);
    };  

    reader.readAsText(file);
  }

  download() {
    var blob = new Blob(this.numbersData, {type: "text/plain;charset=utf-8"});
    saveAs(blob, "numbers.txt");
  }
}
