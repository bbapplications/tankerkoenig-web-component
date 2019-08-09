<template>
    <div id="tk-widget" class="tkwidget-wrapper" v-cloak>
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
                                <div class="tkadress">{{ station.street | deCapitalize }}<br>
                                    {{ station.postalCode }} {{ station.place | deCapitalize }}
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
                                <div class="tkadress">{{ station.street | deCapitalize }}<br>
                                    {{ station.postalCode }} {{ station.place | deCapitalize }}
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
                                <div class="tkadress">{{ station.street | deCapitalize }}<br>
                                    {{ station.postalCode }} {{ station.place | deCapitalize }}
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

    axios.defaults.timeout = 15000;

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
            },
            deCapitalize: function (input) {
                if (input !== undefined) {
                    input = input.replace('/', ' / ');
                    input = input.replace('b. ', ' b. ');
                    input = input.replace('B. ', ' B. ');
                }
                if (input !== undefined) {
                    if (input.charAt(0) == 'Ä' || input.charAt(0) == 'Ö' || input.charAt(0) == 'Ü') {
                        return input;
                    }
                }
                return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                    if (txt == 'am ' || txt == 'AM ' || txt == 'u. ' || txt == 'U . ' || txt == 'v. ' || txt == 'V.'
                        || txt == 'v.d ' || txt == 'V.D.' || txt == 'i.d. ' || txt == 'I.D. ' || txt == 'i.d.'
                        || txt == 'I.D.' || txt == 'a.d. ' || txt == 'A.D. ' || txt == 'im ' || txt == 'IM '
                        || txt == 'b. ' || txt == 'B. ' || txt == 'i. ' || txt == 'I. ' || txt == 'a. '
                        || txt == 'A. ' || txt == 'd. ' || txt == 'D. ' || txt == 'h. ' || txt == 'H. '
                        || txt == 'ob ' || txt == 'OB ' || txt == 'an ' || txt == 'AN ' || txt == 'am '
                        || txt == 'AM ' || txt == 'kalten ' || txt == 'KALTEN ' || txt == 'alten ' || txt == 'ALTEN '
                        || txt == 'der ' || txt == 'DER ' || txt == 'bei ' || txt == 'BEI ' || txt == 'vorm '
                        || txt == 'VORM ' || txt == 'vor ' || txt == 'VOR ' || txt == 'auf ' || txt == 'AUF '
                        || txt == 'dem ' || txt == 'DEM ' || txt == 'den ' || txt == 'DEN ' || txt == 'der '
                        || txt == 'DER ' || txt == 'zum ' || txt == 'ZUM ' || txt == 'unter ' || txt == 'UNTER '
                        || txt == 'hinter ' || txt == 'HINTER ' || txt == 'ober ' || txt == 'OBER ' || txt == 'über '
                        || txt == 'ÜBER ' || txt == 'neben' || txt == 'NEBEN ' || txt == 'n.' || txt == 'N. '
                        || txt == 'o. ' || txt == 'O. ' || txt == 'V.W. ') {
                        return txt.toLowerCase();
                    } else {
                        if (txt == 'a.T.W.' || txt == 'a.T.W. ' || txt == 'a.T.W ' || txt == 'v.W. ' || txt == 'i.H.'
                            || txt == 'a.H.' || txt == 'a.k.M.' || txt == 'OT ' || txt == 'OT' || txt == 'a.R. '
                            || txt == 'A.R. ' || txt == 'i.H. ' || txt == 'I.H.' || txt == 'o.d.T.' || txt == 'VS '
                            || txt == 'V.S.' || txt == 'V.S. ' || txt == 'VS' || txt == 'V.S.-Villingen ') {
                            return txt;
                        } else {
                            if (txt == 'V.W. ' || txt == 'V.W.' || txt == 'v.W.') {
                                return 'v.W. ';
                            } else {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            }
                        }
                    }
                }) : '';
            }
        },
        methods: {
            getStationsByIds() {

                let q_stations = this.in_stations.join(',');
                const url = `${this.API_URL}stations/ids?ids=${q_stations}&apikey=${this.apikey}`;

                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch((e) => {
                        this.error = true;

                        if(e.message === 'Network Error'){
                            this.errormsg = "Network Error"
                        } else if (e.code === 'ECONNABORTED' || e.code ==='ERR_NAME_NOT_RESOLVED'){
                            this.errormsg = "no response from server"
                        } else {
                            this.errormsg = e.response.data.message;
                        }
                    })

            },
            getStationsByPLZ() {

                const url = `${this.API_URL}stations/postalcode?postalcode=${this.plz}&apikey=${this.apikey}`;
                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch((e) => {
                        this.error = true;

                        if(e.message === 'Network Error'){
                            this.errormsg = "Network Error"
                        } else if (e.code === 'ECONNABORTED' || e.code ==='ERR_NAME_NOT_RESOLVED'){
                            this.errormsg = "no response from server"
                        } else {
                            this.errormsg = e.response.data.message;
                        }
                    })
            },
            getStationsByCoords() {

                const url = `${this.API_URL}stations/search?apikey=${this.apikey}&lat=${this.lat}&lng=${this.lng}&rad=${this.radius}`;
                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch((e) => {
                        this.error = true;

                        if(e.message === 'Network Error'){
                            this.errormsg = "Network Error"
                        } else if (e.code === 'ECONNABORTED' || e.code ==='ERR_NAME_NOT_RESOLVED'){
                            this.errormsg = "no response from server"
                        } else {
                            this.errormsg = e.response.data.message;
                        }
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
        overflow-x: hidden;
        /*overflow: auto;*/
    }

    .vue-tablist {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;
        border-bottom: 1px solid #e2e2e2;
        top: 0;
        height: 40px;
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
        background: white;
    }

    .icon {
        padding-left: 5px;
    }
</style>
