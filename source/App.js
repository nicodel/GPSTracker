enyo.kind({
  name: "App",
  kind: "FittableRows",
  classes: "onyx",
  published: {
    "tracename" : null,
    "opentrack" : [],
    "geo" : null,
    "point" : 0
  },
  components: [
    {kind: "onyx.Toolbar", content: "GPS Tracker"},
    {name: "topPanels", kind: "Panels", fit: true, components:[
      {kind: "enyo.Scroller", fit: true, components: [
      {name: "main", classes: "nice-padding", allowHtml: true},
      {kind: "onyx.Groupbox", classes: "groupbox enyo-center",components: [
        {kind: "onyx.GroupboxHeader", content: "Informations"},
        {kind: "FittableColumns", classes: "realvalues", components: [
          {content: "Latitude / Longitude:"},
          {name: "realposition", classes:"strong"}
        ]},
        {kind: "FittableColumns", classes: "realvalues", components: [
          {content: "Accuracy: "},
          {name: "realHprecision", classes:"strong"}
        ]},
        {kind: "FittableColumns", classes: "realvalues", components: [
          {content: "Altitude: "},
          {name: "realaltitude", classes:"strong"}
        ]},
        {kind: "FittableColumns", classes: "realvalues", components: [
          {content: "Altitude Accuracy: "},
          {name: "realVprecision", classes:"strong"}
        ]},
        {kind: "FittableColumns", classes: "realvalues", components: [
          {content: "Last update: "},
          {name: "realtime", classes:"strong"}
        ]},
        {kind: "FittableColumns", classes: "realvalues", components: [
          {content: "Speed: "},
          {name: "realspeed", classes:"strong"}
        ]},
        {kind: "FittableColumns", classes: "realvalues", components: [
          {content: "Duration: "},
          {name: "realduration", classes:"strong"}
        ]}
      ]},
      // {style:"border-radius:5px; padding:15px", components: [
        {kind: "onyx.Spinner", name: "gpsspinner", classes: "onyx-light enyo-center", showing: true},
      // ]},
      {name: "main", classes: "nice-padding", allowHtml: true},
      {kind: "FittableColumns", classes:"enyo-center", components: [
        {kind: "onyx.Button", name:"startbutton" ,classes:"onyx-affirmative button", disabled: false, content: "Start", ontap: "startWatch"},
        {kind: "onyx.Button", name:"stopbutton" ,classes: "onyx-negative button", disabled: true, content: "Stop", ontap: "stopWatch"}
      ]}
    ]},
      {name: "tracksPanel", kind: "Tracks"},
    ]}
    ,
    {fit: true},
    {kind: "jsdatabase", name: "db1", published: {database: ""}, onFailure: "dbFailure", onDel: "deleteResp",
 onMake: "makeSuccess", onInsert: "insertResp", onFind: "findmarkResponse"},
    {kind: "onyx.Toolbar", components: [
      {kind: "onyx.Button", name:"tracksbutton", content: "Details", ontap: "onTracks"},
      {kind: "onyx.Button", name:"homebutton", content: "Home", ontap: "onHome"}
    ]}
  ],
  create: function() {
    this.inherited(arguments);
    this.opentrack.track = [];
    this.$.topPanels.setIndex(0);
    this.$.realspeed.hide();
    this.$.realduration.hide();
    this.$.tracksbutton.setDisabled(true);
    this.$.homebutton.setDisabled(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        enyo.bind(this, "successCallback"),
        enyo.bind(this, "errorCallback"),
        {maximumAge: 180000, timeout: 60000, enableHighAccuracy: true}
      );
      // this.$.db1.make("track");
    } else {
      alert("Votre navigateur ne prend pas en compte la geolocalisation HTML5");
    }
  },
  startWatch: function(inSender, inEvent) {
    this.$.realspeed.show();
    this.$.realduration.show();
    this.opentrack.starttime = new Date().toString();
    this.geo = navigator.geolocation.watchPosition(
        enyo.bind(this, "appendTrack"),
        enyo.bind(this, "errorCallback"),
        {maximumAge: 1, timeout: 60000, enableHighAccuracy: true}
      );
    this.$.startbutton.setDisabled(true);
    this.$.stopbutton.setDisabled(false);
  },
  stopWatch: function(inSender, inEvent) {
    // this.$.geolocation.setWatch(false);
    this.opentrack.endtime = new Date().toString();
    navigator.geolocation.clearWatch(this.geo);
    this.$.startbutton.setDisabled(false);
    this.$.stopbutton.setDisabled(true);
    this.$.tracksbutton.setDisabled(false);
    this.point = 0;
    // alert("Stopped: ", this.$.db1);
  },
  // geofindMe: function(inSender) {
  // },
  successCallback: function(inPosition) {
    this.$.gpsspinner.hide();
    this.$.realposition.setContent(inPosition.coords.latitude + "° / " + inPosition.coords.longitude + "°");
    this.$.realHprecision.setContent(inPosition.coords.accuracy + "m");
    this.$.realaltitude.setContent(inPosition.coords.altitude +"m");
    this.$.realVprecision.setContent(inPosition.coords.altitudeAccuracy + "m");
    this.$.realtime.setContent(new Date(inPosition.timestamp));
    this.$.realspeed.setContent(inPosition.coords.speed );
    this.$.realduration.setContent();
  },
  appendTrack: function(inPosition) {
    if (!this.$.db1) {
      return;
    }
    if (this.tracename) {
      this.$.closeTrack();
    }
    console.log("Point: " + inPosition);
    // this.$.db1.insert(inPosition);
    // if (!this.opentrack.length) {
    //   var i = 0;
    // } else{
    //   var i = this.opentrack.length + 1;
    // }
    this.opentrack.track[this.point] = inPosition;
    console.log("this.point: ", this.point);
    this.point = this.point + 1;
    console.log("opentrack: ", this.opentrack);
    this.successCallback(inPosition);
  },
  errorCallback: function(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("L utilisateur n'a pas autorisé l accès à sa position");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("L emplacement de l utilisateur n a pas pu être déterminé");
        break;
      case error.TIMEOUT:
        alert("Le service n a pas répondu à temps");
        break;
    }
  },
  onTracks: function(inSender, inEvent) {
    this.$.tracksPanel.setDb(this.opentrack);
    this.$.topPanels.setIndex(1);
    this.$.tracksbutton.setDisabled(true);
    this.$.homebutton.setDisabled(false);

  },
  onHome: function(inSender, inEvent) {
    this.$.topPanels.setIndex(0);
    this.$.tracksbutton.setDisabled(false);
    this.$.homebutton.setDisabled(true);
    this.$.tracksPanel.destroyComponents();
    this.opentrack = [];
    this.opentrack.track = [];
  },
  closeTrack: function(){
    this.tracename = null;
  }
  });