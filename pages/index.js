//import 'rc-time-picker/assets/index.css';

import { Component } from 'react';
import Link from 'next/link';
import Head from '../components/head';
import GoogleMap from '../components/googlemap';


function onChange(value) {
  console.log(value && value.format(str));
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [
          {
            position: {
              lat: 37.792015,
              lng: -122.401695,
            },
            key: 'hq',
            content: 'Restocks HQ',
            defaultAnimation: 2,
          },
        ],
        center: { lat: 37.792015, lng: -122.401695 },
        timeValue: ''
      };
  }

  loadMarkers = (service) => {
    service.nearbySearch({
        location: this.state.center,
        radius: 5000,
        type: ['restaurant'],
      },function(data) {
            if(data === null) {return;}
            console.log("All restaurant:", data)
            let markers = data.filter(place => (place.opening_hours &&
              place.opening_hours.open_now));
            markers = markers.map(place => {
                //console.log(place)
                 return {
                  position: place.geometry.location,
                  content: place.name,
                  key: place.id,
                  placeid: place.place_id
                };
            });
           //avoiding callback set first time
           if(this.state.markers.length <= 1){
             this.setState({ markers: this.state.markers.concat(markers) });
           }
           console.log("Open restaurant:", markers);
           console.log("\n");
       }.bind(this));
   }

  handleChange = (event) => {
    let currentTime = (event.target.value);
    let markers = this.state.markers;
    this.setState({timeValue: event.target.value});

    let container = document.getElementById('search');
    const service = new google.maps.places.PlacesService(container);
    this.loadMarkers(service);

    //filters markers with only placeid
    markers = markers.filter(place => (place.placeid));
    let openMarkers = [];

    const today = (new Date().getDay() + 6) % 7;
    const checkTime = time => {
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        console.log("hours:minutes", hours:minutes);
        var AMPM = '';
        if((time.includes('PM') === true) || (time.includes('AM')=== true)){
            AMPM = time.match(/([AaPp][Mm])$/)[1];
        }else{AMPM = 'PM'}//missing AMPM in api req
        console.log("AMPM:",AMPM);
        if(AMPM == "PM" && hours<12) hours = hours+12;
        if(AMPM == "AM" && hours==12) hours = hours+24;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if(hours<10) sHours = "0" + sHours;
        if(minutes<10) sMinutes = "0" + sMinutes;
        console.log("sHours + ":" + sMinutes", sHours + ":" + sMinutes);
        return (sHours + ":" + sMinutes +  ":" + "00")
    };

    let itemsProcessed = 0;

    markers.forEach((place,index) => {
      var request = {
        placeId: place.placeid
      };
      service.getDetails(request, (place, status) => {
        if(place != null){
          let checkHours = place.opening_hours.weekday_text[today].split(': ')[1];
          if(checkHours === "Open 24 hours"){
            openMarkers.push({
               position: place.geometry.location,
               content: place.name,
               key: place.id,
               placeid: place.place_id
             });
          }
          else{
              console.log("checkHours:", checkHours);
              checkHours = checkHours.split(',');
              checkHours.forEach((element) => {
                  console.log("element:", element);
                  let [start, end] = element.split(' – ');
                  console.log("start, end:", start, end)
                  start = start.replace(/\s/g, '');
                  end = end.replace(/\s/g, '');
                  const isInRange =
                       currentTime >= checkTime(start) &&
                       currentTime <= checkTime(end);
                  if(isInRange === true){
                    openMarkers.push({
                       position: place.geometry.location,
                       content: place.name,
                       key: place.id,
                       placeid: place.place_id
                     });
                  }
                  console.log("checkTime(start)", checkTime(start),
                              "currentTime", currentTime,
                              "checkTime(end)", checkTime(end));
                  console.log("isInRange", isInRange);
                  console.log('\n')
              });//checkHours
          }//else
        }
        itemsProcessed++;
        if(itemsProcessed === markers.length) {
          setMarkers();
        }
      });
    });
    let setMarkers = () => {
      this.setState({ markers: openMarkers });
      console.log("Restaurants open now", openMarkers);
    }
  }

  componentDidMount() {
    // places service needs an HTML element to work
    let container = document.getElementById('search');
    const service = new google.maps.places.PlacesService(container);
    this.loadMarkers(service)
   }

  render() {
    const { markers, center } = this.state;
    return (
      <div>
       <Head title="What's open?" />
       <GoogleMap
         className="map"
         markers={markers}
         center={center}
       />
       <div id="search"
       />
       <style jsx>{`
         .map {
           height: 100%;
           width: 100%;
         }
       `}</style>

      <input type='time'
        step='1' min="00:00:00" max="20:00:00"
        value={this.state.timeValue}
        onChange={this.handleChange.bind(this)}
      />

      </div>

    );
  }
}
