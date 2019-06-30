let dataShard0 = function() {
    global.shardData = {
        estSecPerTick: 5.725 // NOTE: Last updated 2019/06/29
        , rooms: {
            W86N29: {
                harvestRooms: [
                    "W85N29"
                    , "W86N28"
                    , "W87N29"
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 1 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 1 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 4 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 } // set dynamically
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 } // set dynamically
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W85N23"
                    //, "W81N29"
                    //, "W72N28"
                    , "W64N31"
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W81N29"
                    }
                }
                , sources: [
                    {
                        id: "5873bbab11e3e4361b4d63fc"
                        , pos: {
                            roomName: "W86N29"
                            , x: 34
                            , y: 13
                        }
                    }
                    , {
                        id: "5873bbab11e3e4361b4d63fd"
                        , pos: {
                            roomName: "W86N29"
                            , x: 39
                            , y: 30
                        }
                    }
                ]
            }
            , W85N29: {
                controller: {
                    id: "5873bbc811e3e4361b4d675d"
                    , pos: {
                        roomName: "W85N29"
                        , x: 20
                        , y: 31
                    }
                }
                , sources: [
                    {
                        id: "5873bbc811e3e4361b4d675b"
                        , pos: {
                            roomName: "W85N29"
                            , x: 23
                            , y: 9
                        }
                    }
                    , {
                        id: "5873bbc811e3e4361b4d675c"
                        , pos: {
                            roomName: "W85N29"
                            , x: 42
                            , y: 14
                        }
                    }
                ]
            }
            , W86N28: {
                sources: [
                    {
                        id: "5873bbab11e3e4361b4d6400"
                        , pos: {
                            roomName: "W86N28"
                            , x: 18
                            , y: 8
                        }
                    }
                ]
            }
            , W87N29: {
                sources: [
                    {
                        id: "5873bb9511e3e4361b4d6159"
                        , pos: {
                            roomName: "W87N29"
                            , x: 13
                            , y: 25
                        }
                    }
                    , {
                        id: "5873bb9511e3e4361b4d6157"
                        , pos: {
                            roomName: "W87N29"
                            , x: 3
                            , y: 14
                        }
                    }
                ]
            }
            , W85N23: {
                harvestRooms: [
                    "W84N23"
                    , "W86N23"
                    , "W85N25"
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 0 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 1 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 4 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W86N29"
                ]
                , sources: [
                    {
                        id: "5873bbc911e3e4361b4d677e"
                        , pos: {
                            roomName: "W85N23"
                            , x: 32
                            , y: 46
                        }
                    }
                    , {
                        id: "5873bbc911e3e4361b4d677d"
                        , pos: {
                            roomName: "W85N23"
                            , x: 22
                            , y: 45
                        }
                    }
                ]
            }
            , W84N23: {
                controller: {
                    id: "5873bbe111e3e4361b4d6ac5"
                    , pos: {
                        roomName: "W84N23"
                        , x: 23
                        , y: 22
                    }
                }
                , sources: [
                    {
                        id: "5873bbe111e3e4361b4d6ac4"
                        , pos: {
                            roomName: "W84N23"
                            , x: 3
                            , y: 3
                        }
                    }
                ]
            }
            , W86N23: {
                sources: [
                    {
                        id: "5873bbac11e3e4361b4d6423"
                        , pos: {
                            roomName: "W86N23"
                            , x: 32
                            , y: 10
                        }
                    }
                    , {
                        id: "5873bbac11e3e4361b4d6424"
                        , pos: {
                            roomName: "W86N23"
                            , x: 45
                            , y: 16
                        }
                    }
                ]
            }
            , W85N25: {
                sources: [
                    {
                        id: "5873bbc911e3e4361b4d676e"
                        , pos: {
                            roomName: "W85N25"
                            , x: 4
                            , y: 8
                        }
                    }
                    , {
                        id: "5873bbc911e3e4361b4d676f"
                        , pos: {
                            roomName: "W85N25"
                            , x: 36
                            , y: 11
                        }
                    }
                    , {
                        id: "5873bbc911e3e4361b4d6770"
                        , pos: {
                            roomName: "W85N25"
                            , x: 32
                            , y: 37
                        }
                    }
                ]
            }
            , W9N45: {
                harvestRooms: [
                    "W9N44"
                    , "W8N45"
                    , "W9N46"
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 1 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 1 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 5 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W9N45"
                ]
                , controller: {
                    id: "577b935b0f9d51615fa48076"
                    , pos: {
                        roomName: "W9N45"
                        , x: 26
                        , y: 37
                    }
                }
                , controllerToSource: 3
                , waypointsFor: [
                    "adaptable"
                    , "claimer"
                    , "exporter"
                ]
                , canDemolishIn: true
                , sources: [
                    {
                        id: "577b935b0f9d51615fa48074"
                        , pos: {
                            roomName: "W9N45"
                            , x: 38
                            , y: 15
                        }
                    }
                    , {
                        id: "577b935b0f9d51615fa48075"
                        , pos: {
                            roomName: "W9N45"
                            , x: 23
                            , y: 37
                        }
                    }
                ]
            }
            , W9N44: {
                controller: {
                    id: "577b935b0f9d51615fa4807a"
                    , pos: {
                        roomName: "W9N44"
                        , x: 44
                        , y: 31
                    }
                }
                , sources: [
                    {
                        id: "577b935b0f9d51615fa48078"
                        , pos: {
                            roomName: "W9N44"
                            , x: 42
                            , y: 11
                        }
                    }
                    , {
                        id: "577b935b0f9d51615fa48079"
                        , pos: {
                            roomName: "W9N44"
                            , x: 27
                            , y: 21
                        }
                    }
                ]
            }
            , W8N45: {
                sources: [
                    {
                        id: "577b935d0f9d51615fa480ba"
                        , pos: {
                            roomName: "W8N45"
                            , x: 30
                            , y: 22
                        }
                    }
                ]
            }
            , W9N46: {
                sources: [
                    {
                        id: "577b935b0f9d51615fa48071"
                        , pos: {
                            roomName: "W9N46"
                            , x: 8
                            , y: 14
                        }
                    }
                ]
            }
            , W81N29: {
                /*harvestRooms: [
                    "W81N28"
                    , "W82N29"
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 0 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 0 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 6 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 4 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , */creepMemory: {
                    claimer: {
                        roomSentTo: "W72N28"
                    }
                }
                , controller: {
                    id: "5873bc2711e3e4361b4d7257"
                    , pos: {
                        roomName: "W81N29"
                        , x: 34
                        , y: 31
                    }
                }
                , canDemolishIn: true
                , sources: [
                    {
                        id: "5873bc2711e3e4361b4d7255"
                        , pos: {
                            roomName: "W81N29"
                            , x: 4
                            , y: 11
                        }
                    }
                    , {
                        id: "5873bc2711e3e4361b4d7256"
                        , pos: {
                            roomName: "W81N29"
                            , x: 9
                            , y: 30
                        }
                    }
                ]
            }
            , W81N28: {
                controller: {
                    id: "5873bc2811e3e4361b4d725a"
                    , pos: {
                        roomName: "W81N28"
                        , x: 10
                        , y: 38
                    }
                }
                , sources: [
                    {
                        id: "5873bc2811e3e4361b4d7259"
                        , pos: {
                            roomName: "W81N28"
                            , x: 22
                            , y: 30
                        }
                    }
                ]
            }
            , W82N29: {
                sources: [
                    {
                        id: "5873bc1011e3e4361b4d7004"
                        , pos: {
                            roomName: "W82N29"
                            , x: 17
                            , y: 17
                        }
                    }
                ]
            }
            , W72N28: { // owned by demawi
                /*harvestRooms: [
                    "W71N28"
                    , "W72N29"
                    , "W73N28"
                    , "W72N27"
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 0 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 0 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 6 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , */creepMemory: {
                    claimer: {
                        roomSentTo: "W64N31"
                    }
                }
                , controller: {
                    id: "5836b6eb8b8b9619519ef910"
                    , pos: {
                        roomName: "W72N28"
                        , x: 17
                        , y: 36
                    }
                }
                , controllerToSource: 3
                , canDemolishIn: true
                , sources: [
                    {
                        id: "5836b6eb8b8b9619519ef90e"
                        , pos: {
                            roomName: "W72N28"
                            , x: 20
                            , y: 32
                        }
                    }
                    , {
                        id: "5836b6eb8b8b9619519ef90f"
                        , pos: {
                            roomName: "W72N28"
                            , x: 20
                            , y: 35
                        }
                    }
                ]
            }
            , W71N28: {
                controller: {
                    id: "5836b7008b8b9619519efb11"
                    , pos: {
                        roomName: "W71N28"
                        , x: 11
                        , y: 31
                    }
                }
                , sources: [
                    {
                        id: "5836b7008b8b9619519efb10"
                        , pos: {
                            roomName: "W71N28"
                            , x: 14
                            , y: 17
                        }
                    }
                    , {
                        id: "5836b7008b8b9619519efb12"
                        , pos: {
                            roomName: "W71N28"
                            , x: 20
                            , y: 33
                        }
                    }
                ]
            }
            , W72N29: {
                sources: [
                    {
                        id: "5836b6eb8b8b9619519ef90a"
                        , pos: {
                            roomName: "W72N29"
                            , x: 21
                            , y: 7
                        }
                    }
                    , {
                        id: "5836b6eb8b8b9619519ef90c"
                        , pos: {
                            roomName: "W72N29"
                            , x: 40
                            , y: 9
                        }
                    }
                ]
            }
            , W73N28: {
                sources: [
                    {
                        id: "5836b6d58b8b9619519ef709"
                        , pos: {
                            roomName: "W73N28"
                            , x: 33
                            , y: 24
                        }
                    }
                ]
            }
            , W72N27: {
                sources: [
                    {
                        id: "5836b6eb8b8b9619519ef913"
                        , pos: {
                            roomName: "W72N27"
                            , x: 21
                            , y: 46
                        }
                    }
                ]
            }
            , W64N31: {
                harvestRooms: [
                    "W64N32"
                    , "W63N31"
                    //, "W65N31" // remote mined by Pimaco
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 0 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 1 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 3 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W86N29"
                    //, "W55N31"
                    , "W53N39"
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W55N31"
                    }
                }
                , controller: {
                    id: "57ef9cad86f108ae6e60ca55"
                    , pos: {
                        roomName: "W64N31"
                        , x: 30
                        , y: 16
                    }
                }
                , controllerToSource: 3
                , sources: [
                    {
                        id: "57ef9cad86f108ae6e60ca54"
                        , pos: {
                            roomName: "W64N31"
                            , x: 40
                            , y: 8
                        }
                    }
                    , {
                        id: "57ef9cad86f108ae6e60ca56"
                        , pos: {
                            roomName: "W64N31"
                            , x: 30
                            , y: 18
                        }
                    }
                ]
            }
            , W64N32: {
                controller: {
                    id: "57ef9cad86f108ae6e60ca51"
                    , pos: {
                        roomName: "W64N32"
                        , x: 31
                        , y: 28
                    }
                }
                , sources: [
                    {
                        id: "57ef9cad86f108ae6e60ca52"
                        , pos: {
                            roomName: "W64N32"
                            , x: 19
                            , y: 38
                        }
                    }
                    , {
                        id: "57ef9cad86f108ae6e60ca50"
                        , pos: {
                            roomName: "W64N32"
                            , x: 46
                            , y: 16
                        }
                    }
                ]
            }
            , W63N31: {
                sources: [
                    {
                        id: "57ef9cc386f108ae6e60ccb7"
                        , pos: {
                            roomName: "W63N31"
                            , x: 4
                            , y: 8
                        }
                    }
                ]
            }
            , W65N31: {
                sources: [
                    {
                        id: "57ef9c9886f108ae6e60c7d9"
                        , pos: {
                            roomName: "W65N31"
                            , x: 26
                            , y: 42
                        }
                    }
                ]
            }
            , W55N31: { // owned by steamingpile02
                /*harvestRooms: [
                    "W56N31"
                    , "W54N31"
                    , "W55N32"
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 0 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 0 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 4 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 0 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , */creepMemory: {
                    claimer: {
                        roomSentTo: "W53N39"
                    }
                }
                , controller: {
                    id: "579fa8950700be0674d2de54"
                    , pos: {
                        roomName: "W55N31"
                        , x: 27
                        , y: 42
                    }
                }
                , controllerToSource: 3
                , canDemolishIn: true
                , sources: [
                    {
                        id: "579fa8950700be0674d2de53"
                        , pos: {
                            roomName: "W55N31"
                            , x: 33
                            , y: 6
                        }
                    }
                    , {
                        id: "579fa8950700be0674d2de55"
                        , pos: {
                            roomName: "W55N31"
                            , x: 27
                            , y: 44
                        }
                    }
                ]
            }
            , W56N31: {
                controller: {
                    id: "579fa8950700be0674d2de54"
                    , pos: {
                        roomName: "W56N31"
                        , x: 5
                        , y: 10
                    }
                }
                , sources: [
                    {
                        id: "579fa8850700be0674d2dc0f"
                        , pos: {
                            roomName: "W56N31"
                            , x: 46
                            , y: 24
                        }
                    }
                ]
            }
            , W54N31: {
                sources: [
                    {
                        id: "579fa8a60700be0674d2e07b"
                        , pos: {
                            roomName: "W54N31"
                            , x: 5
                            , y: 27
                        }
                    }
                    , {
                        id: "579fa8a60700be0674d2e07c"
                        , pos: {
                            roomName: "W54N31"
                            , x: 7
                            , y: 41
                        }
                    }
                ]
            }
            , W55N32: {
                sources: [
                    {
                        id: "579fa8950700be0674d2de50"
                        , pos: {
                            roomName: "W55N32"
                            , x: 27
                            , y: 40
                        }
                    }
                    , {
                        id: "579fa8950700be0674d2de51"
                        , pos: {
                            roomName: "W55N32"
                            , x: 6
                            , y: 46
                        }
                    }
                ]
            }
            , W53N39: {
                harvestRooms: [
                    "W54N39"
                    //, "W53N38" // owned by Donatzor
                    //, "W52N39" // remote mined by Donatzor
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 0 }
                    , { type: STRUCTURE_RAMPART, min: 1 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 1 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 5 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 1 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W64N31"
                    , "W52N47"
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W53N42"
                    }
                    , demolisher: {
                        roomSentTo: "W48N42"
                    }
                }
                , controller: {
                    id: "579fa8b40700be0674d2e27f"
                    , pos: {
                        roomName: "W53N39"
                        , x: 11
                        , y: 38
                    }
                }
                , controllerToSource: 3
                , waypointsFor: [
                    "adaptable"
                    , "exporter"
                ]
                , sources: [
                    {
                        id: "579fa8b40700be0674d2e27d"
                        , pos: {
                            roomName: "W53N39"
                            , x: 18
                            , y: 15
                        }
                    }
                    , {
                        id: "579fa8b40700be0674d2e27e"
                        , pos: {
                            roomName: "W53N39"
                            , x: 9
                            , y: 38
                        }
                    }
                ]
            }
            , W54N39: {
                controller: {
                    id: "579fa8a50700be0674d2e04b"
                    , pos: {
                        roomName: "W54N39"
                        , x: 34
                        , y: 21
                    }
                }
                , sources: [
                    {
                        id: "579fa8a50700be0674d2e04c"
                        , pos: {
                            roomName: "W54N39"
                            , x: 17
                            , y: 38
                        }
                    }
                    , {
                        id: "579fa8a50700be0674d2e04d"
                        , pos: {
                            roomName: "W54N39"
                            , x: 17
                            , y: 42
                        }
                    }
                ]
            }
            , W53N38: {
                sources: [
                    {
                        id: "579fa8b40700be0674d2e283"
                        , pos: {
                            roomName: "W53N38"
                            , x: 31
                            , y: 29
                        }
                    }
                    , {
                        id: "579fa8b40700be0674d2e281"
                        , pos: {
                            roomName: "W53N38"
                            , x: 29
                            , y: 17
                        }
                    }
                ]
            }
            , W52N39: {
                sources: [
                    {
                        id: "579fa8c50700be0674d2e400"
                        , pos: {
                            roomName: "W52N39"
                            , x: 24
                            , y: 15
                        }
                    }
                    , {
                        id: "579fa8c50700be0674d2e402"
                        , pos: {
                            roomName: "W52N39"
                            , x: 22
                            , y: 40
                        }
                    }
                ]
            }
            , W52N47: {
                harvestRooms: [
                    "W51N47"
                    , "W53N47"
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 1 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 1 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 6 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W53N39"
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W48N52"
                    }
                    , demolisher: {
                        roomSentTo: "W48N51"
                    }
                    , exporter: {
                        roomSentFrom: "W49N51"
                    }
                }
                , controller: {
                    id: "579fa8c40700be0674d2e3e9"
                    , pos: {
                        roomName: "W52N47"
                        , x: 35
                        , y: 28
                    }
                }
                , controllerToSource: 3
                , sources: [
                    {
                        id: "579fa8c40700be0674d2e3e8"
                        , pos: {
                            roomName: "W52N47"
                            , x: 3
                            , y: 12
                        }
                    }
                    , {
                        id: "579fa8c40700be0674d2e3ea"
                        , pos: {
                            roomName: "W52N47"
                            , x: 34
                            , y: 32
                        }
                    }
                ]
            }
            , W51N47: {
                controller: {
                    id: "579fa8d40700be0674d2e575"
                    , pos: {
                        roomName: "W51N47"
                        , x: 29
                        , y: 32
                    }
                }
                , sources: [
                    {
                        id: "579fa8d40700be0674d2e574"
                        , pos: {
                            roomName: "W51N47"
                            , x: 10
                            , y: 25
                        }
                    }
                    , {
                        id: "579fa8d40700be0674d2e576"
                        , pos: {
                            roomName: "W51N47"
                            , x: 39
                            , y: 43
                        }
                    }
                ]
            }
            , W53N47: {
                sources: [
                    {
                        id: "579fa8b30700be0674d2e265"
                        , pos: {
                            roomName: "W53N47"
                            , x: 40
                            , y: 34
                        }
                    }
                ]
            }
            , W46N41: {
                harvestRooms: [
                    "W47N41"
                    , "W46N42"
                    , "W45N41"
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 1 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 1 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 6 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W53N39"
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W48N52"
                    }
                    , demolisher: {
                        roomSentTo: "W48N51"
                    }
                    , exporter: {
                        roomSentFrom: "W49N51"
                    }
                }
                , controller: {
                    id: "577b92b30f9d51615fa46f1e"
                    , pos: {
                        roomName: "W46N41"
                        , x: 14
                        , y: 17
                    }
                }
                , controllerToSource: 1
                , sources: [
                    {
                        id: "577b92b30f9d51615fa46f1d"
                        , pos: {
                            roomName: "W46N41"
                            , x: 15
                            , y: 16
                        }
                    }
                    , {
                        id: "577b92b30f9d51615fa46f1f"
                        , pos: {
                            roomName: "W46N41"
                            , x: 8
                            , y: 45
                        }
                    }
                ]
            }
            , W47N41: {
                controller: {
                    id: "577b92a40f9d51615fa46dc8"
                    , pos: {
                        roomName: "W47N41"
                        , x: 6
                        , y: 11
                    }
                }
                , sources: [
                    {
                        id: "577b92a40f9d51615fa46dc9"
                        , pos: {
                            roomName: "W47N41"
                            , x: 27
                            , y: 12
                        }
                    }
                ]
            }
            , W46N42: {
                sources: [
                    {
                        id: "577b92b30f9d51615fa46f1a"
                        , pos: {
                            roomName: "W46N42"
                            , x: 16
                            , y: 7
                        }
                    }
                ]
            }
            , W45N41: {
                sources: [
                    {
                        id: "577b92c20f9d51615fa47108"
                        , pos: {
                            roomName: "W45N41"
                            , x: 13
                            , y: 10
                        }
                    }
                ]
            }
            , W46N18: {
                harvestRooms: [
                    "W46N17"
                    //, "W45N18" // remote mined by cacomixl8
                    //, "W46N19" // remote mined by cacomixl8
                ]
                , repairerTypeMins: [
                    { type: STRUCTURE_CONTAINER, min: 0 }
                    , { type: STRUCTURE_ROAD, min: 1 }
                    , { type: STRUCTURE_RAMPART, min: 0 }
                    , { type: STRUCTURE_WALL, min: 0 }
                    , { type: "all", min: 1 }
                ]
                , creepMins: [
                    { role: "attacker", min: 0 } // set dynamically
                    , { role: "harvester", min: 6 }
                    , { role: "powerHarvester", min: 0 }
                    , { role: "upgrader", min: 1 }
                    , { role: "miner", min: 0 } // set dynamically
                    , { role: "adaptable", min: 0 } // set dynamically
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W53N39"
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W48N52"
                    }
                    , demolisher: {
                        roomSentTo: "W48N51"
                    }
                    , exporter: {
                        roomSentFrom: "W49N51"
                    }
                }
                , controller: {
                    id: "577b92b60f9d51615fa46f88"
                    , pos: {
                        roomName: "W46N18"
                        , x: 10
                        , y: 27
                    }
                }
                , controllerToSource: 4
                , sources: [
                    {
                        id: "577b92b60f9d51615fa46f89"
                        , pos: {
                            roomName: "W46N18"
                            , x: 6
                            , y: 28
                        }
                    }
                    , {
                        id: "577b92b60f9d51615fa46f87"
                        , pos: {
                            roomName: "W46N18"
                            , x: 38
                            , y: 23
                        }
                    }
                ]
            }
            , W46N17: {
                controller: {
                    id: "577b92b60f9d51615fa46f8c"
                    , pos: {
                        roomName: "W46N17"
                        , x: 37
                        , y: 5
                    }
                }
                , sources: [
                    {
                        id: "577b92b60f9d51615fa46f8b"
                        , pos: {
                            roomName: "W46N17"
                            , x: 19
                            , y: 5
                        }
                    }
                    , {
                        id: "577b92b60f9d51615fa46f8d"
                        , pos: {
                            roomName: "W46N17"
                            , x: 21
                            , y: 31
                        }
                    }
                ]
            }
            , W45N18: {
                sources: [
                    {
                        id: "577b92c50f9d51615fa4716a"
                        , pos: {
                            roomName: "W45N18"
                            , x: 39
                            , y: 6
                        }
                    }
                ]
            }
            , W46N19: {
                sources: [
                    {
                        id: "577b92b60f9d51615fa46f84"
                        , pos: {
                            roomName: "W46N19"
                            , x: 30
                            , y: 7
                        }
                    }
                ]
            }
        }
        , TooAngelTransactionRooms: {
            from: "W86N29"
            , to: "E12S1"
        }
        , ignoredRooms: [
            // "W81N29"
            // , "W72N28"
            // , "W55N31"
        ]
    };
    
    for (let roomID in shardData.rooms) {
        let theRoom = shardData.rooms[roomID];
        let creepMins = _.get(theRoom, ["creepMins"], undefined);
        if (_.isArray(creepMins) == true) {
            for (let creepMin of creepMins) {
                /*if (creepMin.role == "miner") {
                    creepMin.min = _.size(_.get(theRoom, ["minerSources"], {}));
                }
                else */if (creepMin.role == "repairer") {
                    let repairerTypeMins = _.get(theRoom, ["repairerTypeMins"], undefined);
                    if (_.isArray(repairerTypeMins) == true) {
                        creepMin.min = _.reduce(repairerTypeMins, (sum, repairerTypeMin) => (sum + repairerTypeMin.min), 0);
                    }
                }
                else if (creepMin.role == "demolisher") {
                    creepMin.min = _.parseInt(_.reduce(_.get(Game.rooms, [roomID, "demolishersToSpawn"], [ { count: 0 } ]), (sum, dTS) => (sum + dTS.count), 0));
                }
                else if (creepMin.role == "exporter") {
                    //creepMin.min = ((_.get(theRoom, ["terminal", "my"], true) == false) && (_.sum(_.get(theRoom, ["terminal", "store"], { [RESOURCE_ENERGY]: 0 })) > 0) && (Game.cpu.bucket > 7500)) ? 1 : 0);
                    creepMin.min = _.parseInt(_.reduce(_.get(Game.rooms, [roomID, "exportersToSpawn"], [ { count: 0 } ]), (sum, eTS) => (sum + eTS.count), 0));
                }
                else if (creepMin.role == "rockhound") {
                    creepMin.min = (_.get(theRoom, ["canHarvestMineral"], false) ? 1 : 0);
                }
            }
        }
    }
};

module.exports = dataShard0;
