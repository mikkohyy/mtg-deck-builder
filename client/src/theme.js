const basicPalette = {
  darkest: '#608060',
  darker: '#82ac85',
  dark: '#a9c7ac',
  medium: '#bfd8c4',
  light: '#e0f3e3',
  lighter: '#e1ffe6',
  lightest: '#ffffff',
  highlight: '#bfa8bb',
  background: '#ffffff',
  subWindowBackground: '#def2f1'
}

const sharedProperties = {
  containers: {
    borderRadius: '0.3em'
  }
}

const buttons = {
  appNavigation: {
    basic: {
      textDecoration: 'none',
      fontSize: '1.2em',
      padding: '0.5em',
      color: 'black'
    },
    hovered: {
      background: basicPalette.darker
    }
  },
  functionalityNavigation: {
    basic: {
      background: basicPalette.medium,
      border: 'none',
      fontSize: '1em',
      padding: '0.5em',
    },
    hovered: {
      background: basicPalette.darker
    }
  },
  subWindow: {
    active: {
      padding: '0.3em',
      borderRadius: '0.3em',
      border: `solid 2px ${basicPalette.darkest}`,
      background: basicPalette.medium
    },
    passive: {
      padding: '0.3em',
      borderRadius: '0.3em',
      border: `solid 2px ${basicPalette.darkest}`,
      opacity: 0.6,
      pointerEvents: 'none'
    },
    hovered: {
      background: basicPalette.darker,
      cursor: 'pointer'
    }
  },
  popUpBoxButton: {
    fontSize: '0.8em',
    background: basicPalette.medium,
    border: `solid 2px ${basicPalette.darkest}`,
    borderRadius: '0.3em'
  },
  secondary: {
    passive: {
      padding: '0.3em',
      borderRadius: '0.5em',
      color: 'grey',
      border: 'solid 2px darkgrey',
      pointerEvents: 'none',
    },
    active: {
      padding: '0.3em',
      borderRadius: '0.5em',
      border: 'solid 2px darkgrey'
    }
  },
  tertiary: {
    fontSize: '0.8em',
    padding: '0.2em',
    borderRadius: '0.5em',
    color: 'grey',
    border: 'solid 2px darkgrey'
  },
  hovered: {
    backgroundColor: 'darkgrey',
  },
  tableButton: {
    normal: {
      background: basicPalette.medium,
      border: `solid 1px ${basicPalette.darkest}`,
      borderRadius: '0.3em'
    },
    hovered: {
      background: basicPalette.darker,
      cursor: 'pointer'
    }
  },
  gapBetween: '0.5em',
  corners: '0.3em'
}

const texts = {
  guidingText: {
    fontSize: '0.9em',
    fontStyle: 'italic'
  },
  cardTableControlsNameText: {
    fontSize: '0.8em',
    fontWeight: '600'
  },
  tableButtonText: {
    fontSize: '0.8em',
    fontWeight: '600',
    margin: 'auto'
  }
}

const inputs = {
  textInput: {
    height: '2em'
  }
}

const containers = {
  addCardSetPopUpContainers: {
    subContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }
  },
  verticalFlexbox: {
    display: 'flex',
    flexDirection: 'column',
  },
  subWindow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
    background: basicPalette.light,
    zIndex: 1,
    position: 'absolute',
    padding: '1.5em',
    border: `2px solid ${basicPalette.darkest}`,
    borderRadius: sharedProperties.containers.borderRadius
  },
  popUpBox: {
    background: basicPalette.lighter,
    border: `2px solid ${basicPalette.darkest}`,
    padding: '1.5em',
    position: 'fixed',
    zIndex: 2,
    borderRadius: '0.2em',
    maxWidth: '28em'
  },
  popUpTrigger: {
    fontSize: '0.7em',
    border: `2px solid ${basicPalette.darker}`,
    borderRadius: sharedProperties.containers.borderRadius,
    display: 'inline-block',
    padding: '0.1em',
    verticalAlign: 'middle'
  },
  notificationContainer: {
    maxWidth: '25em',
    zIndex: 2,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: basicPalette.light,
    border: `solid 2px ${basicPalette.darkest}`,
    borderRadius: sharedProperties.containers.borderRadius,
    padding: '1.5em',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  cardTableControls: {
    display: 'flex',
    flexDirection: 'column',
    background: basicPalette.light,
    borderTop: `solid 1px ${basicPalette.darkest}`,
    borderLeft: `solid 1px ${basicPalette.darkest}`,
    borderRight: `solid 1px ${basicPalette.darkest}`,
    padding: '1em',
    gap: '1em'
  },
  cardTableControlsElementsRow: {
    display: 'flex',
    gap: '1em'
  },
  cardTableControlsElementsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em'
  }
}

const tables = {
  head: {
    cell: {
      padding: '0.5em 0em 0.5em 0em',
      fontWeight: 500
    }
  },
  body: {
    textCell: {
      padding: '0.5em 0em 0.5em 1em',
      display: 'flex',
    },
    elementCell: {
      padding: '0.5em 0em 0.5em 0em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  rowColors: {
    odd: '#e6e6e6',
    even: basicPalette.lightest
  }
}

const theme = {
  basicPalette,
  paddings: {
    inMainView: '0em 3em 0em 3em',
    fromSides: '3em'
  },
  boxProperties: {
    corners: '0.2em'
  },
  cardColors: {
    black: 'black',
    blue: 'blue',
    green: 'green',
    red: 'red',
    white: 'lightgrey',
    multicolor: 'yellow',
    land: 'grey'
  },
  manaSymbolColors: {
    B: 'black',
    U: 'blue',
    G: 'green',
    R: 'red',
    W: 'lightgrey',
    other: 'grey'
  },
  components: {
    buttons,
    containers,
    texts,
    tables,
    inputs
  },
  sharedProperties
}

export default theme