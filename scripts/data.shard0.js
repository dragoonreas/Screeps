let dataShard0 = function() {
    global.shardData = {
        estSecPerTick: 4.76 // NOTE: Last updated 2017/07/18
        , rooms: {
            W86N29: {
                harvestRooms: [
                    "W85N29"
                    , "W86N28"
                    , "W86N31"
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
                    , { role: "demolisher", min: 0 }
                    , { role: "scout", min: 0 }
                    , { role: "claimer", min: 1 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W85N23"
                    , "W86N39"
                    , "W85N38"
                    //, "W81N29"
                    //, "W72N28"
                    , "W64N31"
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W81N29"
                    }
                    , demolisher: {
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
            , W86N31: {
                sources: [
                    {
                        id: "5873bbab11e3e4361b4d63f9"
                        , pos: {
                            roomName: "W86N31"
                            , x: 39
                            , y: 41
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
            , W86N39: {
                harvestRooms: [
                    "W87N39"
                    , "W88N39"
                    , "W86N41"
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
                    , "W85N38"
                    //, "W86N43"
                ]
                , creepMemory: {
                    demolisher: {
                        roomSentTo: "W87N39"
                    }
                    , exporter: {
                        roomSentFrom: "W94N49"
                        , roomSentTo: "W85N38"
                    }
                }
                , controllerToSource: 3
                , sources: [
                    {
                        id: "5873bbaa11e3e4361b4d63cf"
                        , pos: {
                            roomName: "W86N39"
                            , x: 19
                            , y: 21
                        }
                    }
                    , {
                        id: "5873bbaa11e3e4361b4d63ce"
                        , pos: {
                            roomName: "W86N39"
                            , x: 19
                            , y: 20
                        }
                    }
                ]
            }
            , W87N39: {
                controller: {
                    id: "5873bb9411e3e4361b4d6139"
                    , pos: {
                        roomName: "W87N39"
                        , x: 24
                        , y: 40
                    }
                }
                , sources: [
                    {
                        id: "5873bb9411e3e4361b4d6137"
                        , pos: {
                            roomName: "W87N39"
                            , x: 34
                            , y: 19
                        }
                    }
                    , {
                        id: "5873bb9411e3e4361b4d6138"
                        , pos: {
                            roomName: "W87N39"
                            , x: 21
                            , y: 29
                        }
                    }
                ]
            }
            , W88N39: {
                sources: [
                    {
                        id: "5873bb7e11e3e4361b4d5ef2"
                        , pos: {
                            roomName: "W88N39"
                            , x: 35
                            , y: 4
                        }
                    }
                ]
            }
            , W86N41: {
                sources: [
                    {
                        id: "5873bbaa11e3e4361b4d63c9"
                        , pos: {
                            roomName: "W86N41"
                            , x: 15
                            , y: 4
                        }
                    }
                ]
            }
            , W85N38: {
                harvestRooms: [
                    "W86N38"
                    , "W85N39"
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
                    , "W86N39"
                    //, "W86N43"
                ]
                , controllerToSource: 3
                , sources: [
                    {
                        id: "5873bbc711e3e4361b4d6731"
                        , pos: {
                            roomName: "W85N38"
                            , x: 30
                            , y: 18
                        }
                    }
                    , {
                        id: "5873bbc711e3e4361b4d6733"
                        , pos: {
                            roomName: "W85N38"
                            , x: 44
                            , y: 37
                        }
                    }
                ]
            }
            , W86N38: {
                controller: {
                    id: "5873bbaa11e3e4361b4d63d1"
                    , pos: {
                        roomName: "W86N38"
                        , x: 44
                        , y: 5
                    }
                }
                , sources: [
                    {
                        id: "5873bbaa11e3e4361b4d63d2"
                        , pos: {
                            roomName: "W86N38"
                            , x: 8
                            , y: 12
                        }
                    }
                ]
            }
            , W85N39: {
                sources: [
                    {
                        id: "5873bbc711e3e4361b4d672e"
                        , pos: {
                            roomName: "W85N39"
                            , x: 21
                            , y: 12
                        }
                    }
                ]
            }
            , W86N43: {
                harvestRooms: [
                    /*"W87N43"
                    , "W88N39"
                    , "W86N41"*/
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
                    , { role: "harvester", min: 1 }
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
                , bootstrappedRooms: [
                    "W86N43"
                    /*"W86N39"
                    , "W85N38"*/
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W9N45"
                    }
                    , exporter: {
                        roomSentFrom: "W94N49"
                    }
                }
                , waypointsFor: [
                    "adaptable"
                ]
                , sources: [
                    {
                        id: "5873bbaa11e3e4361b4d63c4"
                        , pos: {
                            roomName: "W86N43"
                            , x: 20
                            , y: 44
                        }
                    }
                    , {
                        id: "5873bbaa11e3e4361b4d63c2"
                        , pos: {
                            roomName: "W86N43"
                            , x: 38
                            , y: 15
                        }
                    }
                ]
            }
            , W87N43: {
                controller: {
                    id: "5873bb9311e3e4361b4d612e"
                    , pos: {
                        roomName: "W87N43"
                        , x: 8
                        , y: 39
                    }
                }
                , sources: [
                    {
                        id: "5873bb9311e3e4361b4d612d"
                        , pos: {
                            roomName: "W87N43"
                            , x: 18
                            , y: 36
                        }
                    }
                ]
            }
            , W87N44: {
                sources: [
                    {
                        id: "5873bb9311e3e4361b4d612b"
                        , pos: {
                            roomName: "W87N44"
                            , x: 4
                            , y: 35
                        }
                    }
                ]
            }
            , W85N45: {
                sources: [
                    {
                        id: "5873bbc611e3e4361b4d6715"
                        , pos: {
                            roomName: "W85N45"
                            , x: 17
                            , y: 41
                        }
                    }
                    , {
                        id: "5873bbc611e3e4361b4d6713"
                        , pos: {
                            roomName: "W85N45"
                            , x: 15
                            , y: 6
                        }
                    }
                    , {
                        id: "5873bbc611e3e4361b4d6714"
                        , pos: {
                            roomName: "W85N45"
                            , x: 38
                            , y: 6
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
                    , "W81N31"
                    , "W82N31"
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
            , W81N31: {
                sources: [
                    {
                        id: "5873bc2711e3e4361b4d7252"
                        , pos: {
                            roomName: "W81N31"
                            , x: 18
                            , y: 22
                        }
                    }
                ]
            }
            , W82N31: {
                sources: [
                    {
                        id: "5873bc1011e3e4361b4d6fff"
                        , pos: {
                            roomName: "W82N31"
                            , x: 38
                            , y: 27
                        }
                    }
                    , {
                        id: "5873bc1011e3e4361b4d6ffe"
                        , pos: {
                            roomName: "W82N31"
                            , x: 5
                            , y: 14
                        }
                    }
                ]
            }
            , W72N28: {
                /*harvestRooms: [
                    "W72N29"
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
            , W72N29: {
                controller: {
                    id: "5836b6eb8b8b9619519ef90b"
                    , pos: {
                        roomName: "W72N29"
                        , x: 7
                        , y: 9
                    }
                }
                , sources: [
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
                    , "W65N31"
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
            , W55N31: {
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
                    //, "W53N38" // now an occupied room
                    , "W52N39"
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
                    //, "W53N42"
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
            , W53N42: {
                /*harvestRooms: [
                    "W53N41"
                    , "W52N42"
                    , "W53N43"
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
                    , { role: "claimer", min: 0 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , */creepMemory: {
                    claimer: {
                        roomSentTo: "W52N47"
                    }
                }
                , controller: {
                    id: "579fa8b30700be0674d2e276"
                    , pos: {
                        roomName: "W53N42"
                        , x: 23
                        , y: 8
                    }
                }
                , controllerToSource: 3
                , canDemolishIn: true
                , sources: [
                    {
                        id: "579fa8b30700be0674d2e277"
                        , pos: {
                            roomName: "W53N42"
                            , x: 40
                            , y: 35
                        }
                    }
                    , {
                        id: "579fa8b30700be0674d2e275"
                        , pos: {
                            roomName: "W53N42"
                            , x: 23
                            , y: 4
                        }
                    }
                ]
            }
            , W53N41: {
                controller: {
                    id: "579fa8b40700be0674d2e27a"
                    , pos: {
                        roomName: "W53N41"
                        , x: 29
                        , y: 10
                    }
                }
                , sources: [
                    {
                        id: "579fa8b40700be0674d2e279"
                        , pos: {
                            roomName: "W53N41"
                            , x: 27
                            , y: 9
                        }
                    }
                ]
            }
            , W52N42: {
                sources: [
                    {
                        id: "579fa8c50700be0674d2e3f9"
                        , pos: {
                            roomName: "W52N42"
                            , x: 31
                            , y: 20
                        }
                    }
                ]
            }
            , W53N43: {
                sources: [
                    {
                        id: "579fa8b30700be0674d2e273"
                        , pos: {
                            roomName: "W53N43"
                            , x: 32
                            , y: 35
                        }
                    }
                ]
            }
            , W52N47: {
                harvestRooms: [
                    "W51N47"
                    , "W53N47"
                    , "W52N48"
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
                    //, "W48N52"
                    , "W42N51"
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
            , W52N48: {
                sources: [
                    {
                        id: "579fa8c40700be0674d2e3e6"
                        , pos: {
                            roomName: "W52N48"
                            , x: 4
                            , y: 32
                        }
                    }
                ]
            }
            , W48N52: {
                /*harvestRooms: [
                    "W49N52"
                    , "W48N53"
                    , "W48N51"
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
                    , { role: "claimer", min: 0 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , */creepMemory: {
                    claimer: {
                        roomSentTo: "W42N51"
                    }
                }
                , controller: {
                    id: "579fa8e90700be0674d2e742"
                    , pos: {
                        roomName: "W48N52"
                        , x: 38
                        , y: 7
                    }
                }
                , controllerToSource: 3
                , canDemolishIn: true
                , sources: [
                    {
                        id: "579fa8e90700be0674d2e743"
                        , pos: {
                            roomName: "W48N52"
                            , x: 28
                            , y: 19
                        }
                    }
                    , {
                        id: "579fa8e90700be0674d2e741"
                        , pos: {
                            roomName: "W48N52"
                            , x: 39
                            , y: 5
                        }
                    }
                ]
            }
            , W49N52: {
                controller: {
                    id: "579fa8e60700be0674d2e700"
                    , pos: {
                        roomName: "W49N52"
                        , x: 12
                        , y: 43
                    }
                }
                , sources: [
                    {
                        id: "579fa8e60700be0674d2e701"
                        , pos: {
                            roomName: "W49N52"
                            , x: 20
                            , y: 43
                        }
                    }
                    , {
                        id: "579fa8e60700be0674d2e6ff"
                        , pos: {
                            roomName: "W49N52"
                            , x: 34
                            , y: 30
                        }
                    }
                ]
            }
            , W48N53: {
                sources: [
                    {
                        id: "579fa8e90700be0674d2e73f"
                        , pos: {
                            roomName: "W48N53"
                            , x: 17
                            , y: 46
                        }
                    }
                ]
            }
            , W48N51: {
                sources: [
                    {
                        id: "579fa8e90700be0674d2e746"
                        , pos: {
                            roomName: "W48N51"
                            , x: 6
                            , y: 33
                        }
                    }
                ]
            }
            , W42N51: {
                harvestRooms: [
                    "W41N51"
                    , "W41N49"
                    , "W39N51"
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
                    , { role: "exporter", min: 1 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , bootstrappedRooms: [
                    "W52N47"
                    //, "W37N52"
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W37N52"
                    }
                    , exporter: {
                        roomSentFrom: "W42N56"
                    }
                }
                , controller: {
                    id: "579fa8f80700be0674d2e928"
                    , pos: {
                        roomName: "W42N51"
                        , x: 26
                        , y: 28
                    }
                }
                , controllerToSource: 3
                , waypointsFor: [
                    "adaptable"
                ]
                , sources: [
                    {
                        id: "579fa8f80700be0674d2e929"
                        , pos: {
                            roomName: "W42N51"
                            , x: 4
                            , y: 35
                        }
                    }
                    , {
                        id: "579fa8f80700be0674d2e927"
                        , pos: {
                            roomName: "W42N51"
                            , x: 25
                            , y: 27
                        }
                    }
                ]
            }
            , W41N51: {
                controller: {
                    id: "579fa8fa0700be0674d2e965"
                    , pos: {
                        roomName: "W41N51"
                        , x: 42
                        , y: 17
                    }
                }
                , sources: [
                    {
                        id: "579fa8fa0700be0674d2e966"
                        , pos: {
                            roomName: "W41N51"
                            , x: 10
                            , y: 45
                        }
                    }
                    , {
                        id: "579fa8fa0700be0674d2e964"
                        , pos: {
                            roomName: "W41N51"
                            , x: 15
                            , y: 13
                        }
                    }
                ]
            }
            , W41N49: {
                sources: [
                    {
                        id: "577b92f70f9d51615fa476fe"
                        , pos: {
                            roomName: "W41N49"
                            , x: 14
                            , y: 5
                        }
                    }
                ]
            }
            , W39N51: {
                sources: [
                    {
                        id: "579fa8fe0700be0674d2e9bb"
                        , pos: {
                            roomName: "W39N51"
                            , x: 22
                            , y: 11
                        }
                    }
                ]
            }
            , W37N52: {
                /*harvestRooms: [
                    "W37N51"
                    , "W38N52"
                    , "W37N53"
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
                    , { role: "claimer", min: 0 }
                    , { role: "repairer", min: 0 } // set dynamically
                    , { role: "builder", min: 1 }
                    , { role: "exporter", min: 0 }
                    , { role: "rockhound", min: 0 } // set dynamically
                ]
                , creepMemory: {
                    claimer: {
                        roomSentTo: "W31N53"
                    }
                }
                , */controller: {
                    id: "579fa9040700be0674d2ea36"
                    , pos: {
                        roomName: "W37N52"
                        , x: 42
                        , y: 40
                    }
                }
                , canDemolishIn: true
                , sources: [
                    {
                        id: "579fa9040700be0674d2ea34"
                        , pos: {
                            roomName: "W37N52"
                            , x: 16
                            , y: 28
                        }
                    }
                    , {
                        id: "579fa9040700be0674d2ea35"
                        , pos: {
                            roomName: "W37N52"
                            , x: 45
                            , y: 33
                        }
                    }
                ]
            }
        }
        , TooAngelTransactionRooms: {
            from: "W86N29"
            , to: "E33N15"
        }
        , ignoredRooms: [
            "W17N79"
            , "W81N29"
            , "W72N28"
            , "W87N29" // TODO: Remove this when the rest of the code relating to this room's been removed
            , "W55N31"
            , "W53N42"
            , "W48N52"
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
                /*else if (creepMin.role == "exporter") {
                    creepMin.min = ((_.get(theRoom, ["terminal", "my"], true) == false) && (_.sum(_.get(theRoom, ["terminal", "store"], { [RESOURCE_ENERGY]: 0 })) > 0) && (Game.cpu.bucket > 7500)) ? 1 : 0);
                }*/
                else if (creepMin.role == "rockhound") {
                    creepMin.min = (_.get(theRoom, ["canHarvestMineral"], false) ? 1 : 0);
                }
            }
        }
    }
};

module.exports = dataShard0;
