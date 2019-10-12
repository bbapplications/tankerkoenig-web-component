<template>
  <div v-cloak ref="tkwidget" class="tkwidget-wrapper">
    <div v-if="!error">
      <tabs>
        <tab title="E10">
          <div :style="{height: scrollWrapperHeight}">
            <vue-scroll :ops="ops">
              <div v-for="station in out_stations" :key="station.id" @click="affiliatelink(station.id)">
                <div v-if="hasFuel(station.fuels, 'Super E10')" class="station">
                  <fuel-station :station="station" :fueltype="'Super E10'" />
                </div>
              </div>
            </vue-scroll>
          </div>
        </tab>
        <tab title="Super">
          <div :style="{height: scrollWrapperHeight}">
            <vue-scroll :ops="ops">
              <div v-for="station in out_stations" :key="station.id" @click="affiliatelink(station.id)">
                <div v-if="hasFuel(station.fuels, 'Super E5')" class="station row">
                  <fuel-station :station="station" :fueltype="'Super E5'" />
                </div>
              </div>
            </vue-scroll>
          </div>
        </tab>
        <tab title="Diesel">
          <div :style="{height: scrollWrapperHeight}">
            <vue-scroll :ops="ops">
              <div v-for="station in out_stations" :key="station.id" @click="affiliatelink(station.id)">
                <div v-if="hasFuel(station.fuels, 'Diesel')" class="station row">
                  <fuel-station :station="station" :fueltype="'Diesel'" />
                </div>
              </div>
            </vue-scroll>
          </div>
        </tab>
      </tabs>
    </div>
    <div v-else class="tankerkoenig-info">
      <h2> Uu, oh, ein Fehler! </h2>
      <br>
      API key : {{ apikey }}
      <br>
      Fehler : {{ errormsg }}
    </div>
    <div class="tkcredentials">powered by
      <a href="https://www.tankerkoenig.de">
        <img
          svg-inline
          class="icon"
          src="../assets/TK-Logo.svg"
          style="vertical-align:middle;"
          alt=""
        >
      </a>
    </div>
  </div>
</template>
<script>

import axios from 'axios'
import { Tabs, Tab } from 'vue-slim-tabs'
import vuescroll from 'vuescroll'
import FuelStation from '../components/fuel-station'

const tkapi = axios.create({
  baseURL: 'https://creativecommons.tankerkoenig.de/api/v4/',
  timeout: 15000
})

export default {
  components: {
    Tabs,
    Tab,
    FuelStation,
    vueScroll: vuescroll
  },
  props: {
    apikey: {
      type: String,
      required: true
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
  data() {
    return {
      window: {
        width: 0,
        height: 0
      },
      updated: false,
      in_stations: [],
      out_stations: [],
      radius: 5,
      error: false,
      errormsg: '',
      scrollWrapperHeight: '100%',
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: { background: '#bfbcbe', opacity: 0.6 }
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  mounted() {
    if (this.stations && this.stations.length > 0) {
      this.in_stations = this.stations.split(',')
    }

    if (this.in_stations.length > 0) {
      this.getStations('byId')
    } else if (this.plz && this.plz.length !== 0) {
      if (this.plz.length < 5 || this.plz.length > 5 || isNaN(this.plz)) {
        this.error = true
        this.errormsg = 'Postleitzahl muss 5-stellig sein - Keine gültige PLZ.'
      } else {
        this.getStations('byPLZ')
      }
    } else if (this.lat.length > 0 && this.lng.length > 0) {
      if (isNaN(this.lat) || (Number(this.lat) < 47) || (Number(this.lat) > 56)) {
        this.error = true
        this.errormsg = 'lat Wert falsch'
      }

      if (isNaN(this.lng) || (Number(this.lng) < 6) || (Number(this.lng) > 15)) {
        this.error = true
        this.errormsg = 'lng Wert falsch'
      }

      if (this.rad) {
        this.radius = this.rad
      } else {
        this.radius = 5
      }
      this.getStations('byCoords')
    } else {
      this.error = true
      this.errormsg = 'Konfigurationsdaten fehlen: stations bzw. plz eintragen. '
    }

    this.scrollWrapperHeight = '100%'
  },
  updated: function() {
    if (!this.updated) {
      this.setScrollHeight()
    }
  },
  methods: {
    getStations(kind) {
      let url
      let params

      switch (kind) {
        case 'byId':
          url = 'stations/ids'
          params = {
            ids: this.in_stations.join(','),
            apikey: this.apikey,
            tkwc: 1.0
          }
          break
        case 'byPLZ':
          url = 'stations/postalcode'
          params = {
            postalcode: this.plz,
            apikey: this.apikey,
            tkwc: 1.0
          }
          break
        case 'byCoords':
          url = 'stations/search'
          params = {
            apikey: this.apikey,
            lat: this.lat,
            lng: this.lng,
            rad: this.rad,
            tkwc: 1.0
          }
          break
      }

      tkapi
        .get(url, { params })
        .then(response => {
          this.out_stations = response.data.stations
        })
        .catch((e) => {
          this.error = true

          if (e.message === 'Network Error') {
            this.errormsg = 'Network Error'
          } else if (e.code === 'ECONNABORTED' || e.code === 'ERR_NAME_NOT_RESOLVED') {
            this.errormsg = 'no response from server'
          } else {
            this.errormsg = e.response.data.message
          }
        })
    },

    hasFuel(fuels, fuelkind) {
      let hasFuel = false
      for (let i = 0; i < fuels.length; i++) {
        if (fuels[i].name === fuelkind) {
          hasFuel = true
        }
      }
      return hasFuel
    },
    handleResize() {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    },
    setScrollHeight() {
      const ch = this.$refs.tkwidget.clientHeight

      if (this.window.height > ch) {
        this.$nextTick(function() {
          this.scrollWrapperHeight = (ch - 80) + 'px'
          this.updated = true
        })
      }
    },
    affiliatelink(stationid) {
      const href = `https://tankerkoenig.de/home/station/${stationid}`
      window.open(href, '_blank')
    }
  }
}
</script>
<style>
    [v-cloak] {
     display: none
    }
    .tkwidget-wrapper {
        background-color: var(--bg-color, white);
        color: var(--font-color, black);
        font-family: var(--font-family, 'Open Sans,Arial,Helvetica,sans-serif');
        font-size: var(--font-size, 16px);
        overflow-x: hidden;
        overflow-y: hidden;
        height: 100%;
        width:  var(--widget-with,100%);
        max-height: var(--widget-height, 100%);
    }
    .vue-tablist {
        list-style: none;
        display: flex;
        margin: 0;
        padding: 0;
        border-bottom: 2px solid var(--tab-border-color, white);
        top: 0;
        height: 40px;
        position: absolute;
        margin-bottom: 40px;
    }
    .vue-tabpanel {
        margin-top: 40px;
        margin-bottom: 120px;
    }
    .vue-tab {
        padding: 5px 10px;
        cursor: pointer;
        user-select: none;
        border: 2px solid transparent;
        border-radius: 5px 5px 0 0;
        background-color: var(--tab-color, white);
        position: relative;
        bottom: -1px;
        opacity: 0.6;
    }
    .vue-tab[aria-selected="true"] {
        border-color: var(--tab-border-color, white);
        border-bottom-color: transparent;
        font-weight: bold;
        opacity: 1;
    }
    .station {
        padding: var(--station-padding, 15px);
        border-top: var(--divider, 1px solid #e2e2e2);
        cursor: pointer;
    }
    .tkcredentials {
        color: #34495D;
        padding: 12px;
        font-size: 12px;
        vertical-align: middle;
        background: white;
        position: sticky;
        bottom: 0;
    }
    .icon {
        padding-left: 5px;
    }
</style>
