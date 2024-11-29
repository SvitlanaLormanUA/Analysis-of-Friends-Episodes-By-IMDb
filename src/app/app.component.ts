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

  report = {
    dataSource: {
      type: 'json',
      data: friends_info,
    },
    slice: {
      rows: [{ uniqueName: 'directed_by' }],
      columns: [{ uniqueName: 'title' }],
      measures: [{ uniqueName: 'imdb_rating' }],
    },
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
    this.pivotRef.flexmonster.off('reportcomplete');
    const processedData = this.processData(friends_info);
    this.createChart(processedData);
  }

  processData(data: any[]) {
    const groupedData: { [key: string]: number[] } = {};

    data.forEach((episode) => {
      const director = episode.directed_by;
      const rating = episode.imdb_rating;

      if (!groupedData[director]) {
        groupedData[director] = [];
      }

      groupedData[director].push(rating);
    });

    const averageRatings = Object.entries(groupedData).map(([director, ratings]) => {
      const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      return { director, averageRating: parseFloat(averageRating.toFixed(2)) };
    });

    return averageRatings;
  }

  createChart(data: { director: string; averageRating: number }[]) {
    const categories = data.map((item) => item.director);
    const seriesData = data.map((item) => item.averageRating);

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
          type: 'column', // Вказуємо тип серії
          name: 'Average Rating',
          data: seriesData,
          color: '#7cb5ec',
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
