import { Component, ViewChild, OnInit } from '@angular/core';
import { FlexmonsterPivot } from 'ngx-flexmonster';
import * as Highcharts from 'highcharts';
// import HC_more from 'highcharts/highcharts-more'; // For Highcharts-more
// import HC_accessibility from 'highcharts/modules/accessibility'; // For accessibility
import "flexmonster/lib/flexmonster.highcharts.js";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,  // Make this component standalone
})
export class AppComponent implements OnInit {
  title = 'flexmonster-project';
  @ViewChild('pivot') pivotRef!: FlexmonsterPivot;

  report = {
    dataSource: {
      type: 'json',
      fileName: '../assets/friends_info.json'
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

  onReportComplete() {
    this.pivotRef.flexmonster.off("reportcomplete");
    this.createChart(this.pivotRef.flexmonster);
  }

  // Method to create Highcharts after Flexmonster loads
  createChart(pivot: any) {
    pivot.highcharts.getData(
      { type: "line" },
      (chartConfig: any) => {
        Highcharts.chart('chartContainer', chartConfig);
      }
    );
  }
}
