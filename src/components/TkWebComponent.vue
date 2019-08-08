<template>
    <div class="tkwidget-wrapper" v-cloak>
        <div class="tankerkoenig-info" v-if="!error">
            <tabs>
                <tab title="E10">
                    <div v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station row" v-if="hasFuel(station.fuels, 'Super E10')">
                            <div class="price">
                                <div class="gas-price"> {{ station.fuels | priceForFuel('Super E10') }}<sup>{{
                                    station.fuels | priceForFuelLast('Super E10') }}</sup></div>
                                <div class="opentimes">
                                    <div v-if="station.isOpen">
                                        <div v-if="station.closesAt">geöffnet bis<br> {{ station.closesAt | formatDate
                                            }} Uhr
                                        </div>
                                        <div v-if="station.openingTimes.length==0">24h geöffnet</div>
                                    </div>
                                    <div v-if="station.isClosed">
                                        <div v-if="station.opensAt">öffnet um <br>{{ station.opensAt | formatDate }} Uhr
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <div v-if="station.brand" class="tkbrand">{{ station.brand }}</div>
                                <div v-else class="tkbrand">{{ station.name }}</div>
                                <br>
                                <div class="tkadress">{{ station.street }}<br> {{ station.postalCode }} {{ station.place
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </tab>
                <tab title="Super">
                    <div v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station row" v-if="hasFuel(station.fuels, 'Super E5')">
                            <div class="price">
                                <div class="gas-price"> {{ station.fuels | priceForFuel('Super E5') }}<sup>{{
                                    station.fuels | priceForFuelLast('Super E5') }}</sup></div>
                                <div class="opentimes">
                                    <div v-if="station.isOpen">
                                        <div v-if="station.closesAt">geöffnet bis<br> {{ station.closesAt | formatDate
                                            }} Uhr
                                        </div>
                                        <div v-if="station.openingTimes.length==0">24h geöffnet</div>
                                    </div>
                                    <div v-if="station.isClosed">
                                        <div v-if="station.opensAt">öffnet um <br>{{ station.opensAt | formatDate }} Uhr
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <div v-if="station.brand" class="tkbrand">{{ station.brand }}</div>
                                <div v-else class="tkbrand">{{ station.name }}</div>
                                <br>
                                <div class="tkadress">{{ station.street }}<br> {{ station.postalCode }} {{ station.place
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </tab>
                <tab title="Diesel">
                    <div v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station row" v-if="hasFuel(station.fuels, 'Diesel')">
                            <div class="price">
                                <div class="gas-price"> {{ station.fuels | priceForFuel('Diesel') }}<sup>{{
                                    station.fuels | priceForFuelLast('Diesel') }}</sup></div>
                                <div class="opentimes">
                                    <div v-if="station.isOpen">
                                        <div v-if="station.closesAt">geöffnet bis<br> {{ station.closesAt | formatDate
                                            }} Uhr
                                        </div>
                                        <div v-if="station.openingTimes.length==0">24h geöffnet</div>
                                    </div>
                                    <div v-if="station.isClosed">
                                        <div v-if="station.opensAt">öffnet um <br>{{ station.opensAt | formatDate }} Uhr
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <div v-if="station.brand" class="tkbrand">{{ station.brand }}</div>
                                <div v-else class="tkbrand">{{ station.name }}</div>
                                <br>
                                <div class="tkadress">{{ station.street }}<br> {{ station.postalCode }} {{ station.place
                                    }}
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
            Station : {{ this.stations }}
        </div>
        <div class="tkcredentials">powered by <a href="https://www.tankerkoenig.de"><img svg-inline class="icon"
                                                                                         src="../assets/TK-Logo.svg"
                                                                                         style="vertical-align:middle;"
                                                                                         alt=""></a></div>
    </div>

</template>

<script>
    import axios from 'axios';
    import { Tabs, Tab } from 'vue-slim-tabs';
    import dayjs from 'dayjs';
    /*import moment from 'moment';*/
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
            postalcode: {
                type: String,
                required: false
            },
            search: {
                type: String,
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
                e10_stations: [],
                error: false
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
                    //let display = moment(String(value)).format('HH:mm');
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
                    .catch(() => {
                        this.error = true
                    })

            },
            getStationsByPLZ() {

                const url = this.API_URL + 'stations/postalcode?postalcode=' + this.postalcode + '&apikey=' + this.apikey;

                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch(() => {
                        this.error = true
                    })

            },
            getStationsByCoords() {

                const url = this.API_URL + 'stations/search?apikey=' + this.apikey + this.search;
                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch(() => {
                        this.error = true
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
            } else if (this.postalcode && this.postalcode.length !== 0) {
                this.getStationsByPLZ();
            } else if (this.search && this.search.length > 0) {
                this.getStationsByCoords()
            }

        }
    }
</script>
<style>

    .row {
        display: flex;
    }

    .price {
        flex: auto;
        display: flex;
        height: auto;
        flex-direction: column;
    }

    .info {
        flex: 80%
    }

    .opentimes {
        font-size: 12px;
        display: table-cell;
        height: 20%;
        vertical-align: bottom;
    }

    .tkwidget-wrapper {
        width: 100%;
        max-height: 100%;
        overflow: auto;
    }

    .tankerkoenig-info {
        font-family: var(--font-family, 'Open Sans,Arial,Helvetica,sans-serif');
        /* font-family: var(--font-family, "Comic Sans MS");*/
        font-size: var(--font-size, 16px);
        color: var(--font-color, black);
        background: var(--bg-color, white);
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

    .station {
        padding: var(--station-padding, 15px);
        border-bottom: var(--divider-color, 1px solid #e2e2e2);
    }

    .tkbrand {
        font-weight: bold;
    }

    .gas-price {
        font-weight: bold;
        font-size: 24px;
        display: table-cell;
        height: 80%;
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
