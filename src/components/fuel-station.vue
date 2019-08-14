<template>
  <div class="row">
    <div class="price">
      <div class="gas-price">{{ station.fuels | priceForFuel(fueltype) }}<sup>{{ station.fuels | priceForFuelLast(fueltype) }}</sup></div>
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
</template>
<script>
import dayjs from 'dayjs'

export default {
  name: 'FuelStation',
  filters: {
    // price for specific fuel type
    priceForFuel: function(fuels, name) {
      if (fuels) {
        const item = fuels.filter(function(fuel) {
          return fuel.name === name
        })

        const price = Number(item[0].price) || 0.000
        return price.toString().substring(0, 4)
      }
      return
    },
    // get last digit for sup
    priceForFuelLast: function(fuels, name) {
      if (fuels) {
        const item = fuels.filter(function(fuel) {
          return fuel.name === name
        })

        const price = Number(item[0].price) || 0.000
        return price.toString().slice(-1)
      }
      return
    },
    formatDate: function(value) {
      if (value) {
        const display = dayjs(String(value)).format('HH:mm')
        return display
      } else {
        return ''
      }
    },
    /**
         helper to clean up the uppercase adress and name mess from mts-k raw data
         */
    deCapitalize: function(input) {
      if (input !== undefined) {
        input = input.replace('/', ' / ')
        input = input.replace('b. ', ' b. ')
        input = input.replace('B. ', ' B. ')
      }
      if (input !== undefined) {
        if (input.charAt(0) === 'Ä' || input.charAt(0) === 'Ö' || input.charAt(0) === 'Ü') {
          return input
        }
      }
      return (input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        if (txt === 'am ' || txt === 'AM ' || txt === 'u. ' || txt === 'U . ' || txt === 'v. ' || txt === 'V.' ||
                    txt === 'v.d ' || txt === 'V.D.' || txt === 'i.d. ' || txt === 'I.D. ' || txt === 'i.d.' ||
                    txt === 'I.D.' || txt === 'a.d. ' || txt === 'A.D. ' || txt === 'im ' || txt === 'IM ' ||
                    txt === 'b. ' || txt === 'B. ' || txt === 'i. ' || txt === 'I. ' || txt === 'a. ' ||
                    txt === 'A. ' || txt === 'd. ' || txt === 'D. ' || txt === 'h. ' || txt === 'H. ' ||
                    txt === 'ob ' || txt === 'OB ' || txt === 'an ' || txt === 'AN ' || txt === 'am ' ||
                    txt === 'AM ' || txt === 'kalten ' || txt === 'KALTEN ' || txt === 'alten ' || txt === 'ALTEN ' ||
                    txt === 'der ' || txt === 'DER ' || txt === 'bei ' || txt === 'BEI ' || txt === 'vorm ' ||
                    txt === 'VORM ' || txt === 'vor ' || txt === 'VOR ' || txt === 'auf ' || txt === 'AUF ' ||
                    txt === 'dem ' || txt === 'DEM ' || txt === 'den ' || txt === 'DEN ' || txt === 'der ' ||
                    txt === 'DER ' || txt === 'zum ' || txt === 'ZUM ' || txt === 'unter ' || txt === 'UNTER ' ||
                    txt === 'hinter ' || txt === 'HINTER ' || txt === 'ober ' || txt === 'OBER ' || txt === 'über ' ||
                    txt === 'ÜBER ' || txt === 'neben' || txt === 'NEBEN ' || txt === 'n.' || txt === 'N. ' ||
                    txt === 'o. ' || txt === 'O. ' || txt === 'V.W. ') {
          return txt.toLowerCase()
        } else {
          if (txt === 'a.T.W.' || txt === 'a.T.W. ' || txt === 'a.T.W ' || txt === 'v.W. ' || txt === 'i.H.' ||
                        txt === 'a.H.' || txt === 'a.k.M.' || txt === 'OT ' || txt === 'OT' || txt === 'a.R. ' ||
                        txt === 'A.R. ' || txt === 'i.H. ' || txt === 'I.H.' || txt === 'o.d.T.' || txt === 'VS ' ||
                        txt === 'V.S.' || txt === 'V.S. ' || txt === 'VS' || txt === 'V.S.-Villingen ') {
            return txt
          } else {
            if (txt === 'V.W. ' || txt === 'V.W.' || txt === 'v.W.') {
              return 'v.W. '
            } else {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            }
          }
        }
      }) : ''
    }
  },
  props: {
    station: {
      type: Object,
      required: true
    },
    fueltype: {
      type: String,
      required: true
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
    height: inherit;
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
    vertical-align: bottom;
    margin-top: 20px;
  }
  .tkbrand {
    font-weight: bold;
    color: var(--brand-color, black);
  }
  .gas-price {
    font-weight: bold;
    font-size: var(--price-fontsize, 24px);
    color: var(--price-color, black);
    display: table-cell;
  }

</style>
