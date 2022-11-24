const basicPalette = {
  darkest: '#17252A',
  dark: '#2B7A78',
  medium: '#3AAFA9',
  light: '#DEF2F1',
  lightest: '#FEFFF'
}

const theme = {
  basicPalette,
  boxProperties: {
    corners: '0.2em'
  },
  cardColors: {
    black: 'black',
    blue: 'blue',
    green: 'green',
    red: 'red',
    white: 'white',
    multicolor: 'yellow',
    land: 'grey'
  },
  manaSymbolColors: {
    B: 'black',
    U: 'blue',
    G: 'green',
    R: 'red',
    W: 'white',
    other: 'grey'
  },
  components: {
    buttons: {
      secondaryButton: {
        passive: {
          padding: '0.2em',
          color: 'grey',
          pointerEvents: 'none'
        },
        active: {
          padding: '0.2em'
        }
      }
    },
    containers: {
      addCardSetPopUpContainers: {
        subContainer: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          margin: '1em 0em 0em 2em'
        }
      }
    },
    text: {
      guidingText: {
        fontSize: '0.9em'
      }
    }
  }
}

export default theme