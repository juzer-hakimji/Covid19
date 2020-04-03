import { AfterViewInit, Component, TemplateRef, ViewChild } from "@angular/core";
import { IgxGeographicHighDensityScatterSeriesComponent } from "igniteui-angular-maps";
import { IgxGeographicMapComponent } from 'igniteui-angular-maps';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild("map", {static: false})
  public map: IgxGeographicMapComponent;
  @ViewChild("template", {static: false})
  public tooltip: TemplateRef<object>;
  
  title = 'Covid-19 Dashboard';
  localData = [
    { Name:'John', Age: 29 },
    { Name:'Alice', Age: 27 },
    { Name:'Jessica', Age: 31 },
  ];


  public Confirmed
  public Deaths
  public Recovered;

  WorldConfirmed : number = 0;
  WorldDeaths : number = 0;
  WorldRecovered : number = 0;

  constructor() {
  }

  public ngAfterViewInit(): void {
      this.componentDidMount();
  }

  public componentDidMount() {
      // fetching JSON data with geographic locations from public folder
      let dte = new Date();
      dte.setDate(dte.getDate() - 1);
      fetch("assets/COVID-19/csse_covid_19_data/csse_covid_19_daily_reports/" +formatDate(dte, 'MM-dd-yyyy', 'en')+".csv")
          .then((response) => response.text())
          .then((data) => {this.onDataLoaded(data)
            this.onDataLoadedForList(data)
          });
  }

  public onDataLoaded(csvData: string) {
      const csvLines = csvData.split("\n");

      // parsing CSV data and creating geographic locations
      const geoLocations: any[] = [];
      for (let i = 1; i < csvLines.length; i++) {
          const columns = csvLines[i].split(",");
          const location = {
              // code: columns[4],
              country: columns[3],
              // density: Number(columns[6]),
              latitude:  Number(columns[5]),
              longitude: Number(columns[6]),
              name:  columns[3],
              // population: Number(columns[7]),
              state: columns[2],
              Confirmed : columns[7],
              Deaths : columns[8],
              Recovered : columns[9],
              Active : columns[10],
          };
          geoLocations.push(location);
      }

      // creating HD series with loaded data
      const geoSeries = new IgxGeographicHighDensityScatterSeriesComponent();
      geoSeries.dataSource = geoLocations;
      geoSeries.latitudeMemberPath  = "latitude";
      geoSeries.longitudeMemberPath = "longitude";
      geoSeries.heatMaximumColor = "Red";
      geoSeries.heatMinimumColor = "Black";
      geoSeries.heatMinimum = 0;
      geoSeries.heatMaximum = 5;
      geoSeries.pointExtent = 3;
      geoSeries.tooltipTemplate = this.tooltip;
      geoSeries.mouseOverEnabled = true;

      // adding symbol series to the geographic amp
      this.map.series.add(geoSeries);
  }

  public onDataLoadedForList(csvData: string) {
    const csvLines = csvData.split("\n");

    // parsing CSV data and creating geographic locations
    const TotalConfirmed: any[] = [];
    const TotalDeaths: any[] = [];
    const TotalRecovered: any[] = [];
    let USConfirmed : number = 0;
    let ChinaConfirmed : number = 0;
    let USDeaths : number = 0;
    let ChinaDeaths : number = 0;
    let USRecovered : number = 0;
    let ChinaRecovered : number = 0;
    
    for (let i = 1; i < csvLines.length; i++) {
        const columns = csvLines[i].split(",");
        if(columns.length > 1){
          if(columns[3] == 'US'){
            USConfirmed += +columns[7]
            USDeaths += +columns[8]
            USRecovered += +columns[9]
            this.WorldConfirmed += +columns[7]
            this.WorldDeaths += +columns[8]
            this.WorldRecovered += +columns[9]
          }
          else if(columns[3] == 'China'){
            ChinaConfirmed += +columns[7]
            ChinaDeaths += +columns[8]
            ChinaRecovered += +columns[9]
            this.WorldConfirmed += +columns[7]
            this.WorldDeaths += +columns[8]
            this.WorldRecovered += +columns[9]
          }
          else{
            const Conf = {
              country: columns[3],
              Confirmed : columns[7],
          };
          const Deat = {
            country: columns[3],
            Deaths : columns[8],
        };
        const Recov = {
          country: columns[3],
          Recovered : columns[9],
      };
          TotalConfirmed.push(Conf);
          TotalDeaths.push(Deat);
          TotalRecovered.push(Recov);
          this.WorldConfirmed += +columns[7]
          this.WorldDeaths += +columns[8]
          this.WorldRecovered += +columns[9]
          }
        }
        
    }
    const USAC = {
      country: 'US',
      Confirmed : USConfirmed,
  };
  const ChinaC = {
    country: 'China',
    Confirmed : ChinaConfirmed,
};
TotalConfirmed.unshift(USAC,ChinaC);
    this.Confirmed = TotalConfirmed;

    const USAD = {
      country: 'US',
      Deaths : USDeaths,
  };
  const ChinaD = {
    country: 'China',
    Deaths : ChinaDeaths,
};
TotalDeaths.unshift(USAD,ChinaD);
    this.Deaths = TotalDeaths;

    const USAR = {
      country: 'US',
      Recovered : USRecovered,
  };
  const ChinaR = {
    country: 'China',
    Recovered : ChinaRecovered,
};
TotalRecovered.unshift(USAR,ChinaR);
    this.Recovered = TotalRecovered;
}

}
