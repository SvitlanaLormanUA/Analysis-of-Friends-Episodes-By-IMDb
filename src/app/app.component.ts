import { Component, ViewChild, OnInit } from '@angular/core';
import { FlexmonsterPivot } from 'ngx-flexmonster';
import * as Highcharts from 'highcharts';
import "flexmonster/lib/flexmonster.highcharts.js";
import friends_info from './_files/friends_info.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'flexmonster-project';
  @ViewChild('pivot') pivotRef!: FlexmonsterPivot;

  report: any;

  constructor() {}

  ngOnInit(): void {
    this.generateReport(friends_info);
  }

  generateReport(data: any[]) {
    const processedData = this.processData(data);

    this.report = {
      dataSource: {
        type: 'json',
        data: processedData,
      },
      formats: [
        {
          name: "",
           decimalPlaces: 2,
        }
      ],
      options: {
        grid: {
          showTotals: "off",
          showGrandTotals: "off"
       }
      },
      slice: {
        rows: [
          { uniqueName: 'director' },
          { uniqueName: 'title' },
        ],
        columns: [],
        measures: [
          {
            uniqueName: 'average_imdb_rating',
            aggregation: 'average',
          },
        ],
      
      },
    };

    if (this.pivotRef) {
      this.pivotRef.flexmonster.setReport(this.report); // Set the report
    }
  }

  processData(data: any[]) {
    const processedData: { director: string, title: string, average_imdb_rating: number }[] = [];

    data.forEach((episode) => {
      const director = episode.directed_by;
      const episodeTitle = episode.title;
      const rating = episode.imdb_rating;

      processedData.push({
        director,
        title: episodeTitle,
        average_imdb_rating: rating,
      });
    });

    return processedData;
  }

  customizeToolbar(toolbar: any) {
    toolbar.showShareReportTab = true;
  }

  onReportComplete() {
    this.pivotRef.flexmonster.off('reportcomplete');
    const processedData = this.processData(friends_info);
    this.createChart(processedData);
  }
 customizeCellFunction(cell: Flexmonster.CellBuilder, data: Flexmonster.CellData) {
  if (data.measure && data.measure.uniqueName === "average_imdb_rating") {
    if ((data.value ?? 0) > 8.5) {
      cell.addClass("alter");
    } else {
      return;
    }
  }
}
  
  createChart(data: { director: string; title: string; average_imdb_rating: number }[]) {
    const categories = data.map((item) => item.director);
    const seriesData = data.map((item) => item.average_imdb_rating);
    const titles = data.map((item) => item.title);
    const ratings = data.map((item) => item.average_imdb_rating);

    Highcharts.chart('chartContainer', {
      chart: {
        type: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        spacing: [20, 20, 20, 20],
        style: {
          fontFamily: 'Verdana, sans-serif',
        },
      },
      title: {
        text: 'Average IMDb Ratings by Director',
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333333',
        },
      },
      subtitle: {
        text: 'Analysis of Friends episodes',
        style: {
          fontSize: '14px',
          color: '#666666',
        },
      },
      xAxis: {
        categories,
        title: {
          text: 'Directors',
          style: { fontSize: '16px', color: '#333333' },
        },
        labels: {
          style: { fontSize: '12px', color: '#555555' },
          rotation: -45,
        },
      },
      yAxis: {
        title: {
          text: 'Average IMDb Rating',
          style: { fontSize: '16px', color: '#333333' },
        },
        gridLineColor: '#e0e0e0',
        labels: {
          style: { fontSize: '12px', color: '#555555' },
        },
      },
      series: [
        {
          type: 'column',
          name: 'Average Rating',
          data: seriesData,
          color: '#7cb5ec',
          tooltip: {
            pointFormatter: function () {
              const episodeIndex = this.index;
              return `
                <b>Episode: ${titles[episodeIndex]}</b><br>
                IMDb Rating: ${ratings[episodeIndex]}
              `;
            },
          },
        },
      ],
      plotOptions: {
        column: {
          borderRadius: 3,
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '12px',
              color: '#333333',
            },
          },
        },
      },
      legend: {
        itemStyle: {
          fontSize: '14px',
          color: '#333333',
        },
        itemHoverStyle: {
          color: '#000000',
        },
      },
    });
  }
}
