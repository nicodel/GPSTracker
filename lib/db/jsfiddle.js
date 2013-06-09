enyo.kind({
    name: "jsdatabase",
    kind: "Component",
    create: function() {
        this.inherited(arguments);
    },
    published: {
        databasename: ""
    },
    events: {
        onFailure: "",
        onMake: "",
        onFind: "",
        onDel: "",
        onInsert: ""
    },
    insert: function(data) {
        var currentdata = window.localStorage[this.databasename];
        if (currentdata == "ready" || currentdata == "") {
            currentdata = "";
            newdata = enyo.json.stringify(data);
            window.localStorage[this.databasename] = "[" + newdata + "]";
        }
        else {
            currentdata = enyo.json.parse(window.localStorage[this.databasename]);

            currentdata.push(data);
            console.log(enyo.json.stringify(currentdata));

            window.localStorage[this.databasename] = enyo.json.stringify(currentdata);
        }
        //var id = '{"' + num + '" :' +  enyo.json.stringify(data) + "}";
        //var newdata = enyo.mixin(currentdata, data);  //enyo.json.parse(id)
        this.doInsert({
            response: "Inserted"
        });
    },
    delete: function(data) {
        var currentdata = enyo.json.parse(window.localStorage[this.databasename]);
        currentdata.splice(data, 1);
        window.localStorage[this.databasename] = enyo.json.stringify(currentdata);
        this.doDel({
            response: "Deleted."
        });
    },
    find: function(data, key) {
        if (data == "" || data == undefined) {
            var currentdata = window.localStorage[this.databasename];
            if (currentdata == "ready" || currentdata == "" ) {
                this.doFind({
                    response: "No data."
                });
            } else {
                this.doFind({
                    response: enyo.json.parse(window.localStorage[this.databasename])
                });
            }
        }
        else {
            var currentdata = enyo.json.parse(window.localStorage[this.databasename]);
            for (k = 1; k < currentdata.length; ++k) {
                var fd = [];
                var i = 0;
                if (currentdata[k][data] == key || currentdata[k][data].match(key)) {
                    fd[i] = k;
                    i = i + 1;
                }
            }
            if (fd == "") {
                this.doFind({
                    response: "Nothing found."
                });
            }
            for (l = 0; l < fd.length; l++) {
                returndata[l] = currentdata[fd[l]];
            }
            /*this.doFind({
                "response": {
                    "data": returndata},
                {
                    "ids": fd}
            });*/
        }
    },
    make: function(data) {
        try {
            if (window.localStorage[data]) {
                if (window.localStorage[data] == "ready") {
                    this.databasename = data;
                    this.doMake({
                        response: "opened"
                    });
                    return true;
                }
                else {
                    var currentdata = enyo.json.parse(window.localStorage[data]);
                    this.databasename = data;
                    this.doMake({
                        response: "Opened"
                    });
                }
            }
            else {

                window.localStorage[data] = "ready";
                this.databasename = data;
                this.doMake({
                    response: "Created."
                });
            }
        }
        catch (e) {
            this.doFailure({
                response: "Error setting up."
            });
        }
    }
});

enyo.kind({
    name: "dbtest",
    kind: enyo.Control,
    events: {
        onPush: ""
    },
    components: [
        {
        kind: "jsdatabase",
        name: "db1",
        published: {
            database: "bookmark"
        },
        onFailure: "dbFailure",
        onDel: "deletemarkResponse",


        onMake: "putmarkKindSuccess",
        onInsert: "insertmarkresp",
        onFind: "findmarkResponse"},

    {
        kind: "Control",
        name: "confirm",
        
        components: [
            {content: "Delete confirm: Are you sure?"},{
            kind: "Button",
            content: "Yes",

            classes: "enyo-button-negative",
            onclick: "deletebookentry"},
        {
            kind: "Button",
            content: "No",
            classes: "enyo-button-affirmative",
            onclick: "ignore"}]},
    {
        kind: "Control",
        name: "alert",
        content: "Message",
        components: [{
            name: "alertmess",
            kind: "Control"},
        {
            kind:

            "Button",
            content: "Ok.",
            onclick: "clear"}]},

    {
        kind: "Input",
        name: "input"},
    {
        kind: "Button",
        name: "bookset",
        content:

        "Insert",
        onclick: "insertmarks"},
    {
        kind: "Button",
        content: "Show DB",
        onclick: "findmarks"},
    {
        name: "listm",
        kind: "Repeater",
        rows: 0,
        style: "width: 500px; height: 200px;",
        onSetupRow: "listmSetupRow",

        onclick: "gomark",
        components: [
            {
            name: "bookmark"},


        {
            kind: "Button",
            content: "delete",
            name: "delbutton",
            onclick: "confirmation",
            row: ""}


        ]}
          ], create: function() {
    this.inherited(arguments);
    this.$.db1.make("bookmark"); //{owner: enyo.fetchAppId()}
},
putmarkKindSuccess: function() {

    enyo.log("made mark success!");


},


insertmarks: function() {

    enyo.log("setting up...");
    //this.$.insertmark.setMethod("put");
    var data = this.formatmData(this.$.input.eventNode.value);
    this.$.db1.insert(data);

   // this.$.markpopup.hide();

},

insertmarkresp: function() {

    console.log("insert success");

    this.$.alert.show();
    this.$.alertmess.setContent("Saved.");
},

formatmData: function(data) {


    var a = {};
    enyo.log(this.query);
    a = {
        name: data
    };


    return a;

},



findmarks: function() {



    this.listmQuery();

},

listmQuery: function(inSender, inQuery) {

    var fquery = ""; //{"from":"enyo.otgmark:1"};
    this.$.db1.find(); //({query: fquery});
},

findmarkResponse: function(inSender, inResponse, inRequest) {

    console.log("find success");
    this.results1 = inResponse.response;
    if (this.results1 != "No data.") {
        this.$.listm.setRows(this.results1.length);
        this.$.listm.build();
        this.$.listm.render();            
    }
},

// any error we just log to the console for debugging
dbFailure: function(inSender, inResponse) {

    enyo.log(inResponse.response);
    this.$.alert.show();
    this.$.alertmess.setContent("Error: " + inError);

},
listmSetupRow: function(inSender, inIndex) {

    if (this.results1) {
        var r = this.results1[inIndex.index];

        if (r) {

            var rowControl = inIndex.row;
            rowControl.$.bookmark.setContent(r.name);
            rowControl.$.delbutton.row = inIndex.index;
            return true;


        }


    }
},
gomark: function(inSender, inEvent) {
    this.query = this.results1[inEvent.originator.row].name;
    this.id = this.results1[inEvent.originator.row];
    console.log(this.id);
    this.doPush({
        value: this.query
    });
},
deletebookentry: function() {
    this.$.db1.delete(this.id2);
   // this.$.confirm.hide();
},
deletemarkResponse: function(inSender, inResponse, inRequest) {
    console.log("delete occurred");
    this.$.alert.show();
    this.$.alertmess.setContent("Deleted.");
    this.findmarks(this.query);
},
confirmation: function(inSender, inEvent) {
    this.id2 = inEvent.originator.row;
    console.log(this.id2);
    //this.$.confirm.show();
    return true;
},
clear: function() {
    //this.$.alert.hide();
},
ignore: function() {
    //this.$.confirm.hide();
}
});
new dbtest().renderInto(document.body);