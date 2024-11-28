import { Component, ViewChild, OnInit } from '@angular/core';
import { FlexmonsterPivot } from 'ngx-flexmonster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'flexmonster-project';
  @ViewChild('pivot') pivotRef!: FlexmonsterPivot;

  report = {
    dataSource: {
      browseForFile: true,
      type: "json",
      fileName: "src/assets/friends_info.json"
    }
  };

  constructor() {}

  ngOnInit(): void {
    if (this.pivotRef) {
      this.pivotRef.flexmonster.setReport(this.report);
    }
  }

  customizeToolbar(toolbar: any) {
    toolbar.showShareReportTab = true;
  }
}
