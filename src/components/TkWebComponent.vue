<template>
    <div v-cloak>
        <div>
            apikey: {{ apikey }} <br>
            stations: {{ stations }}
        </div>

        <div class="tankerkoenig-info" v-if="!error">
            <tabs>
                <tab title="E10" >
                    <div v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station">
                            <div class="tkbrand">{{ station.brand }} </div>
                            <div class="tkname">{{ station.name }} </div>
                            <div class="tkadress">{{ station.street }}, {{ station.postalCode }} {{ station.place }} </div>
                            <span class="gas-price"> {{ station.fuels | priceForFuel('Super E10') }}<sup>{{ station.fuels | priceForFuelLast('Super E10') }}</sup></span>
                        </div>
                    </div>
                </tab>
                <tab title="E5" >
                    <div  v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station">
                            <div class="tkbrand">{{ station.brand }} </div>
                            <div class="tkname">{{ station.name }} </div>
                            <div class="tkadress">{{ station.street }}, {{ station.postalCode }} {{ station.place }} </div>
                            <span class="gas-price"> {{ station.fuels | priceForFuel('Super E5') }}<sup>{{ station.fuels | priceForFuelLast('Super E5') }}</sup></span>
                        </div>
                    </div>
                </tab>
                <tab title="Diesel"  >
                    <div v-for="station in out_stations" v-bind:key="station.id">
                        <div class="station">
                            <div class="tkbrand">{{ station.brand }} </div>
                            <div class="tkname">{{ station.name }} </div>
                            <div class="tkadress">{{ station.street }}, {{ station.postalCode }} {{ station.place }} </div>
                            <span class="gas-price"> {{ station.fuels | priceForFuel('Diesel') }}<sup>{{ station.fuels | priceForFuelLast('Diesel') }}</sup></span>
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
    </div>

</template>

<script>
    import axios from 'axios';
    import { Tabs, Tab } from 'vue-slim-tabs';
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
                API_URL : 'https://creativecommons.tankerkoenig.de/api/v4/',
                in_stations: [],
                out_stations: [],
                error: false
            }
        },
        filters: {
            priceForFuel: function (fuels, name) {
                if(fuels) {
                    let item = fuels.filter(function (fuel) {
                        return fuel.name === name;
                    });

                    let price = Number(item[0].price);
                    return price.toString().substring(0, 4);
                }
                return
            },

            priceForFuelLast: function (fuels, name) {
                if(fuels) {
                    let item = fuels.filter(function (fuel) {
                        return fuel.name === name;
                    });

                    let price = Number(item[0].price);

                    return price.toString().slice(-1);
                }
                return
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

                const url = this.API_URL + 'stations/search&' + this.search + '&apikey=' + this.apikey;

                axios
                    .get(url)
                    .then(response => {
                        this.out_stations = response.data.stations;
                    })
                    .catch(() => {
                        this.error = true
                    })

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
            } else if(this.search && this.search.length > 0) {
                this.getStationsByCoords()
            }

        }
    }
</script>
<style>
    .tankerkoenig-info {
        font-family: var(--font-family, 'Open Sans,Arial,Helvetica,sans-serif');
       /* font-family: var(--font-family, "Comic Sans MS");*/
        font-size: var(--font-size, 14px);
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
    }
</style>
