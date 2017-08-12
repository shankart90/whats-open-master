import { Component } from 'react';
import Link from 'next/link';
import Head from '../components/head';
import GoogleMap from '../components/googlemap';

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
        value: ''
      };
    this.handleChange = this.handleChange.bind(this);
    //this.callback = this.callback.bind(this);
  }

  handleChange(event) {
    let currentTime = (event.target.value);
    let markers = this.state.markers;
    this.setState({value: event.target.value});

    var container = document.getElementById('search');
    const services = new google.maps.places.PlacesService(container);
    markers = markers.filter(place => (place.placeid));
    let openMarkers = [];

    const today = (new Date().getDay() + 6) % 7;
    const parseRangeTime = time => {
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if(AMPM == "PM" && hours<12) hours = hours+12;
      if(AMPM == "AM" && hours==12) hours = hours-12;
      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if(hours<10) sHours = "0" + sHours;
      if(minutes<10) sMinutes = "0" + sMinutes;
      //console.log(sHours + ":" + sMinutes);
      return (sHours + ":" + sMinutes +  ":" + "00")
    };

    let itemsProcessed = 0;

    markers.forEach((place,index) => {
      var request = {
        placeId: place.placeid
      };
      services.getDetails(request, (place, status) => {
        if(place != null){
          const checkVal = place.opening_hours.weekday_text[today].split(': ')[1];
          if(checkVal === "Open 24 hours"){
            openMarkers.push({
               position: place.geometry.location,
               content: place.name,
               key: place.id,
               placeid: place.place_id
             });
          }else{
              const [start, end] = checkVal.split(' – ');
              const isInRange =
                   currentTime >= parseRangeTime(start) &&
                   currentTime < parseRangeTime(end);
              if(isInRange === true){
                openMarkers.push({
                   position: place.geometry.location,
                   content: place.name,
                   key: place.id,
                   placeid: place.place_id
                 });
              }
          }
        }
        itemsProcessed++;
        if(itemsProcessed === markers.length) {
          this.callback();
        }
      });
    });

    // function callback(){
    //   console.log(openMarkers)
    // }
    callback = () => {
      console.log(this.state);
    }

  }

  componentDidMount() {
    // places service needs an HTML element to work
    var container = document.getElementById('search');
    const service = new google.maps.places.PlacesService(container);

    service.nearbySearch(
      {
        location: this.state.center,
        radius: 5000,
        type: ['restaurant'],
      },
      data => {
        if (data === null) {
          return;
        }
        //console.log(data);
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
       //console.log(markers);
       this.setState({ markers: this.state.markers.concat(markers) });
      }
    );
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
        value={this.state.value}
        onChange={this.handleChange}
      />

      </div>

    );
  }
}
