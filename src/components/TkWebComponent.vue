<template>
    <div class="tkwidget-wrapper" v-cloak>
        <div class="tankerkoenig-info" v-if="!error">
            <tabs>
                <tab title="E10">
                    <div v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station row" v-if="hasFuel(station.fuels, 'Super E10')">
                            <div class="price">
                                <div class="gas-price">{{ station.fuels | priceForFuel('Super E10') }}<sup>{{ station.fuels | priceForFuelLast('Super E10') }}</sup></div>
                                <div class="opentimes">
                                    <div v-if="station.isOpen">
                                        <div v-if="station.closesAt">geöffnet bis<br>
                                            {{ station.closesAt | formatDate }} Uhr
                                        </div>
                                        <div v-if="station.openingTimes.length==0">24h geöffnet</div>
                                    </div>
                                    <div v-if="!station.isOpen">
                                        <div v-if="station.opensAt">öffnet um <br>
                                            {{ station.opensAt | formatDate }} Uhr
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <div v-if="station.brand" class="tkbrand">{{ station.brand }}</div>
                                <div v-else class="tkbrand">{{ station.name }}</div>
                                <br>
                                <div class="tkadress">{{ station.street }}<br>
                                    {{ station.postalCode }} {{ station.place }}
                                </div>
                            </div>
                        </div>
                    </div>
                </tab>
                <tab title="Super">
                    <div v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station row" v-if="hasFuel(station.fuels, 'Super E5')">
                            <div class="price">
                                <div class="gas-price"> {{ station.fuels | priceForFuel('Super E5') }}<sup>{{ station.fuels | priceForFuelLast('Super E5') }}</sup>
                                </div>
                                <div class="opentimes">
                                    <div v-if="station.isOpen">
                                        <div v-if="station.closesAt">geöffnet bis<br>
                                            {{ station.closesAt | formatDate }} Uhr
                                        </div>
                                        <div v-if="station.openingTimes.length==0">24h geöffnet</div>
                                    </div>
                                    <div v-if="!station.isOpen">
                                        <div v-if="station.opensAt">öffnet um <br>
                                            {{ station.opensAt | formatDate }} Uhr
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <div v-if="station.brand" class="tkbrand">{{ station.brand }}</div>
                                <div v-else class="tkbrand">{{ station.name }}</div>
                                <br>
                                <div class="tkadress">{{ station.street }}<br>
                                    {{ station.postalCode }} {{ station.place }}
                                </div>
                            </div>
                        </div>
                    </div>
                </tab>
                <tab title="Diesel">
                    <div v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station row" v-if="hasFuel(station.fuels, 'Diesel')">
                            <div class="price">
                                <div class="gas-price"> {{ station.fuels | priceForFuel('Diesel') }}<sup>{{ station.fuels | priceForFuelLast('Diesel') }}</sup></div>
                                <div class="opentimes">
                                    <div v-if="station.isOpen">
                                        <div v-if="station.closesAt">geöffnet bis<br>
                                            {{ station.closesAt | formatDate }} Uhr
                                        </div>
                                        <div v-if="station.openingTimes.length==0">24h geöffnet</div>
                                    </div>
                                    <div v-if="!station.isOpen">
                                        <div v-if="station.opensAt">öffnet um <br>
                                            {{ station.opensAt | formatDate }} Uhr
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <div v-if="station.brand" class="tkbrand">{{ station.brand }}</div>
                                <div v-else class="tkbrand">{{ station.name }}</div>
                                <br>
                                <div class="tkadress">{{ station.street }}<br>
                                    {{ station.postalCode }} {{ station.place }}
                                </div>
                            </div>
                        </div>
                    </div>
                </tab>
            </tabs>
        </div>
        <div class="tankerkoenig-info" v-else>
            <h2> Uu, oh, ein Fehler! </h2>
            <br>
            API key : {{ this.apikey }}
            <br>
            Fehler : {{ this.errormsg }}
        </div>
        <div class="tkcredentials">powered by
            <a href="https://www.tankerkoenig.de">
                <img svg-inline class="icon"
                     src="../assets/TK-Logo.svg"
                     style="vertical-align:middle;"
                     alt="">
            </a>
        </div>
    </div>

</template>

<script>
    import axios from 'axios';
    import { Tabs, Tab } from 'vue-slim-tabs';
    import dayjs from 'dayjs';
    export default {
        props: {
            apikey: {
                type: String,
                required: true,
            },
            stations: {
                type: String,
                required: false
            },
            plz: {
                type: String,
                required: false
            },
            lat: {
                type: String,
                required: false
            },
            lng: {
                type: String,
                required: false
            },
            rad: {
                type: Number,
                required: false
            }

        },
        components: {
            Tabs, Tab
        },
        data() {
            return {
                API_URL: 'https://creativecommons.tankerkoenig.de/api/v4/',
                in_stations: [],
                out_stations: [],
                radius: 5,
                error: false,
                errormsg: ''
            }
        },

        filters: {
            priceForFuel: function (fuels, name) {
                if (fuels) {
                    let item = fuels.filter(function (fuel) {
                        return fuel.name === name;
                    });

                    let price = Number(item[0].price) || 0.000;
                    return price.toString().substring(0, 4);
                }
                return
            },


            priceForFuelLast: function (fuels, name) {
                if (fuels) {
                    let item = fuels.filter(function (fuel) {
                        return fuel.name === name;
                    });


                    let price = Number(item[0].price) || 0.000;

                    return price.toString().slice(-1);
                }
                return
            },

            formatDate: function (value) {
                if (value) {
                    let display = dayjs(String(value)).format('HH:mm');
                    return display;
                } else {
                    return ''
                }
            }

        },

        methods: {
            getStationsByIds() {

                let q_stations = this.in_stations.join(',');
                const url = this.API_URL + 'stations/ids?ids=' + q_stations + '&apikey=' + this.apikey;

                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch((e) => {
                        this.error = true;
                        this.errormsg = e.response.data.message;
                    })

            },
            getStationsByPLZ() {

                const url = this.API_URL + 'stations/postalcode?postalcode=' + this.plz + '&apikey=' + this.apikey;

                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch((e) => {
                        this.error = true;
                        this.errormsg = e.response.data.message;
                    })

            },
            getStationsByCoords() {

                const url = this.API_URL + 'stations/search?apikey=' + this.apikey + '&lat=' + this.lat + '&lng='+this.lng + '&rad=' + this.radius;
                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch((e) => {
                        this.error = true;
                        this.errormsg = e.response.data.message;
                    })

            },
            hasFuel(fuels, fuelkind) {

                let hasFuel = false;
                for (let i = 0; i < fuels.length; i++) {
                    if (fuels[i].name === fuelkind) {
                        hasFuel = true
                    }
                }

                return hasFuel;
            }

        },
        mounted() {

            if (this.stations && this.stations.length > 0) {
                this.in_stations = this.stations.split(',');
            }

            if (this.in_stations.length > 0) {
                this.getStationsByIds();
            } else if (this.plz && this.plz.length !== 0) {
                if(this.plz.length < 5 || this.plz.length > 5 || isNaN(this.plz)) {
                    this.error = true;
                    this.errormsg = 'Postleitzahl muss 5-stellig sein - Keine gültige PLZ.'
                } else {
                    this.getStationsByPLZ();
                }

            } else if (this.lat.length > 0 &&  this.lng.length > 0) {

                if(isNaN(this.lat) || (Number(this.lat) < 47) || (Number(this.lat) >  56) ) {
                    this.error = true;
                    this.errormsg = 'lat Wert falsch'
                }

                if(isNaN(this.lng) || (Number(this.lng) < 6 ) || (Number(this.lng) >  15 ) ) {
                    this.error = true;
                    this.errormsg = 'lng Wert falsch'
                }

                if(this.rad) {
                    this.radius = this.rad;
                } else {
                    this.radius = 5
                }

                this.getStationsByCoords()

            } else {
                this.error = true;
                this.errormsg = 'Konfigurationsdaten fehlen: stations bzw. plz eintragen. '
            }

        }
    }
</script>
<style>

    .tkwidget-wrapper {
        width:  var(--widget-with,100%);
        max-height: var(--widget-height,100%);
        overflow: auto;
    }

    .vue-tablist {
        list-style: none;
        display: flex;
        padding-left: 0;
        border-bottom: 1px solid #e2e2e2;
    }

    .vue-tab {
        padding: 5px 10px;
        cursor: pointer;
        user-select: none;
        border: 1px solid transparent;
        /* border: var(--divider-color, 1px solid #e2e2e2);*/
        border-bottom-color: #e2e2e2;
        border-radius: 3px 3px 0 0;
        background-color: var(--tab-color, white);
        position: relative;
        bottom: -1px;
    }

    .vue-tab[aria-selected="true"] {
        border-color: #e2e2e2;
        border-bottom-color: transparent;
        font-weight: bold;
    }


    .row {
        display: flex;
    }

    .price {
        flex: auto;
        display: flex;
        height: auto;
        width: auto;
        flex-direction: column;
        padding-right: 30px;
    }

    .info {
        flex-direction: column;
        width: 100%;
    }

    .opentimes {
        font-size: var(--time-fontsize,10px);
        display: table-cell;
        height: 30%;
        vertical-align: bottom;
    }


    .tankerkoenig-info {
        font-family: var(--font-family, 'Open Sans,Arial,Helvetica,sans-serif');
        /* font-family: var(--font-family, "Comic Sans MS");*/
        font-size: var(--font-size, 16px);
        color: var(--font-color, black);
        background: var(--bg-color, white);
    }

    .station {
        padding: var(--station-padding, 15px);
        border-bottom: var(--divider, 1px solid #e2e2e2);
    }

    .tkbrand {
        font-weight: bold;
        color: var(--brand-color, black);
    }

    .gas-price {
        font-weight: bold;
        font-size: var(--price-fontsize,24px);
        color: var(--price-color, black);
        display: table-cell;
        height: 70%;
    }

    .tkcredentials {
        color: #34495D;
        padding: 12px;
        font-size: 12px;
        line-height: 20px;
        vertical-align: middle;
    }

    .icon {
        padding-left: 5px;
    }
</style>
