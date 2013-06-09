enyo.kind({
  name: "Tracks",
  kind: "FittableRows",
  classes: "onyx",
  published: {
    db: {}
  },
  components: [
  {kind: "Panels", fit: true, classes: "panels-sample-sliding-panels", arrangerKind: "CollapsingArranger", wrap: false, components: [
      {name: "left", components: [
        {name:"startText", content: "Start: "},
        {name:"endText", content: "End: "},
        {name: "mapImage", kind: "Image", style: "width: 100%;"},
        // {name: "theMap", kind: "nbt.OpenLayers", onReady: "onMapReady", fit: true}
        {kind:"Canvas", name:"mapConvas"}
      ]},
      {name: "body", fit: true, components: [
        {kind: "Scroller", classes: "enyo-fit", touch: true, components: [
          {classes: "panels-sample-sliding-content"}
        ]}
      ]}
  ]}
  ],
  create: function(inSender, inEvent) {
    this.inherited(arguments);
    // this.db = {};
  },
  rendered: function() {
    this.inherited(arguments);
    this.dbChanged();
  },

  dbChanged: function () {
    console.log("DB: ", this.db);
    console.log("Start: ", this.db.starttime);
    this.$.startText.setContent("Start: " + this.db.starttime);
    this.$.endText.setContent("End: " + this.db.endtime);


    if (this.db) {
    console.log("this.db.track", this.db.track);
    var lat = this.db.track[0].coords.latitude;
    var lon = this.db.track[0].coords.longitude;
    var i = 0;
    var dw = "";
    for (i = 0; i< this.db.track.length; i++) {
      lt = "&d0p"+ i + "lat=" + this.db.track[i].coords.latitude;
      ln = "&d0p"+ i + "lon=" + this.db.track[i].coords.longitude;
      dw = dw + ln + lt;
    }

    loc = "http://ojw.dev.openstreetmap.org/StaticMap/?lat="+ lat +"&lon="+ lon +"&mlat0="+ lat +"&mlon0="+ lon + dw + "&z=17&mode=Export&show=1";
    // loc = "http://ojw.dev.openstreetmap.org/StaticMap/?lat=48.856094338498&lon=2.3457956314087&z=17&mode=Export&mlat0=48.856235519591&mlon0=2.3458385467529&show=1";
    // "http://ojw.dev.openstreetmap.org/StaticMap/?lat=48.856094338498&lon=2.3457956314087&z=17&mode=Export&mlat0=48.856235519591&mlon0=2.3458385467529&d0p0lat=48.856171988148&d0p0lon=2.3431885242462&d0p1lat=48.856094338498&d0p1lon=2.3443365097046&d0p2lat=48.855939038836&d0p2lon=2.3453879356384&d0p3lat=48.856157870039&d0p3lon=2.3480594158173&dp_num=4&show=1"
    console.log("loc: ", loc);
    // this.$.mapConvas.setSrc(loc);
    this.$.mapImage.setSrc(loc);
    this.$.render;
    }
  }
});